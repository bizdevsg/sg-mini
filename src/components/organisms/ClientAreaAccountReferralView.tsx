"use client";

import { ClientAreaAccountReferralPanel } from "@/components/organisms/ClientAreaAccountReferralPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaAccountReferralViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaAccountReferralView({
  breakingNews,
  locale,
}: ClientAreaAccountReferralViewProps) {
  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <ClientAreaAccountReferralPanel locale={locale} />
    </ClientAreaShell>
  );
}
