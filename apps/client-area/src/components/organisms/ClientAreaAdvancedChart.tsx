"use client";

import { useState } from "react";

import { ClientAreaAdvancedMiniChart } from "@/components/organisms/ClientAreaAdvancedMiniChart";
import { ClientAreaMarketWatchSection } from "@/components/organisms/ClientAreaMarketWatchSection";
import { CLIENT_AREA_HOME_MARKET_SYMBOLS } from "@/components/organisms/client-area.shared";
import type { DashboardCopy } from "@/components/organisms/client-area.types";
import type { AppLocale, AppMessages } from "@/locales";

type HomeMarketSymbol = (typeof CLIENT_AREA_HOME_MARKET_SYMBOLS)[number];

type ClientAreaAdvancedChartProps = {
  copy: AppMessages["clientArea"]["homeChart"];
  locale: AppLocale;
  marketWatchCopy: DashboardCopy;
};

export function ClientAreaAdvancedChart({
  copy,
  locale,
  marketWatchCopy,
}: ClientAreaAdvancedChartProps) {
  const [selectedSymbol, setSelectedSymbol] =
    useState<HomeMarketSymbol>(CLIENT_AREA_HOME_MARKET_SYMBOLS[0]);

  return (
    <section className="min-w-0 space-y-3">
      <ClientAreaMarketWatchSection
        copy={marketWatchCopy}
        locale={locale}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={(symbol) => setSelectedSymbol(symbol as HomeMarketSymbol)}
      />

      <ClientAreaAdvancedMiniChart
        copy={copy}
        locale={locale}
        symbol={selectedSymbol}
      />
    </section>
  );
}
