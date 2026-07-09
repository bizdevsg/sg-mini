import "server-only";

import { NextResponse } from "next/server";

const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN?.trim() ?? "";
const APP_ENV = process.env.APP_ENV?.trim().toLowerCase() ?? "dev";
const IS_API_PROTECTION_ENABLED = APP_ENV !== "dev";

function isSameOriginUrl(value: string, expectedOrigin: string) {
  try {
    return new URL(value).origin === expectedOrigin;
  } catch {
    return false;
  }
}

function hasValidInternalApiToken(request: Request) {
  if (!INTERNAL_API_TOKEN) {
    return false;
  }

  return request.headers.get("x-internal-api-token") === INTERNAL_API_TOKEN;
}

function isTrustedSameOriginBrowserRequest(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();

  if (secFetchSite !== "same-origin") {
    return false;
  }

  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");

  if (originHeader && !isSameOriginUrl(originHeader, requestOrigin)) {
    return false;
  }

  if (refererHeader && !isSameOriginUrl(refererHeader, requestOrigin)) {
    return false;
  }

  return Boolean(originHeader || refererHeader);
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
