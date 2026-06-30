"use client";

import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import { ClientAreaTransactionsPanel } from "@/components/organisms/ClientAreaTransactionsPanel";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaTransactionsViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaTransactionsView({
  breakingNews,
  locale,
}: ClientAreaTransactionsViewProps) {
  const copy = getDashboardCopy(locale);

  return (
    <ClientAreaShell
      activeTab="transaction"
      breakingNews={breakingNews}
      locale={locale}
    >
      <ClientAreaTransactionsPanel copy={copy} />
    </ClientAreaShell>
  );
}
