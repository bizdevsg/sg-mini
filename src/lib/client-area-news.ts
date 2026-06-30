import "server-only";

import {
  mapNewsFeedArticleToBreakingNews,
  mapNewsFeedArticleToClientAreaArticle,
} from "@/components/organisms/client-area.shared";
import type {
  ArticleItem,
  BreakingNewsItem,
} from "@/components/organisms/client-area.types";
import { getNewsFeed } from "@/lib/news";
import type { AppLocale } from "@/locales";

const CLIENT_AREA_BREAKING_NEWS_LIMIT = 5;

export async function getClientAreaNewsContent(locale: AppLocale): Promise<{
  articles: ArticleItem[];
  breakingNews: BreakingNewsItem[];
}> {
  const { articles: feedArticles } = await getNewsFeed(locale);

  return {
    articles: feedArticles.map((article) =>
      mapNewsFeedArticleToClientAreaArticle(article, locale),
    ),
    breakingNews: feedArticles
      .slice(0, CLIENT_AREA_BREAKING_NEWS_LIMIT)
      .map((article) => mapNewsFeedArticleToBreakingNews(article, locale)),
  };
}

export async function getClientAreaBreakingNews(
  locale: AppLocale,
): Promise<BreakingNewsItem[]> {
  const { articles: feedArticles } = await getNewsFeed(
    locale,
    CLIENT_AREA_BREAKING_NEWS_LIMIT,
  );

  return feedArticles.map((article) =>
    mapNewsFeedArticleToBreakingNews(article, locale),
  );
}
