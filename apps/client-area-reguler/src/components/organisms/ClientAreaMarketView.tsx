"use client";

import { useCallback, useMemo, useState } from "react";

import { ClientAreaMarketPanel } from "@/components/organisms/ClientAreaMarketPanel";
import { ClientAreaMarketChartModal } from "@/components/organisms/ClientAreaMarketChartModal";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { ClientAreaTransactionsView } from "@/components/organisms/ClientAreaTransactionsView";
import { getClientAreaFeaturedMarketPrices } from "@/components/organisms/client-area.shared";
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
  const [transactionFilter, setTransactionFilter] = useState<string | null>(null);
  const [chartMarketCode, setChartMarketCode] = useState<string | null>(null);
  const messages = getMessages(locale);
  const fieldLabels = messages.liveQuoteTable.fields;
  const marketTransactions = messages.clientArea.marketTransactions;
  const { quotes } = useLiveQuoteStream();
  const prices = useMemo(
    () => getClientAreaFeaturedMarketPrices(quotes),
    [quotes],
  );
  const handleTransactionFilterChange = useCallback((marketCode: string | null) => {
    setTransactionFilter(marketCode);
    window.requestAnimationFrame(() => {
      document
        .getElementById("transactions")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <ClientAreaShell activeTab="market" breakingNews={breakingNews} locale={locale}>
      <div className="space-y-7 sm:space-y-8">
        <ClientAreaMarketPanel
          allTransactionsLabel={marketTransactions.allTransactionsLabel}
          fieldLabels={fieldLabels}
          liveChartLabel={marketTransactions.liveChartLabel}
          marketMovementDescription={marketTransactions.marketMovementDescription}
          marketMovementTitle={marketTransactions.marketMovementTitle}
          locale={locale}
          onOpenLiveChart={setChartMarketCode}
          onTransactionFilterChange={handleTransactionFilterChange}
          prices={prices}
          selectedTransactionFilter={transactionFilter}
          title={marketTransactions.title}
          viewTransactionsLabel={marketTransactions.viewTransactionsLabel}
        />

        <div aria-hidden="true" className="h-px bg-white/15" />

        <ClientAreaTransactionsView
          filterSymbol={transactionFilter}
          locale={locale}
          onShowAllTransactions={() => handleTransactionFilterChange(null)}
        />

        <ClientAreaMarketChartModal
          locale={locale}
          marketCode={chartMarketCode}
          onClose={() => setChartMarketCode(null)}
        />
      </div>
    </ClientAreaShell>
  );
}
