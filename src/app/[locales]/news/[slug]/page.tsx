import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { NewsFeedArticleCard } from "@/components/molecules/NewsFeedArticleCard";
import { NewsDetailArticleBody } from "@/components/organisms/NewsDetailArticleBody";
import { NewsDetailBreadcrumb } from "@/components/organisms/NewsDetailBreadcrumb";
import { NewsDetailHeader } from "@/components/organisms/NewsDetailHeader";
import { NewsDetailSidebar } from "@/components/organisms/NewsDetailSidebar";
import {
  createNewsDetailFromFeedArticle,
  findNewsFeedArticleByRouteSlug,
  getNewsArticleBySlug,
  getNewsFeed,
} from "@/lib/news";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

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

  if (!article?.article) {
    notFound();
  }

  return {
    title: article.article.title,
    description: article.article.summary,
    alternates: {
      canonical: `/${locales}/news/${article.article.slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/news/${article.article.slug}`,
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

  if (!article?.article) {
    notFound();
  }

  if (article.matchedFeedArticle && article.matchedFeedArticle.slug !== slug) {
    redirect(`/${locales}/news/${article.matchedFeedArticle.slug}`);
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

  const messages = getMessages(locales);
  const labels = messages.newsDetailPage;

  return (
    <SectionContainer className="py-16 sm:py-20 mt-5">
      <ScrollReveal effect="fade-right">
        <NewsDetailBreadcrumb
          locale={locales}
          newsLabel={labels.news}
          title={article.article.title}
        />
      </ScrollReveal>

      <NewsDetailHeader
        categoryLabel={article.article.displayCategory}
        locale={locales}
        publishedAt={article.article.publishedAt}
        slug={article.article.slug}
        title={article.article.title}
      />

      <ScrollReveal className="mt-8 overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-950/40">
        <img
          src={article.article.imageSrc}
          alt={article.article.title}
          width={1280}
          height={720}
          decoding="async"
          className="block max-h-[520px] w-full object-cover"
        />
      </ScrollReveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <NewsDetailArticleBody bodyHtml={article.article.bodyHtml} />

        <NewsDetailSidebar
          relatedArticles={relatedArticles}
          locale={locales}
          labels={labels}
        />
      </div>

      {latestArticles.length ? (
        <section className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
          <ScrollReveal effect="fade-right">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {labels.latestNews}
            </h2>
          </ScrollReveal>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:auto-rows-fr sm:grid-cols-2">
            {latestArticles.map((latestArticle, index) => (
              <NewsFeedArticleCard
                delay={index * 250}
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
