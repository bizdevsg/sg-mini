import { NextResponse } from "next/server";

import { describeError } from "@/lib/safe-log";
import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getActiveSgbSession } from "@/lib/client-area-auth";
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
import {
  parseAccountSummary,
  parseOpenPositions,
  parseSettledPositions,
  sessionHasAccountForMode,
} from "@/types/account-summary";

const NO_STORE = { cacheControl: "private, no-store, max-age=0" };

function json(body: unknown, status = 200) {
  return withApiProtectionHeaders(NextResponse.json(body, { status }), NO_STORE);
}

/**
 * GET /api/client-area/account-summary?mode=real|demo
 *
 * BFF for the Beranda account card. The SGB token never leaves the server: it
 * is read from the encrypted session cookie, and the browser only gets the
 * mapped card fields (see types/account-summary.ts).
 */
export async function GET(request: Request) {
  const blocked = protectSameOriginBrowserApiRoute(request);

  if (blocked) {
    return blocked;
  }

  const mode = new URL(request.url).searchParams.get("mode");

  if (mode !== "real" && mode !== "demo") {
    return json({ error: "invalid_mode" }, 400);
  }

  const session = await getActiveSgbSession();

  if (!session) {
    return json({ error: "SESSION_EXPIRED" }, 401);
  }

  // Saved up front so the sample exists even when the summary call below fails.
  await captureDevSample("list-account.json", session.accounts);

  if (!sessionHasAccountForMode(session.accounts, mode)) {
    return json({ error: "account_not_found", mode }, 404);
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();

  try {
    const data = await mmFetch<unknown>("/etrade/accountsummary", {
      method: "GET",
      mode,
      headers: buildSgbDeviceHeaders(deviceUuid),
    });

    await captureDevSample(`accountsummary-${mode}.json`, data);

    if (wantsDevRaw(request)) {
      return json({ mode, raw: maskSamplePii(data) });
    }

    const account = parseAccountSummary(data);

    if (!account) {
      console.error("[account-summary] response did not match the schema", mode);
      return json({ error: "invalid_response" }, 502);
    }

    // Open positions ride on the same payload — one call feeds the Beranda card
    // and the Transaksi page. An absent list simply means "none".
    return json({
      mode,
      account,
      positions: parseOpenPositions(data) ?? [],
      settled: parseSettledPositions(data) ?? [],
    });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return json({ error: "SESSION_EXPIRED" }, 401);
    }

    console.error("[account-summary] SGB call failed", mode, describeError(error));

    return json(
      {
        error: "upstream_error",
        message:
          error instanceof SgbApiError
            ? error.safeMessage
            : "Gagal memuat data akun.",
        // Raw upstream diagnostics — dev builds only, never in production.
        ...(APP_ENV === "dev" && process.env.NODE_ENV !== "production"
          ? {
              detail: {
                mode,
                accountsInSession: Array.isArray(session.accounts)
                  ? session.accounts.length
                  : typeof session.accounts,
                ...(error instanceof SgbApiError
                  ? { kind: error.kind, message: error.message, errorType: error.errorType }
                  : { message: String(error) }),
              },
            }
          : {}),
      },
      502,
    );
  }
}
