"use client";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
} from "@/components/organisms/client-area.shared";
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
  const { accountMode } = useClientAreaAccountMode();
  const { positions } = getClientAreaAccountModeData(copy, accountMode);

  return (
    <ClientAreaShell
      activeTab="transaction"
      breakingNews={breakingNews}
      locale={locale}
    >
      <ClientAreaTransactionsPanel copy={copy} locale={locale} positions={positions} />
    </ClientAreaShell>
  );
}
