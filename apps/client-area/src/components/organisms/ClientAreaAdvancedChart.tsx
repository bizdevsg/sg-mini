"use client";

import { useState } from "react";

import { ClientAreaAdvancedMiniChart } from "@/components/organisms/ClientAreaAdvancedMiniChart";
import { CLIENT_AREA_HOME_MARKET_SYMBOLS } from "@/components/organisms/client-area.shared";
import { getLiveQuoteDisplay } from "@/lib/live-quotes";
import type { AppLocale, AppMessages } from "@/locales";

type HomeMarketSymbol = (typeof CLIENT_AREA_HOME_MARKET_SYMBOLS)[number];

type ClientAreaAdvancedChartProps = {
  copy: AppMessages["clientArea"]["homeChart"];
  locale: AppLocale;
};

export function ClientAreaAdvancedChart({
  copy,
  locale,
}: ClientAreaAdvancedChartProps) {
  const [selectedSymbol, setSelectedSymbol] =
    useState<HomeMarketSymbol>(CLIENT_AREA_HOME_MARKET_SYMBOLS[0]);

  return (
    <section className="min-w-0 space-y-3">
      <div className="flex gap-2 overflow-x-auto shadow-lg">
        {CLIENT_AREA_HOME_MARKET_SYMBOLS.map((symbol) => {
          const display = getLiveQuoteDisplay(symbol);
          const isSelected = selectedSymbol === symbol;

          return (
            <button
              key={symbol}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedSymbol(symbol)}
              className={`min-w-28 w-full rounded-xl border px-3 py-2 text-left transition ${isSelected
                ? "border-yellow-400/60 bg-yellow-400/10 text-yellow-300"
                : "border-white/20 bg-white/10 text-zinc-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                }`}
            >
              <span className="block text-xs font-bold">{display.label}</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider opacity-70">
                {symbol.replace(/_BBJ$/, "")}
              </span>
            </button>
          );
        })}
      </div>

      <ClientAreaAdvancedMiniChart
        copy={copy}
        locale={locale}
        symbol={selectedSymbol}
      />
    </section>
  );
}
