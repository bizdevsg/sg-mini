import { NextResponse } from "next/server";

import { describeError } from "@/lib/safe-log";
import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import {
  clearClientAreaSession,
  getActiveSgbSession,
  refreshClientAreaSessionToken,
} from "@/lib/client-area-auth";
import { APP_ENV, SGB_FLAVOR } from "@/lib/env";
import { callSgbApi, SgbApiError } from "@/lib/sgb-api/client";
import { buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import {
  captureDevSample,
  maskSamplePii,
  wantsDevRaw,
} from "@/lib/sgb-api/sample-capture";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";
import { primaryAccountId } from "@/types/account-summary";

const NO_STORE = { cacheControl: "private, no-store, max-age=0" };

type ProfileSource = { method: "GET" | "POST"; path: string };

const DEFAULT_PROFILE_SOURCE: ProfileSource = {
  method: "POST",
  path: "/api/getcustomerfullinfo",
};

// Dev-only discovery (`?raw=1&probe=<name>`): read-only lookups that show what
// SGB knows about an account whose registration is unfinished.
const PROFILE_PROBES: Record<string, ProfileSource> = {
  steps: { method: "POST", path: "/api/getsteps" },
  info: { method: "POST", path: "/api/getcustomerinfo" },
  basic: { method: "GET", path: "/api/getcustomerbasicinfo" },
};

function json(body: unknown, status = 200) {
  return withApiProtectionHeaders(NextResponse.json(body, { status }), NO_STORE);
}

/**
 * GET /api/client-area/profile
 *
 * BFF for the account page header. The customer record contains sensitive
 * fields (identity/tax numbers) that the UI only reveals behind a password
 * prompt, so until the response schema is written from the real sample this
 * route only CAPTURES a masked sample in dev and never returns the raw record.
 */
export async function GET(request: Request) {
  const blocked = protectSameOriginBrowserApiRoute(request);

  if (blocked) {
    return blocked;
  }

  const session = await getActiveSgbSession();

  if (!session) {
    return json({ error: "unauthenticated" }, 401);
  }

  const customerId = primaryAccountId(session.accounts);

  if (!customerId) {
    return json({ error: "account_not_found" }, 404);
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();
  const devRaw = wantsDevRaw(request);
  const probeName = devRaw
    ? new URL(request.url).searchParams.get("probe")
    : null;
  const probe = probeName ? PROFILE_PROBES[probeName] : undefined;
  const source = probe ?? DEFAULT_PROFILE_SOURCE;

  try {
    const result = await callSgbApi({
      method: source.method,
      host: "register",
      path: source.path,
      flavor: SGB_FLAVOR,
      mode: "normal",
      token: session.token,
      deviceHeaders: buildSgbDeviceHeaders(deviceUuid),
      ...(source.method === "GET"
        ? { searchParams: { customer_id: customerId } }
        : { jsonBody: { customer_id: customerId } }),
    });

    if (result.newToken) {
      await refreshClientAreaSessionToken(session, result.newToken);
    }

    await captureDevSample(
      probeName && probe ? `customer-${probeName}.json` : "customer-fullinfo.json",
      result.data,
    );

    if (devRaw) {
      return json({ source: source.path, raw: maskSamplePii(result.data) });
    }

    return json({ captured: APP_ENV === "dev" });
  } catch (error) {
    if (error instanceof SgbApiError && error.kind === "session_expired") {
      await clearClientAreaSession();
      return json({ error: "session_expired" }, 401);
    }

    // SGB refuses profile data for accounts whose registration is not finished
    // (e.g. demo-only customers) — not a failure, there is simply nothing to show.
    if (
      error instanceof SgbApiError &&
      /registrasi harus diselesaikan/i.test(error.message)
    ) {
      return json({ status: "registration_incomplete" }, 409);
    }

    console.error("[profile] SGB call failed", describeError(error));

    return json(
      {
        error: "upstream_error",
        message:
          error instanceof SgbApiError
            ? error.safeMessage
            : "Gagal memuat data profil.",
        ...(APP_ENV === "dev" && process.env.NODE_ENV !== "production"
          ? {
              detail: {
                ...(error instanceof SgbApiError
                  ? { kind: error.kind, message: error.message }
                  : { message: String(error) }),
              },
            }
          : {}),
      },
      502,
    );
  }
}
