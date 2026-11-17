import { NextResponse } from "next/server";

import { describeError } from "@/lib/safe-log";
import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import {
  getActiveSgbSession,
} from "@/lib/client-area-auth";
import { SgbApiError } from "@/lib/sgb-api/client";
import { buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import { mmFetch, SessionExpiredError } from "@/lib/sgb-api/mm-fetch";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";

const NO_STORE = { cacheControl: "private, no-store, max-age=0" };
const REFRESH_REQUEST_HEADER = "x-client-area-session-refresh";

function json(body: unknown, status = 200) {
  return withApiProtectionHeaders(NextResponse.json(body, { status }), NO_STORE);
}

/**
 * Keeps the upstream Etrade session alive without exposing its bearer token to
 * browser JavaScript. The custom header makes this a non-simple browser POST,
 * while the existing Fetch Metadata guard rejects cross-origin callers.
 */
export async function POST(request: Request) {
  const blocked = protectSameOriginBrowserApiRoute(request);

  if (blocked) {
    return blocked;
  }

  if (request.headers.get(REFRESH_REQUEST_HEADER) !== "1") {
    return json({ error: "invalid_refresh_request" }, 403);
  }

  const session = await getActiveSgbSession();

  if (!session) {
    return json({ error: "SESSION_EXPIRED" }, 401);
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();

  try {
    // list-account is the lightest authenticated SSO endpoint already allowed
    // by the view-only BFF. A successful response may rotate the bearer token
    // in its `csrf` response header.
    await mmFetch("/sso/list-account/v1", {
      method: "GET",
      host: "sso",
      mode: "real",
      headers: buildSgbDeviceHeaders(deviceUuid),
    });
    return json({ refreshed: true });
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return json({ error: "SESSION_EXPIRED" }, 401);
    }

    console.error("[session-refresh] SGB call failed", describeError(error));

    return json(
      {
        error: "upstream_error",
        message:
          error instanceof SgbApiError
            ? error.safeMessage
            : "Gagal memperbarui sesi.",
      },
      502,
    );
  }
}
