"use client";

import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { NewsBrowser } from "@/components/organisms/NewsBrowser";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { NewsFeedArticle } from "@/lib/news.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaNewsViewProps = {
  articles: NewsFeedArticle[];
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

/**
 * Same news list as the public website (NewsBrowser: category sidebar, search,
 * sort/period filter, featured first card), rendered inside the client-area
 * shell. Article links stay inside the client area.
 */
export function ClientAreaNewsView({
  articles,
  breakingNews,
  locale,
}: ClientAreaNewsViewProps) {
  const labels = getMessages(locale).newsPage;

  return (
    <ClientAreaShell activeTab="news" breakingNews={breakingNews} locale={locale}>
      <NewsBrowser
        articles={articles}
        hrefBasePath="/client-area/news"
        labels={labels}
        locale={locale}
      />
    </ClientAreaShell>
  );
}
