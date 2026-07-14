import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { type ReactNode } from "react";

import { ButtonLink } from "@/components/atoms/ButtonLink";
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
  locale: AppLocale;
};

type MetricItemProps = {
  label: ReactNode;
  value: ReactNode;
  valuePrefix?: ReactNode;
  valueClassName?: string;
};

function MetricItem({
  label,
  value,
  valuePrefix,
  valueClassName,
}: MetricItemProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
        {label}
      </div>

      <div
        className={`flex items-center gap-1 text-base font-black tracking-tight sm:text-xl ${valueClassName ?? "text-yellow-400"
          }`}
      >
        {valuePrefix ? (
          <span className="text-xs">
            {valuePrefix}
          </span>
        ) : null}
        <div>
          {value}
        </div>
      </div>
    </div>
  );
}

export function ClientAreaMarketCard({
  fieldLabels,
  item,
  locale,
}: ClientAreaMarketCardProps) {
  const direction =
    item.change > 0 ? "up" : item.change < 0 ? "down" : "-";

  const directionClassName = getDirectionClassName(direction);

  const DirectionIcon =
    direction === "up"
      ? ArrowUp
      : direction === "down"
        ? ArrowDown
        : Minus;

  const marketCode = item.code ?? item.name;

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
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 px-4 py-4 sm:px-6 sm:py-5">
      <div className="absolute inset-y-0 left-0 w-24 rounded-full bg-white/[0.04] blur-2xl" />

      <div className="relative grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_auto] xl:items-center">
        {/* Header */}
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-950/90 shadow-[inset_0_2px_18px_rgba(255,191,36,0.18),0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-amber-400/20 sm:h-15 sm:w-15">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-radial-[at_30%_30%] from-amber-300/20 via-transparent to-transparent sm:h-15 sm:w-15">
              <LiveQuoteInstrumentIcon
                symbol={marketCode}
                className="h-12 w-12"
              />
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-lg font-black uppercase tracking-tight text-white sm:text-xl">
              {item.symbol}

            </h3>
            <p className="text-xs font-semibold text-zinc-500">
              ({marketCode})
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div className="grid gap-1">
            <MetricItem
              label={fieldLabels.high}
              value={marketMetrics.high}
            />

            <MetricItem
              label={fieldLabels.low}
              value={marketMetrics.low}
            />
          </div>

          <div className="grid gap-1">
            <MetricItem
              label={fieldLabels.open}
              value={marketMetrics.open}
            />

            <MetricItem
              label={
                <FontAwesomeIcon
                  icon={["far", "alarm-clock"]}
                  className="text-sm text-zinc-300"
                />
              }
              value={marketMetrics.time}
            />
          </div>

          <div className="grid gap-1 sm:col-span-2 xl:col-span-1">
            <MetricItem
              valuePrefix={
                <DirectionIcon className={directionClassName} size={14} />
              }
              label={fieldLabels.sell}
              value={marketMetrics.sell}
              valueClassName={directionClassName}
            />

            <MetricItem
              valuePrefix={
                <DirectionIcon className={directionClassName} size={14} />
              }
              label={fieldLabels.buy}
              value={marketMetrics.buy}
              valueClassName={directionClassName}
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end xl:justify-center">
          <ButtonLink
            href={resolveClientAreaMarketChartHref(
              locale,
              marketCode,
            )}
            className="whitespace-nowrap"
          >
            Live Chart
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}