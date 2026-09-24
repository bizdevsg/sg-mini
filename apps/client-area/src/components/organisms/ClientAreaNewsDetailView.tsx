"use client";

import type { NewsArticleDetail, NewsFeedArticle } from "@/lib/news.shared";
import { ClientAreaNewsDetailPanel } from "@/components/organisms/ClientAreaNewsDetailPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaNewsDetailViewProps = {
  article: NewsArticleDetail;
  breakingNews?: BreakingNewsItem[];
  latestArticles: NewsFeedArticle[];
  locale: AppLocale;
  relatedArticles: NewsFeedArticle[];
};

export function ClientAreaNewsDetailView({
  article,
  breakingNews,
  latestArticles,
  locale,
  relatedArticles,
}: ClientAreaNewsDetailViewProps) {
  const copy = getDashboardCopy(locale);

  return (
    <ClientAreaShell activeTab="news" breakingNews={breakingNews} locale={locale}>
      <ClientAreaNewsDetailPanel
        article={article}
        latestArticles={latestArticles}
        locale={locale}
        newsLabel={copy.newsTitle}
        relatedArticles={relatedArticles}
      />
    </ClientAreaShell>
  );
}
