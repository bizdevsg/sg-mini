"use client";

import { ClientAreaAccountPanel } from "@/components/organisms/ClientAreaAccountPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaAccountViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaAccountView({
  breakingNews,
  locale,
}: ClientAreaAccountViewProps) {
  const copy = getDashboardCopy(locale);

  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <ClientAreaAccountPanel copy={copy} currentAccount={copy.demoAccount} />
    </ClientAreaShell>
  );
}
