"use client";

import { ClientAreaAccountPanel } from "@/components/organisms/ClientAreaAccountPanel";
import { ClientAreaAccountHeader } from "@/components/organisms/ClientAreaAccountHeader";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
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
  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <div className="space-y-6">
        <ClientAreaAccountHeader locale={locale} />
        <ClientAreaAccountPanel locale={locale} />
      </div>
    </ClientAreaShell>
  );
}
