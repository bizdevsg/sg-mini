"use client";

import { ClientAreaMarketCard } from "@/components/organisms/ClientAreaMarketCard";
import type { MarketPrice } from "@/components/organisms/client-area.types";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaMarketPanelProps = {
  allTransactionsLabel: string;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  liveChartLabel: string;
  marketMovementDescription: string;
  marketMovementTitle: string;
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
  marketMovementDescription,
  marketMovementTitle,
  locale,
  onTransactionFilterChange,
  prices,
  selectedTransactionFilter,
  title,
  viewTransactionsLabel,
}: ClientAreaMarketPanelProps) {
  return (
    <section
      aria-label={title}
      className="relative isolate overflow-hidden rounded-4xl bg-[#080a0b] border border-zinc-500/10"
    >
      {/* HEADER BACKGROUND */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 overflow-hidden sm:h-56 lg:h-64">
        {/* Globe Background */}
        <div
          className="absolute inset-0 bg-right-top bg-no-repeat bg-cover"
          style={{
            backgroundImage: "url('/assets/bg-pasar-transaksi.webp')",
          }}
        />

        {/* Gradient agar teks tetap terbaca */}
        <div className="absolute inset-0 bg-linear-to-r from-[#080a0b]/90 via-[#080a0b]/40 to-transparent" />

        {/* Gradient bawah untuk transisi */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#080a0b]" />
      </div>

      {/* HEADER CONTENT */}
      <div className="relative z-10 p-5">
        <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {marketMovementTitle}
        </h3>

        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          {marketMovementDescription}
        </p>
      </div>

      {/* MARKET CARDS */}
      <div className="relative z-10">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible xl:grid-cols-4 xl:gap-4">
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
      </div>
    </section>
  );
}
