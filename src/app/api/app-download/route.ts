import { NextResponse } from "next/server";

import {
  DEFAULT_LOCALE,
  isSupportedLocale,
} from "@/locales";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";

function resolveStoreLinks(localeParam: string | null) {
  const locale =
    localeParam && isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);

  return {
    fallbackUrl: `/${locale}/aplikasi-solid-gold`,
    googlePlayUrl: googlePlayLink,
    appStoreUrl: appStoreLink,
  };
}

function isIosDevice(userAgent: string) {
  return /iphone|ipad|ipod|ios/i.test(userAgent);
}

function isAndroidDevice(userAgent: string) {
  return /android/i.test(userAgent);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAgent = request.headers.get("user-agent") ?? "";
  const { fallbackUrl, googlePlayUrl, appStoreUrl } = resolveStoreLinks(
    searchParams.get("locale"),
  );

  if (isIosDevice(userAgent)) {
    return NextResponse.redirect(appStoreUrl);
  }

  if (isAndroidDevice(userAgent)) {
    return NextResponse.redirect(googlePlayUrl);
  }

  return NextResponse.redirect(new URL(fallbackUrl, request.url));
}
