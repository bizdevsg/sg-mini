import { NextResponse } from "next/server";

import { describeError } from "@/lib/safe-log";
import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import {
  getActiveSgbSession,
} from "@/lib/client-area-auth";
import { parseClientAreaCustomerProfile } from "@/lib/client-area-profile";
import { APP_ENV } from "@/lib/env";
import { SgbApiError } from "@/lib/sgb-api/client";
import { buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import { mmFetch, SessionExpiredError } from "@/lib/sgb-api/mm-fetch";
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
 * BFF for the authenticated customer profile. Only mapped, browser-safe fields
 * are returned; identity and tax numbers are represented by masked placeholders
 * and can never leave this route in their raw form.
 */
export async function GET(request: Request) {
  const blocked = protectSameOriginBrowserApiRoute(request);

  if (blocked) {
    return blocked;
  }

  const session = await getActiveSgbSession();

  if (!session) {
    return json({ error: "SESSION_EXPIRED" }, 401);
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
    const headers = new Headers(buildSgbDeviceHeaders(deviceUuid));
    headers.set("Content-Type", "application/json");
    const requestPath =
      source.method === "GET"
        ? `${source.path}?customer_id=${encodeURIComponent(customerId)}`
        : source.path;
    const data = await mmFetch<unknown>(requestPath, {
      method: source.method,
      host: "register",
      mode: "real",
      headers,
      ...(source.method === "GET"
        ? {}
        : { body: JSON.stringify({ customer_id: customerId }) }),
    });

    await captureDevSample(
      probeName && probe ? `customer-${probeName}.json` : "customer-fullinfo.json",
      data,
    );

    if (devRaw) {
      return json({ source: source.path, raw: maskSamplePii(data) });
    }

    const profile = parseClientAreaCustomerProfile(data);

    if (!profile) {
      console.error("[profile] response did not match the verified schema");
      return json({ error: "invalid_response" }, 502);
    }

    return json({ profile });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return json({ error: "SESSION_EXPIRED" }, 401);
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
