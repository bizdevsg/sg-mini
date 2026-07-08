"use client";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaAccountProfilePanel } from "@/components/organisms/ClientAreaAccountProfilePanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
} from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaAccountProfileViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaAccountProfileView({
  breakingNews,
  locale,
}: ClientAreaAccountProfileViewProps) {
  const copy = getDashboardCopy(locale);
  const { accountMode } = useClientAreaAccountMode();
  const { currentAccount } = getClientAreaAccountModeData(copy, accountMode);

  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <ClientAreaAccountProfilePanel
        copy={copy}
        currentAccount={currentAccount}
        locale={locale}
      />
    </ClientAreaShell>
  );
}
