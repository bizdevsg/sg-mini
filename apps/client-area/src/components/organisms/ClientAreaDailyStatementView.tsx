"use client";

import { ClientAreaAccountHeader } from "@/components/organisms/ClientAreaAccountHeader";
import { ClientAreaDailyStatementPanel } from "@/components/organisms/ClientAreaDailyStatementPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaDailyStatementViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaDailyStatementView({
  breakingNews,
  locale,
}: ClientAreaDailyStatementViewProps) {
  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <div className="space-y-6">
        <ClientAreaAccountHeader locale={locale} />
        <ClientAreaDailyStatementPanel locale={locale} />
      </div>
    </ClientAreaShell>
  );
}
