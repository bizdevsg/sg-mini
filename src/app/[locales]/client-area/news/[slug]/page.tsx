import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAreaNewsDetailView } from "@/components/organisms/ClientAreaNewsDetailView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import {
  createNewsDetailFromFeedArticle,
  getNewsArticleBySlug,
  getNewsFeed,
} from "@/lib/news";
import {
  getLocaleConfig,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

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
    return detailedArticle;
  }

  const feedArticle = feedArticles.find((candidate) => candidate.slug === slug);
  return feedArticle ? createNewsDetailFromFeedArticle(feedArticle, locale) : null;
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

  if (!resolvedArticle) {
    notFound();
  }

  return {
    title: resolvedArticle.title,
    description: resolvedArticle.summary,
    alternates: {
      canonical: `/${locales}/client-area/news/${resolvedArticle.slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/client-area/news/${resolvedArticle.slug}`,
        ]),
      ),
    },
  };
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

  if (!article) {
    notFound();
  }

  const nonCurrentArticles = feedArticles.filter(
    (candidate) => candidate.slug !== article.slug,
  );

  const relatedCandidates = nonCurrentArticles.filter(
    (candidate) =>
      candidate.displayCategory === article.displayCategory ||
      candidate.category === article.category,
  );

  const relatedArticles = (
    relatedCandidates.length ? relatedCandidates : nonCurrentArticles
  ).slice(0, 4);

  const latestArticles = nonCurrentArticles.slice(0, 4);

  return (
    <ClientAreaNewsDetailView
      article={article}
      breakingNews={breakingNews}
      latestArticles={latestArticles}
      locale={locales}
      relatedArticles={relatedArticles}
    />
  );
}
