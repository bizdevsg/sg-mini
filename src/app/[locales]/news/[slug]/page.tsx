import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getNewsPageContent } from "@/components/content/news-content";
import { NewsDetailArticleBody } from "@/components/organisms/NewsDetailArticleBody";
import { NewsDetailBreadcrumb } from "@/components/organisms/NewsDetailBreadcrumb";
import { NewsDetailHeader } from "@/components/organisms/NewsDetailHeader";
import { NewsDetailSidebar } from "@/components/organisms/NewsDetailSidebar";
import {
  getNewsArticleBySlug,
  getNewsFeed,
  getStaticNewsArticleBySlug,
  getStaticNewsFeed,
} from "@/lib/news";
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

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
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

  const staticArticleResult = getStaticNewsArticleBySlug(locales, slug);
  const { article } = staticArticleResult.article
    ? staticArticleResult
    : await getNewsArticleBySlug(locales, slug);

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

  const staticArticleResult = getStaticNewsArticleBySlug(locales, slug);
  const staticFeedResult = getStaticNewsFeed(locales, 24);

  const [{ article }, { articles: feedArticles }] = staticArticleResult.article
    ? await Promise.all([
        Promise.resolve(staticArticleResult),
        Promise.resolve(staticFeedResult),
      ])
    : await Promise.all([
        getNewsArticleBySlug(locales, slug),
        getNewsFeed(locales, 24),
      ]);

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

  const labels = getMessages(locales).newsDetailPage;

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
          latestArticles={latestArticles}
          locale={locales}
          labels={labels}
        />
      </div>
    </SectionContainer>
  );
}
