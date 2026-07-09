"use client";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaAccountWithdrawalHistoryPanel } from "@/components/organisms/ClientAreaAccountWithdrawalHistoryPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
} from "@/components/organisms/client-area.shared";
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
  const copy = getDashboardCopy(locale);
  const { accountMode } = useClientAreaAccountMode();
  const { currentAccount, withdrawalHistory } = getClientAreaAccountModeData(
    copy,
    accountMode,
  );

  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <ClientAreaAccountWithdrawalHistoryPanel
        currentAccount={currentAccount}
        locale={locale}
        withdrawalHistory={withdrawalHistory}
      />
    </ClientAreaShell>
  );
}
