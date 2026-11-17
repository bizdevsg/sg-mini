import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ClientAreaNewsDetailView } from "@/components/organisms/ClientAreaNewsDetailView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { buildPrivateMetadata } from "@/lib/metadata";
import {
  createNewsDetailFromFeedArticle,
  findNewsFeedArticleByRouteSlug,
  getNewsArticleBySlug,
  getNewsFeed,
} from "@/lib/news";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaNewsDetailPageProps = {
  params: Promise<{ locales: string; slug: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

function resolveDetailArticle(
  locale: AppLocale,
  slug: string,
  detailedArticle: Awaited<ReturnType<typeof getNewsArticleBySlug>>["article"],
  feedArticles: Awaited<ReturnType<typeof getNewsFeed>>["articles"],
) {
  if (detailedArticle) {
    return {
      article: detailedArticle,
      matchedFeedArticle: findNewsFeedArticleByRouteSlug(feedArticles, slug),
    };
  }

  const feedArticle = findNewsFeedArticleByRouteSlug(feedArticles, slug);

  return feedArticle
    ? {
      article: createNewsDetailFromFeedArticle(feedArticle, locale),
      matchedFeedArticle: feedArticle,
    }
    : null;
}

export async function generateMetadata({
  params,
}: ClientAreaNewsDetailPageProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const [{ article: detailedArticle }, { articles: feedArticles }] = await Promise.all([
    getNewsArticleBySlug(locales, slug),
    getNewsFeed(locales),
  ]);
  const resolvedArticle = resolveDetailArticle(
    locales,
    slug,
    detailedArticle,
    feedArticles,
  );

  if (!resolvedArticle?.article) {
    notFound();
  }

  return buildPrivateMetadata({
    title: `${resolvedArticle.article.title} | Client Area News`,
    description: resolvedArticle.article.summary,
    locale: locales,
    path: `/${locales}/client-area/news/${resolvedArticle.article.slug}`,
  });
}

export default async function Page({
  params,
}: ClientAreaNewsDetailPageProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  const [{ article: detailedArticle }, { articles: feedArticles }, breakingNews] = await Promise.all([
    getNewsArticleBySlug(locales, slug),
    getNewsFeed(locales),
    getClientAreaBreakingNews(locales),
  ]);
  const article = resolveDetailArticle(locales, slug, detailedArticle, feedArticles);

  if (!article?.article) {
    notFound();
  }

  if (article.matchedFeedArticle && article.matchedFeedArticle.slug !== slug) {
    redirect(`/${locales}/client-area/news/${article.matchedFeedArticle.slug}`);
  }

  const nonCurrentArticles = feedArticles.filter(
    (candidate) => candidate.slug !== article.article.slug,
  );

  const relatedCandidates = nonCurrentArticles.filter(
    (candidate) =>
      candidate.displayCategory === article.article.displayCategory ||
      candidate.category === article.article.category,
  );

  const relatedArticles = (
    relatedCandidates.length ? relatedCandidates : nonCurrentArticles
  ).slice(0, 4);

  const latestArticles = nonCurrentArticles.slice(0, 4);

  return (
    <ClientAreaNewsDetailView
      article={article.article}
      breakingNews={breakingNews}
      latestArticles={latestArticles}
      locale={locales}
      relatedArticles={relatedArticles}
    />
  );
}
