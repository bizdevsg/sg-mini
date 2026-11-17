"use client";

import { ClientAreaAccountTransferUnavailableView } from "@/components/organisms/ClientAreaAccountTransferUnavailableView";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaAccountWithdrawalHistoryViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaAccountWithdrawalHistoryView({
  breakingNews,
  locale,
}: ClientAreaAccountWithdrawalHistoryViewProps) {
  return (
    <ClientAreaAccountTransferUnavailableView
      action="withdrawal"
      breakingNews={breakingNews}
      locale={locale}
    />
  );
}
