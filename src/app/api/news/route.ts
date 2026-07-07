import { NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, isSupportedLocale } from "@/locales";
import {
  getNewsArticleBySlug,
  getNewsFeed,
  NEWS_REVALIDATE_SECONDS,
} from "@/lib/news";

export const runtime = "nodejs";

const NEWS_CACHE_CONTROL_HEADER = `public, s-maxage=${NEWS_REVALIDATE_SECONDS}, stale-while-revalidate=${NEWS_REVALIDATE_SECONDS}`;

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
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": NEWS_CACHE_CONTROL_HEADER,
      },
    });
  }

  const result = await getNewsFeed(locale, limit);
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": NEWS_CACHE_CONTROL_HEADER,
    },
  });
}
