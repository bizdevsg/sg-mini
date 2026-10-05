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
import { toSgbApiMode } from "@/lib/sgb-api/hosts";
import {
  captureDevSample,
  maskSamplePii,
  wantsDevRaw,
} from "@/lib/sgb-api/sample-capture";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";
import { sessionHasAccountForMode } from "@/types/account-summary";
import { parseTradeHistory } from "@/types/trade-history";

const NO_STORE = { cacheControl: "private, no-store, max-age=0" };
const PAGE_SIZE = 10;
const MAX_PAGE = 1000;

function json(body: unknown, status = 200) {
  return withApiProtectionHeaders(NextResponse.json(body, { status }), NO_STORE);
}

/**
 * GET /api/client-area/trade-history?mode=real|demo&page=0
 *
 * BFF for the Transaksi "Trade History" tab: GET /etrade/tradehistory/10/{page}
 * on the Trading host, mapped with types/trade-history.ts. In dev, `?raw=1`
 * returns the masked upstream payload instead.
 */
export async function GET(request: Request) {
  const blocked = protectSameOriginBrowserApiRoute(request);

  if (blocked) {
    return blocked;
  }

  const params = new URL(request.url).searchParams;
  const mode = params.get("mode");
  const page = Number(params.get("page") ?? "0");

  if (mode !== "real" && mode !== "demo") {
    return json({ error: "invalid_mode" }, 400);
  }

  if (!Number.isInteger(page) || page < 0 || page > MAX_PAGE) {
    return json({ error: "invalid_page" }, 400);
  }

  const session = await getActiveSgbSession();

  if (!session) {
    return json({ error: "unauthenticated" }, 401);
  }

  if (!sessionHasAccountForMode(session.accounts, mode)) {
    return json({ error: "account_not_found", mode }, 404);
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();

  try {
    const result = await callSgbApi({
      method: "GET",
      host: "trading",
      path: `/etrade/tradehistory/${PAGE_SIZE}/${page}`,
      flavor: SGB_FLAVOR,
      mode: toSgbApiMode(mode),
      token: session.token,
      deviceHeaders: buildSgbDeviceHeaders(deviceUuid),
    });

    if (result.newToken) {
      await refreshClientAreaSessionToken(session, result.newToken);
    }

    await captureDevSample(`tradehistory-${mode}.json`, result.data);

    if (wantsDevRaw(request)) {
      return json({ mode, page, raw: maskSamplePii(result.data) });
    }

    const history = parseTradeHistory(result.data);

    if (!history) {
      console.error("[trade-history] response did not match the schema", mode);
      return json({ error: "invalid_response" }, 502);
    }

    // `count` is the total when the API provides it; otherwise a full page is the
    // only hint that another page may exist.
    const hasNext =
      history.total !== null
        ? (page + 1) * PAGE_SIZE < history.total
        : history.items.length >= PAGE_SIZE;

    return json({
      mode,
      page,
      pageSize: PAGE_SIZE,
      items: history.items,
      hasNext,
    });
  } catch (error) {
    if (error instanceof SgbApiError && error.kind === "session_expired") {
      await clearClientAreaSession();
      return json({ error: "session_expired" }, 401);
    }

    console.error("[trade-history] SGB call failed", mode, describeError(error));

    return json(
      {
        error: "upstream_error",
        message:
          error instanceof SgbApiError
            ? error.safeMessage
            : "Gagal memuat riwayat transaksi.",
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
