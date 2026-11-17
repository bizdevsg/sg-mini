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
import { sessionHasAccountForMode } from "@/types/account-summary";
import { parseDailyStatementReport } from "@/types/daily-statement";

const NO_STORE = { cacheControl: "private, no-store, max-age=0" };

function json(body: unknown, status = 200) {
  return withApiProtectionHeaders(NextResponse.json(body, { status }), NO_STORE);
}

/**
 * GET /api/client-area/daily-statement?mode=real|demo
 *
 * BFF for the Daily Statement page: GET /etrade/dailystatement on the Trading
 * host. The collection lists no parameters for it, so none are sent. It is the
 * previous trading day's closing statement, mapped with types/daily-statement.ts.
 * In dev, `?raw=1` returns the masked upstream payload instead.
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

  if (!sessionHasAccountForMode(session.accounts, mode)) {
    return json({ error: "account_not_found", mode }, 404);
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();

  try {
    const data = await mmFetch<unknown>("/etrade/dailystatement", {
      method: "GET",
      mode,
      headers: buildSgbDeviceHeaders(deviceUuid),
    });

    await captureDevSample(`dailystatement-${mode}.json`, data);

    if (wantsDevRaw(request)) {
      return json({ mode, raw: maskSamplePii(data) });
    }

    const report = parseDailyStatementReport(data);

    if (!report) {
      console.error("[daily-statement] response did not match the schema", mode);
      return json({ error: "invalid_response" }, 502);
    }

    return json({ mode, report });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return json({ error: "SESSION_EXPIRED" }, 401);
    }

    console.error("[daily-statement] SGB call failed", mode, describeError(error));

    return json(
      {
        error: "upstream_error",
        message:
          error instanceof SgbApiError
            ? error.safeMessage
            : "Gagal memuat daily statement.",
        ...(APP_ENV === "dev" && process.env.NODE_ENV !== "production"
          ? {
              detail: {
                mode,
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
