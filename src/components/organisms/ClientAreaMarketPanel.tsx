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
  );
}
