import "server-only";

import { NextResponse } from "next/server";

const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN?.trim() ?? "";
const APP_ENV = process.env.APP_ENV?.trim().toLowerCase() ?? "dev";
const IS_API_PROTECTION_ENABLED = APP_ENV === "prod";

function hasValidInternalApiToken(request: Request) {
  if (!INTERNAL_API_TOKEN) {
    return false;
  }

  return request.headers.get("x-internal-api-token") === INTERNAL_API_TOKEN;
}

function isTrustedSameOriginBrowserRequest(request: Request) {
  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();

  // sec-fetch-site is a browser-computed, unspoofable signal of whether this
  // request originated from a document on the same origin the browser
  // navigated to. Comparing Origin/Referer against request.url's origin is
  // unreliable behind reverse proxies and dev tunnels (Docker/standalone
  // deploys, devtunnels.ms, ngrok, etc.), where the Node process only ever
  // sees the internal host, never the public-facing one — so we rely on
  // sec-fetch-site alone.
  return secFetchSite === "same-origin";
}

function withHiddenRouteResponse(status: 403 | 404) {
  return withApiProtectionHeaders(
    NextResponse.json(
      { error: status === 404 ? "Not found." : "Forbidden." },
      { status },
    ),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}

type ApiProtectionHeadersOptions = {
  cacheControl?: string;
};

export function withApiProtectionHeaders<T extends Response>(
  response: T,
  options: ApiProtectionHeadersOptions = {},
) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "same-origin");

  if (options.cacheControl && !response.headers.has("Cache-Control")) {
    response.headers.set("Cache-Control", options.cacheControl);
  }

  return response;
}

export function protectInternalApiRoute(request: Request) {
  if (!IS_API_PROTECTION_ENABLED) {
    return null;
  }

  if (hasValidInternalApiToken(request)) {
    return null;
  }

  return withHiddenRouteResponse(404);
}

export function protectSameOriginBrowserApiRoute(request: Request) {
  if (!IS_API_PROTECTION_ENABLED) {
    return null;
  }

  if (
    hasValidInternalApiToken(request) ||
    isTrustedSameOriginBrowserRequest(request)
  ) {
    return null;
  }

  return withHiddenRouteResponse(403);
}
