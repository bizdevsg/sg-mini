"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

import { ClientAreaMarketMetricItem } from "@/components/atoms/ClientAreaMarketMetricItem";
import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import {
  formatQuoteNumber,
  formatQuoteTime,
  getDirectionClassName,
} from "@/components/molecules/live-quote.shared";
import { resolveClientAreaMarketChartHref } from "@/components/organisms/client-area.shared";
import { type MarketPrice } from "@/components/organisms/client-area.types";
import { type AppLocale, type AppMessages } from "@/locales";

type ClientAreaMarketCardProps = {
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  item: MarketPrice;
  isTransactionFilterActive: boolean;
  liveChartLabel: string;
  locale: AppLocale;
  onViewTransactions: (marketCode: string) => void;
  viewTransactionsLabel: string;
};

export function ClientAreaMarketCard({
  fieldLabels,
  item,
  isTransactionFilterActive,
  liveChartLabel,
  locale,
  onViewTransactions,
  viewTransactionsLabel,
}: ClientAreaMarketCardProps) {
  const direction = item.change >= 0 ? "up" : "down";

  const directionClassName = getDirectionClassName(direction);

  const DirectionIcon = direction === "up" ? ArrowUp : ArrowDown;

  const marketCode = item.code ?? item.name;
  const displayMarketCode = marketCode.replace(/_BBJ$/, "");

  function formatMetricValue(
    value: string | undefined,
    fallback?: number,
  ) {
    if (value) {
      return formatQuoteNumber(value, locale);
    }

    if (
      typeof fallback === "number" &&
      Number.isFinite(fallback)
    ) {
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

  return (
    <article className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-zinc-900/75 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition sm:p-5 ${isTransactionFilterActive ? "border-yellow-400/60 ring-1 ring-yellow-400/20" : "border-white/15 hover:border-yellow-400/30"}`}>
      <div className="absolute -right-12 -top-14 h-32 w-32 rounded-full bg-yellow-400/[0.06] blur-3xl" />

      <div className="relative flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-black tracking-tight text-white">
            {item.symbol}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-zinc-500">
            ({displayMarketCode})
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/35 ring-1 ring-yellow-400/15">
          <LiveQuoteInstrumentIcon symbol={marketCode} className="h-8 w-8" />
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-2">
        <ClientAreaMarketMetricItem
          valuePrefix={<DirectionIcon className={directionClassName} size={13} />}
          label={fieldLabels.buy}
          value={marketMetrics.buy}
          valueClassName={directionClassName}
        />
        <ClientAreaMarketMetricItem
          valuePrefix={<DirectionIcon className={directionClassName} size={13} />}
          label={fieldLabels.sell}
          value={marketMetrics.sell}
          valueClassName={directionClassName}
        />
        <ClientAreaMarketMetricItem label={fieldLabels.high} value={marketMetrics.high} />
        <ClientAreaMarketMetricItem label={fieldLabels.low} value={marketMetrics.low} />
        <ClientAreaMarketMetricItem label={fieldLabels.open} value={marketMetrics.open} />
        <ClientAreaMarketMetricItem
          label={
            <FontAwesomeIcon
              icon={["far", "alarm-clock"]}
              className="text-sm text-zinc-300"
            />
          }
          value={marketMetrics.time}
        />
      </div>

      <div className="relative mt-auto grid grid-cols-2 gap-2 pt-4">
        <Link
          href={resolveClientAreaMarketChartHref(locale, marketCode)}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] px-3 text-center text-xs font-bold text-zinc-200 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/80"
        >
          {liveChartLabel}
        </Link>
        <button
          type="button"
          aria-pressed={isTransactionFilterActive}
          onClick={() => onViewTransactions(marketCode)}
          className={`inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl px-3 text-center text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${isTransactionFilterActive ? "bg-yellow-300 text-black" : "bg-yellow-400 text-black hover:bg-yellow-300"}`}
        >
          {viewTransactionsLabel}
        </button>
      </div>
    </article>
  );
}
