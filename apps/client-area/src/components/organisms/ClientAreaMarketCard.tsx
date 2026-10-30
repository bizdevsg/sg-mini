"use client";

import { ClientAreaMarketActions } from "@/components/molecules/ClientAreaMarketActions";
import { ClientAreaMarketHeader } from "@/components/molecules/ClientAreaMarketHeader";
import { ClientAreaMarketQuoteDetails } from "@/components/molecules/ClientAreaMarketQuoteDetails";
import {
  formatQuoteNumber,
  formatQuoteTime,
  getDirectionClassName,
} from "@/components/molecules/live-quote.shared";
import type { MarketPrice } from "@/components/organisms/client-area.types";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaMarketCardProps = {
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  item: MarketPrice;
  isTransactionFilterActive: boolean;
  liveChartLabel: string;
  locale: AppLocale;
  onOpenLiveChart: (marketCode: string) => void;
  onViewTransactions: (marketCode: string) => void;
  viewTransactionsLabel: string;
};

export function ClientAreaMarketCard({
  fieldLabels,
  item,
  isTransactionFilterActive,
  liveChartLabel,
  locale,
  onOpenLiveChart,
  onViewTransactions,
  viewTransactionsLabel,
}: ClientAreaMarketCardProps) {
  const direction = item.change >= 0 ? "up" : "down";
  const directionClassName = getDirectionClassName(direction);
  const directionContainerClassName =
    direction === "up"
      ? "border-emerald-400/35 bg-linear-to-br from-emerald-500/20 to-emerald-950/15"
      : "border-red-400/35 bg-linear-to-br from-red-500/20 to-red-950/15";
  const marketCode = item.code ?? item.name;

  function formatMetricValue(
    value: string | undefined,
    fallback?: number,
  ) {
    if (value) {
      return formatQuoteNumber(value, locale);
    }

    if (typeof fallback === "number" && Number.isFinite(fallback)) {
      return formatQuoteNumber(String(fallback), locale);
    }

    return "-";
  }

  const marketMetrics = {
    high: formatMetricValue(item.high, item.ask),
    low: formatMetricValue(item.low, item.bid),
    open: formatMetricValue(item.open, item.bid),
    sell: formatMetricValue(item.sell, item.ask),
    buy: formatMetricValue(item.buy, item.bid),
    time:
      item.time && item.dateTime
        ? formatQuoteTime(item.time, item.dateTime, locale)
        : item.time ?? "--:--:--",
  };

  const currentPrice = formatMetricValue(item.price, item.bid);
  const parsedCurrentPrice = Number(
    (item.price ?? String(item.bid)).replace(/,/g, ""),
  );
  const parsedOpenPrice = Number(item.open?.replace(/,/g, ""));
  const absoluteChange =
    Number.isFinite(parsedCurrentPrice) && Number.isFinite(parsedOpenPrice)
      ? parsedCurrentPrice - parsedOpenPrice
      : null;
  const changeSign = direction === "up" ? "+" : "-";
  const formattedAbsoluteChange =
    absoluteChange === null
      ? null
      : `${absoluteChange >= 0 ? "+" : "-"}${formatQuoteNumber(Math.abs(absoluteChange).toFixed(2), locale)}`;
  const formattedPercentageChange = `${changeSign}${formatQuoteNumber(Math.abs(item.change).toFixed(2), locale)}%`;

  return (
    <article
      className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border bg-linear-to-br from-zinc-900/50 via-zinc-950/50 to-black/50 backdrop-blur-sm p-5 shadow-[0_20px_55px_rgba(0,0,0,0.32)] transition sm:p-6 ${isTransactionFilterActive ? "border-yellow-400/60 ring-1 ring-yellow-400/20" : "border-white/15 hover:border-yellow-400/35"}`}
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-black blur-3xl" />

      <ClientAreaMarketHeader
        absoluteChange={formattedAbsoluteChange}
        currentPrice={currentPrice}
        direction={direction}
        directionClassName={directionClassName}
        marketCode={marketCode}
        percentageChange={formattedPercentageChange}
        symbol={item.symbol}
      />

      <ClientAreaMarketQuoteDetails
        containerClassName={directionContainerClassName}
        directionClassName={directionClassName}
        fieldLabels={fieldLabels}
        metrics={marketMetrics}
      />

      <ClientAreaMarketActions
        isTransactionFilterActive={isTransactionFilterActive}
        liveChartLabel={liveChartLabel}
        onOpenLiveChart={() => onOpenLiveChart(marketCode)}
        onViewTransactions={() => onViewTransactions(marketCode)}
        viewTransactionsLabel={viewTransactionsLabel}
      />
    </article>
  );
}
