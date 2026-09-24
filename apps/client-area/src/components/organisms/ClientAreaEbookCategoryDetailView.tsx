"use client";

import { ClientAreaEbookCategoryDetailPanel } from "@/components/organisms/ClientAreaEbookCategoryDetailPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { EbookCategoryDetail } from "@/lib/ebook.shared";
import type { AppLocale } from "@/locales";

type ClientAreaEbookCategoryDetailViewProps = {
  breakingNews?: BreakingNewsItem[];
  categoryDetail: EbookCategoryDetail;
  locale: AppLocale;
};

export function ClientAreaEbookCategoryDetailView({
  breakingNews,
  categoryDetail,
  locale,
}: ClientAreaEbookCategoryDetailViewProps) {
  return (
    <ClientAreaShell activeTab="ebook" breakingNews={breakingNews} locale={locale}>
      <ClientAreaEbookCategoryDetailPanel
        categoryDetail={categoryDetail}
        locale={locale}
      />
    </ClientAreaShell>
  );
}
