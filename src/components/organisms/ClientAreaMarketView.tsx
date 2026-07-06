"use client";

import { useMemo } from "react";

import { ClientAreaMarketPanel } from "@/components/organisms/ClientAreaMarketPanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  getClientAreaAllMarketPrices,
  getClientAreaMarketPrices,
} from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaMarketViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaMarketView({
  breakingNews,
  locale,
}: ClientAreaMarketViewProps) {
  const fieldLabels = getMessages(locale).liveQuoteTable.fields;
  const { quotes } = useLiveQuoteStream();
  const prices = useMemo(
    () =>
      Object.keys(quotes).length > 0
        ? getClientAreaAllMarketPrices(quotes)
        : getClientAreaMarketPrices(quotes),
    [quotes],
  );

  return (
    <ClientAreaShell activeTab="market" breakingNews={breakingNews} locale={locale}>
      <ClientAreaMarketPanel
        fieldLabels={fieldLabels}
        locale={locale}
        prices={prices}
      />
    </ClientAreaShell>
  );
}
