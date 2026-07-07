"use client";

import { ClientAreaMarketCard } from "@/components/molecules/ClientAreaMarketCard";
import type { MarketPrice } from "@/components/organisms/client-area.types";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaMarketPanelProps = {
  className?: string;
  embedded?: boolean;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  locale: AppLocale;
  prices: MarketPrice[];
};

export function ClientAreaMarketPanel({
  className = "",
  embedded = false,
  fieldLabels,
  locale,
  prices,
}: ClientAreaMarketPanelProps) {
  return (
    <div
      className={`w-full space-y-6 ${embedded ? "" : "rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-2xl sm:p-6"} ${className}`}
    >
      <div className="grid grid-cols-1 gap-4">
        {prices.map((item) => (
          <ClientAreaMarketCard
            key={item.code ?? item.symbol}
            fieldLabels={fieldLabels}
            item={item}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
