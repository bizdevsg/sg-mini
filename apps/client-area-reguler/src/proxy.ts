import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_LOCALE = "id";
const SUPPORTED_LOCALES = new Set(["id", "en"]);
const RESERVED_SEGMENTS = new Set(["api"]);
const CLIENT_AREA_SEGMENT = "client-area";
const websiteBaseUrl = (
  process.env.NEXT_PUBLIC_WEBSITE_URL?.trim() ||
  "https://mini.sg-berjangka.com"
).replace(/\/+$/, "");

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

  if (SUPPORTED_LOCALES.has(firstSegment)) {
    const isLocaleRoot = segments.length === 1;
    const isClientAreaRoute = segments[1] === CLIENT_AREA_SEGMENT;

    if (isLocaleRoot || isClientAreaRoute) {
      return NextResponse.next();
    }

    const websiteUrl = new URL(`${pathname}${request.nextUrl.search}`, websiteBaseUrl);
    return NextResponse.redirect(websiteUrl);
  }

  if (
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
