import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { NewsFeedArticleCard } from "@/components/molecules/NewsFeedArticleCard";
import { NewsDetailArticleBody } from "@/components/organisms/NewsDetailArticleBody";
import { NewsDetailBreadcrumb } from "@/components/organisms/NewsDetailBreadcrumb";
import { NewsDetailHeader } from "@/components/organisms/NewsDetailHeader";
import { NewsDetailSidebar } from "@/components/organisms/NewsDetailSidebar";
import {
  createNewsDetailFromFeedArticle,
  getNewsArticleBySlug,
  getNewsFeed,
} from "@/lib/news";
import { getNewsPageContent } from "@/locales/news-page-content";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type NewsDetailPageProps = {
  params: Promise<{ locales: string; slug: string }>;
};

export const revalidate = 60;

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

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    getNewsPageContent(locale).latest.articles.map((article) => ({
      locales: locale,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const [{ article: detailedArticle }, { articles: feedArticles }] =
    await Promise.all([getNewsArticleBySlug(locales, slug), getNewsFeed(locales)]);
  const article = resolveDetailArticle(
    locales,
    slug,
    detailedArticle,
    feedArticles,
  );

  if (!article) {
    notFound();
  }

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: `/${locales}/news/${article.slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/news/${article.slug}`,
        ]),
      ),
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);
  const [detailResult, feedResult] = await Promise.all([
    getNewsArticleBySlug(locales, slug),
    getNewsFeed(locales),
  ]);
  const article = resolveDetailArticle(
    locales,
    slug,
    detailResult.article,
    feedResult.articles,
  );
  const feedArticles = feedResult.articles;

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

  const messages = getMessages(locales);
  const labels = messages.newsDetailPage;

  return (
    <SectionContainer className="py-16 sm:py-20">
      <NewsDetailBreadcrumb
        locale={locales}
        newsLabel={labels.news}
        title={article.title}
      />

      <NewsDetailHeader
        locale={locales}
        publishedAt={article.publishedAt}
        slug={article.slug}
        title={article.title}
      />

      <div className="mt-8 overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-950/40">
        <img
          src={article.imageSrc}
          alt={article.title}
          width={1280}
          height={720}
          decoding="async"
          className="block max-h-[520px] w-full object-cover"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <NewsDetailArticleBody bodyHtml={article.bodyHtml} />

        <NewsDetailSidebar
          relatedArticles={relatedArticles}
          locale={locales}
          labels={labels}
        />
      </div>

      {latestArticles.length ? (
        <section className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {labels.latestNews}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:auto-rows-fr sm:grid-cols-2">
            {latestArticles.map((latestArticle, index) => (
              <NewsFeedArticleCard
                key={latestArticle.slug}
                article={latestArticle}
                locale={locales}
                readMoreLabel={messages.newsBrowser.readArticle}
                prioritizeImage={index < 2}
              />
            ))}
          </div>
        </section>
      ) : null}
    </SectionContainer>
  );
}
