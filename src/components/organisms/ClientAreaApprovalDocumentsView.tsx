"use client";

import { ClientAreaAccountHeader } from "@/components/organisms/ClientAreaAccountHeader";
import { ClientAreaApprovalDocumentsPanel } from "@/components/organisms/ClientAreaApprovalDocumentsPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaApprovalDocumentsViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaApprovalDocumentsView({
  breakingNews,
  locale,
}: ClientAreaApprovalDocumentsViewProps) {
  return (
    <ClientAreaShell activeTab="account" breakingNews={breakingNews} locale={locale}>
      <div className="space-y-6">
        <ClientAreaAccountHeader locale={locale} />
        <ClientAreaApprovalDocumentsPanel locale={locale} />
      </div>
    </ClientAreaShell>
  );
}
