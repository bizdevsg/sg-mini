import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, isSupportedLocale } from "@/locales";
import { getNewsArticleBySlug, getNewsFeed } from "@/lib/news";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const localeParam = searchParams.get("locale") ?? DEFAULT_LOCALE;
  const locale = isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const limitParam = searchParams.get("limit");
  const limit =
    limitParam && /^\d+$/.test(limitParam) ? Number.parseInt(limitParam, 10) : undefined;

  if (slug) {
    const result = await getNewsArticleBySlug(locale, slug);
    return NextResponse.json(result);
  }

  const result = await getNewsFeed(locale, limit);
  return NextResponse.json(result);
}
