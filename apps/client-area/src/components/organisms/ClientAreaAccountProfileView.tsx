"use client";

import { ClientAreaAccountHeader } from "@/components/organisms/ClientAreaAccountHeader";
import { ClientAreaAccountProfilePanel } from "@/components/organisms/ClientAreaAccountProfilePanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
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
  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <div className="space-y-6">
        <ClientAreaAccountHeader locale={locale} />
        <ClientAreaAccountProfilePanel locale={locale} />
      </div>
    </ClientAreaShell>
  );
}
