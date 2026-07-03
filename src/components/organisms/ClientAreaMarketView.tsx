"use client";

import { ClientAreaMarketPanel } from "@/components/organisms/ClientAreaMarketPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaMarketViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaMarketView({
  breakingNews,
  locale,
}: ClientAreaMarketViewProps) {
  const copy = getDashboardCopy(locale);
  const fieldLabels = getMessages(locale).liveQuoteTable.fields;

  return (
    <ClientAreaShell activeTab="market" breakingNews={breakingNews} locale={locale}>
      <ClientAreaMarketPanel
        copy={copy}
        fieldLabels={fieldLabels}
        locale={locale}
      />
    </ClientAreaShell>
  );
}
