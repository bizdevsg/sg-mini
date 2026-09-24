"use client";

import { ClientAreaAccountReferralPanel } from "@/components/organisms/ClientAreaAccountReferralPanel";
import { ClientAreaAccountHeader } from "@/components/organisms/ClientAreaAccountHeader";
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
      <div className="space-y-6">
        <ClientAreaAccountHeader locale={locale} />
        <ClientAreaAccountReferralPanel locale={locale} />
      </div>
    </ClientAreaShell>
  );
}
