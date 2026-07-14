import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_LOCALE = "id";
const SUPPORTED_LOCALES = new Set(["id", "en"]);
const RESERVED_SEGMENTS = new Set(["api"]);

function hasFileExtension(pathname: string) {
  return /\.[^/]+$/.test(pathname);
}

function resolveLocalizedPathname(pathname: string) {
  if (pathname === "/") {
    return `/${DEFAULT_LOCALE}`;
  }

  return `/${DEFAULT_LOCALE}${pathname}`;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (!firstSegment) {
    return NextResponse.next();
  }

  if (firstSegment === "trade-pilot") {
    const localeSegment = segments[1];

    if (!localeSegment) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/trade-pilot/${DEFAULT_LOCALE}`;
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  if (
    SUPPORTED_LOCALES.has(firstSegment) ||
    RESERVED_SEGMENTS.has(firstSegment) ||
    pathname.startsWith("/_next/") ||
    hasFileExtension(pathname)
  ) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = resolveLocalizedPathname(pathname);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
