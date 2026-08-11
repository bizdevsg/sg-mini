import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { NewsDetailArticleBody } from "@/components/organisms/NewsDetailArticleBody";
import { NewsDetailBreadcrumb } from "@/components/organisms/NewsDetailBreadcrumb";
import { NewsDetailHeader } from "@/components/organisms/NewsDetailHeader";
import { NewsDetailSidebar } from "@/components/organisms/NewsDetailSidebar";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import {
  findMarketAcademyFeedArticleByRouteSlug,
  getMarketAcademyArticleBySlug,
  getMarketAcademyFeed,
} from "@/lib/market-academy";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

const MARKET_ACADEMY_HREF_BASE_PATH = "/education/market-academy";
const RELATED_ARTICLES_LIMIT = 4;

type MarketAcademyDetailPageProps = {
  params: Promise<{ locales: string; slug: string }>;
};

export const revalidate = 300;

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

function resolveDetailArticle(
  slug: string,
  detailedArticle: Awaited<ReturnType<typeof getMarketAcademyArticleBySlug>>["article"],
  feedArticles: Awaited<ReturnType<typeof getMarketAcademyFeed>>["articles"],
) {
  if (detailedArticle) {
    return {
      article: detailedArticle,
      matchedFeedArticle: findMarketAcademyFeedArticleByRouteSlug(feedArticles, slug),
    };
  }

  const feedArticle = findMarketAcademyFeedArticleByRouteSlug(feedArticles, slug);

  return feedArticle
    ? {
      article: {
        ...feedArticle,
        bodyHtml: `<p>${feedArticle.summary}</p>`,
      },
      matchedFeedArticle: feedArticle,
    }
    : null;
}

export async function generateMetadata({
  params,
}: MarketAcademyDetailPageProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const [{ article: detailedArticle }, { articles: feedArticles }] = await Promise.all([
    getMarketAcademyArticleBySlug(locales, slug),
    getMarketAcademyFeed(locales),
  ]);
  const article = resolveDetailArticle(slug, detailedArticle, feedArticles);

  if (!article?.article) {
    notFound();
  }

  return {
    title: article.article.title,
    description: article.article.summary,
    alternates: {
      canonical: `/${locales}${MARKET_ACADEMY_HREF_BASE_PATH}/${article.article.slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}${MARKET_ACADEMY_HREF_BASE_PATH}/${article.article.slug}`,
        ]),
      ),
    },
  };
}

export default async function MarketAcademyDetailPage({
  params,
}: MarketAcademyDetailPageProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const [{ article }, { articles: feedArticles }] = await Promise.all([
    getMarketAcademyArticleBySlug(locales, slug),
    getMarketAcademyFeed(locales),
  ]);
  const resolvedArticle = resolveDetailArticle(slug, article, feedArticles);

  if (!resolvedArticle?.article) {
    notFound();
  }

  if (
    resolvedArticle.matchedFeedArticle &&
    resolvedArticle.matchedFeedArticle.slug !== slug
  ) {
    redirect(
      `/${locales}${MARKET_ACADEMY_HREF_BASE_PATH}/${resolvedArticle.matchedFeedArticle.slug}`,
    );
  }

  const relatedArticles = feedArticles
    .filter((candidate) => candidate.slug !== resolvedArticle.article.slug)
    .slice(0, RELATED_ARTICLES_LIMIT);

  const messages = getMessages(locales).marketAcademyDetailPage;

  return (
    <SectionContainer className="py-16 sm:py-20 mt-5">
      <ScrollReveal effect="fade-right">
        <NewsDetailBreadcrumb
          locale={locales}
          newsLabel={messages.marketAcademy}
          newsHref={`/${locales}${MARKET_ACADEMY_HREF_BASE_PATH}`}
          title={resolvedArticle.article.title}
        />
      </ScrollReveal>

      <NewsDetailHeader
        categoryLabel={resolvedArticle.article.displayCategory}
        locale={locales}
        publishedAt={resolvedArticle.article.publishedAt}
        sharePathBase={MARKET_ACADEMY_HREF_BASE_PATH}
        slug={resolvedArticle.article.slug}
        title={resolvedArticle.article.title}
      />

      <ScrollReveal className="mt-8 overflow-hidden rounded-2xl border border-yellow-500/20 bg-zinc-950/40">
        <img
          src={resolvedArticle.article.imageSrc}
          alt={resolvedArticle.article.title}
          width={1280}
          height={720}
          decoding="async"
          className="block max-h-[520px] w-full object-cover"
        />
      </ScrollReveal>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <NewsDetailArticleBody bodyHtml={resolvedArticle.article.bodyHtml} />

        <NewsDetailSidebar
          relatedArticles={relatedArticles}
          hrefBasePath={MARKET_ACADEMY_HREF_BASE_PATH}
          locale={locales}
          labels={{ relatedNews: messages.relatedTitle }}
        />
      </div>
    </SectionContainer>
  );
}
