import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import {
  formatQuoteNumber,
  formatQuoteTime,
  getDirectionClassName,
  getRowClassName,
} from "@/components/molecules/live-quote.shared";
import {
  formatSignedPercent,
  formatUsd,
  resolveSignalBadge,
} from "@/components/organisms/client-area.shared";
import type {
  DashboardCopy,
  MarketPrice,
} from "@/components/organisms/client-area.types";
import {
  formatLocaleDateTime,
  type AppLocale,
  type AppMessages,
} from "@/locales";

type ClientAreaMarketCardProps = {
  copy: DashboardCopy;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  item: MarketPrice;
  locale: AppLocale;
};

export function ClientAreaMarketCard({
  copy,
  fieldLabels,
  item,
  locale,
}: ClientAreaMarketCardProps) {
  const signal = resolveSignalBadge(item.change);
  const directionClassName = getDirectionClassName(
    item.change > 0 ? "up" : item.change < 0 ? "down" : "-",
  );
  const rowClassName = getRowClassName(
    item.change > 0 ? "up" : item.change < 0 ? "down" : "-",
  );
  const quoteFields = [
    {
      label: fieldLabels.price,
      value: item.price ? formatQuoteNumber(item.price, locale) : null,
    },
    {
      label: fieldLabels.sell,
      value: item.sell ? formatQuoteNumber(item.sell, locale) : null,
    },
    {
      label: fieldLabels.buy,
      value: item.buy ? formatQuoteNumber(item.buy, locale) : null,
    },
    {
      label: fieldLabels.open,
      value: item.open ? formatQuoteNumber(item.open, locale) : null,
    },
    {
      label: fieldLabels.high,
      value: item.high ? formatQuoteNumber(item.high, locale) : null,
    },
    {
      label: fieldLabels.low,
      value: item.low ? formatQuoteNumber(item.low, locale) : null,
    },
    {
      label: fieldLabels.time,
      value:
        item.time && item.dateTime
          ? formatQuoteTime(item.time, item.dateTime, locale)
          : item.time ?? null,
    },
  ].filter((field) => field.value !== null);
  const hasFullQuoteData = quoteFields.length > 0;

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-5 transition-all ${rowClassName}`}
    >

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 ring-1 ring-yellow-500/20">
              <LiveQuoteInstrumentIcon
                symbol={item.code ?? item.name}
                className="h-10 w-10"
              />
            </div>

            <div>
              <h3
                className={`text-lg font-black tracking-tight ${directionClassName}`}
              >
                {item.symbol}
              </h3>
              <p className={`truncate text-xs ${directionClassName}`}>
                {item.code ?? item.name}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${signal.className} bg-zinc-900/80`}
        >
          <FontAwesomeIcon icon={signal.icon} className="text-[10px]" />
          {formatSignedPercent(item.change)}
        </span>
      </div>

      {hasFullQuoteData ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {quoteFields.map((field) => (
            <div
              key={field.label}
              className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-3"
            >
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-200">
                {field.label}
              </p>
              <p className={`text-base font-bold ${directionClassName}`}>
                {field.value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              {copy.marketTableHeaders.bid}
            </p>
            <p className={`text-base font-bold ${directionClassName}`}>
              {formatUsd(item.bid)}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              {copy.marketTableHeaders.ask}
            </p>
            <p className={`text-base font-bold ${directionClassName}`}>
              {formatUsd(item.ask)}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
