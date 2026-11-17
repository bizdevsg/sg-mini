"use client";

import { ClientAreaEbookPanel } from "@/components/organisms/ClientAreaEbookPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import type { EbookCategory } from "@/lib/ebook.shared";
import type { AppLocale } from "@/locales";

type ClientAreaEbookViewProps = {
  breakingNews?: BreakingNewsItem[];
  categories?: EbookCategory[];
  locale: AppLocale;
};

export function ClientAreaEbookView({
  breakingNews,
  categories = [],
  locale,
}: ClientAreaEbookViewProps) {
  return (
    <ClientAreaShell activeTab="ebook" breakingNews={breakingNews} locale={locale}>
      <ClientAreaEbookPanel categories={categories} locale={locale} />
    </ClientAreaShell>
  );
}
