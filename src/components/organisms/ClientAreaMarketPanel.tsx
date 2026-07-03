"use client";

import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaMarketCard } from "@/components/molecules/ClientAreaMarketCard";
import {
  getClientAreaAllMarketPrices,
  getClientAreaMarketPrices,
} from "@/components/organisms/client-area.shared";
import type {
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaMarketPanelProps = {
  copy: DashboardCopy;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  locale: AppLocale;
};

export function ClientAreaMarketPanel({
  copy,
  fieldLabels,
  locale,
}: ClientAreaMarketPanelProps) {
  const { quotes } = useLiveQuoteStream();
  const prices = useMemo(
    () =>
      Object.keys(quotes).length > 0
        ? getClientAreaAllMarketPrices(quotes)
        : getClientAreaMarketPrices(quotes),
    [quotes],
  );

  return (
    <div className="space-y-6 w-full rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-2xl p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "chart-line"]} />
        {copy.marketWatchTitle}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {prices.map((item) => (
          <ClientAreaMarketCard
            key={item.code ?? item.symbol}
            copy={copy}
            fieldLabels={fieldLabels}
            item={item}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
