"use client";

import { useState } from "react";

import { ClientAreaSectionHeader } from "@/components/molecules/ClientAreaSectionHeader";
import { ClientAreaAdvancedMiniChart } from "@/components/organisms/ClientAreaAdvancedMiniChart";
import { ClientAreaMarketWatchSection } from "@/components/organisms/ClientAreaMarketWatchSection";
import {
  CLIENT_AREA_HOME_MARKET_SYMBOLS,
  resolveClientAreaTabHref,
} from "@/components/organisms/client-area.shared";
import type { DashboardCopy } from "@/components/organisms/client-area.types";
import type { AppLocale, AppMessages } from "@/locales";

type HomeMarketSymbol = (typeof CLIENT_AREA_HOME_MARKET_SYMBOLS)[number];

type ClientAreaAdvancedChartProps = {
  copy: AppMessages["clientArea"]["homeChart"];
  miniChartEnabled?: boolean;
  locale: AppLocale;
  marketWatchCopy: DashboardCopy;
};

export function ClientAreaAdvancedChart({
  copy,
  miniChartEnabled = true,
  locale,
  marketWatchCopy,
}: ClientAreaAdvancedChartProps) {
  const [selectedSymbol, setSelectedSymbol] =
    useState<HomeMarketSymbol>(CLIENT_AREA_HOME_MARKET_SYMBOLS[0]);

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <ClientAreaSectionHeader
        title={marketWatchCopy.marketWatchTitle}
        actionHref={resolveClientAreaTabHref(locale, "market")}
        actionLabel={marketWatchCopy.viewMoreLabel}
      />

      <div className="order-2 xl:order-1">
        <ClientAreaMarketWatchSection
          locale={locale}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={(symbol) => setSelectedSymbol(symbol as HomeMarketSymbol)}
        />
      </div>

      <div className="order-1 xl:order-2">
        <ClientAreaAdvancedMiniChart
          copy={copy}
          enabled={miniChartEnabled}
          locale={locale}
          symbol={selectedSymbol}
        />
      </div>
    </section>
  );
}
