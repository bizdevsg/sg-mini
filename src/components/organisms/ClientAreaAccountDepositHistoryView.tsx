"use client";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaAccountDepositHistoryPanel } from "@/components/organisms/ClientAreaAccountDepositHistoryPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
} from "@/components/organisms/client-area.shared";
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
  const copy = getDashboardCopy(locale);
  const { accountMode } = useClientAreaAccountMode();
  const { currentAccount, depositHistory } = getClientAreaAccountModeData(
    copy,
    accountMode,
  );

  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <ClientAreaAccountDepositHistoryPanel
        currentAccount={currentAccount}
        depositHistory={depositHistory}
        locale={locale}
      />
    </ClientAreaShell>
  );
}
