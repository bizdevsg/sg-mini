import { NextRequest, NextResponse } from "next/server";

import {
  protectInternalApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/locales";
import {
  getNewsArticleBySlug,
  getNewsFeed,
  NEWS_REVALIDATE_SECONDS,
} from "@/lib/news";

export const runtime = "nodejs";

const NEWS_CACHE_CONTROL_HEADER = `public, s-maxage=${NEWS_REVALIDATE_SECONDS}, stale-while-revalidate=${NEWS_REVALIDATE_SECONDS}`;

export async function GET(request: NextRequest) {
  const blockedResponse = protectInternalApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const localeParam = searchParams.get("locale") ?? DEFAULT_LOCALE;
  const locale = isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE;
  const limitParam = searchParams.get("limit");
  const limit =
    limitParam && /^\d+$/.test(limitParam) ? Number.parseInt(limitParam, 10) : undefined;

  if (slug) {
    const result = await getNewsArticleBySlug(locale, slug);
    return withApiProtectionHeaders(
      NextResponse.json(result, {
        headers: {
          "Cache-Control": NEWS_CACHE_CONTROL_HEADER,
        },
      }),
      {
        cacheControl: "private, no-store, max-age=0",
      },
    );
  }

  const result = await getNewsFeed(locale, limit);
  return withApiProtectionHeaders(
    NextResponse.json(result, {
      headers: {
        "Cache-Control": NEWS_CACHE_CONTROL_HEADER,
      },
    }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
