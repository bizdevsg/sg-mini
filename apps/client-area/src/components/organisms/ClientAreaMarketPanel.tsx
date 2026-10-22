"use client";

import { ClientAreaMarketCard } from "@/components/molecules/ClientAreaMarketCard";
import type { MarketPrice } from "@/components/organisms/client-area.types";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaMarketPanelProps = {
  allTransactionsLabel: string;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  liveChartLabel: string;
  locale: AppLocale;
  onTransactionFilterChange: (marketCode: string | null) => void;
  prices: MarketPrice[];
  selectedTransactionFilter: string | null;
  title: string;
  viewTransactionsLabel: string;
};

export function ClientAreaMarketPanel({
  allTransactionsLabel,
  fieldLabels,
  liveChartLabel,
  locale,
  onTransactionFilterChange,
  prices,
  selectedTransactionFilter,
  title,
  viewTransactionsLabel,
}: ClientAreaMarketPanelProps) {
  return (
    <section aria-label={title} className="space-y-4">
      <button
        type="button"
        aria-pressed={selectedTransactionFilter === null}
        onClick={() => onTransactionFilterChange(null)}
        className={`flex w-full cursor-pointer items-center justify-center rounded-2xl border px-5 py-5 text-center text-xl font-black tracking-tight transition sm:px-6 sm:text-2xl ${selectedTransactionFilter === null ? "border-yellow-400/35 bg-yellow-400/10 text-yellow-300 shadow-[0_14px_40px_rgba(234,179,8,0.08)]" : "border-white/15 bg-zinc-900/60 text-white hover:border-yellow-400/30 hover:text-yellow-300"}`}
      >
        <span>{allTransactionsLabel}</span>
      </button>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
        {prices.map((item) => (
          <div
            key={item.code ?? item.symbol}
            className="w-[min(84vw,20rem)] shrink-0 snap-start sm:w-auto"
          >
            <ClientAreaMarketCard
              fieldLabels={fieldLabels}
              item={item}
              isTransactionFilterActive={
                selectedTransactionFilter === (item.code ?? item.name)
              }
              liveChartLabel={liveChartLabel}
              locale={locale}
              onViewTransactions={onTransactionFilterChange}
              viewTransactionsLabel={viewTransactionsLabel}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
