"use client";

import { ClientAreaNewsPanel } from "@/components/organisms/ClientAreaNewsPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import type {
  ArticleItem,
  BreakingNewsItem,
} from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaNewsViewProps = {
  articles?: ArticleItem[];
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaNewsView({
  articles,
  breakingNews,
  locale,
}: ClientAreaNewsViewProps) {
  const copy = getDashboardCopy(locale);

  return (
    <ClientAreaShell activeTab="news" breakingNews={breakingNews} locale={locale}>
      <ClientAreaNewsPanel articles={articles} copy={copy} locale={locale} />
    </ClientAreaShell>
  );
}
