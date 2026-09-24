"use client";

import { ClientAreaAccountTransferUnavailableView } from "@/components/organisms/ClientAreaAccountTransferUnavailableView";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaAccountDepositHistoryViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaAccountDepositHistoryView({
  breakingNews,
  locale,
}: ClientAreaAccountDepositHistoryViewProps) {
  return (
    <ClientAreaAccountTransferUnavailableView
      action="deposit"
      breakingNews={breakingNews}
      locale={locale}
    />
  );
}
