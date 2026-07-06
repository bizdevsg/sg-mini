import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import {
  formatQuoteNumber,
  formatQuoteTime,
  getDirectionClassName,
} from "@/components/molecules/live-quote.shared";
import { resolveClientAreaMarketChartHref } from "@/components/organisms/client-area.shared";
import { type MarketPrice } from "@/components/organisms/client-area.types";
import { type AppLocale, type AppMessages } from "@/locales";
import { ButtonLink } from "../atoms/ButtonLink";

type ClientAreaMarketCardProps = {
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
  item: MarketPrice;
  locale: AppLocale;
};

export function ClientAreaMarketCard({
  fieldLabels,
  item,
  locale,
}: ClientAreaMarketCardProps) {
  const direction = item.change > 0 ? "up" : item.change < 0 ? "down" : "-";
  const directionClassName = getDirectionClassName(direction);
  const marketCode = item.code ?? item.name;
  const directionIcon = direction === "up" ? "arrow-up" : "arrow-down";

  function formatMetricValue(value: string | undefined, fallback?: number) {
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

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 px-6 py-5 transition-all"
    >
      <div className="absolute inset-y-0 left-0 w-24 rounded-full bg-white/[0.04] blur-2xl" />

      <div className="relative flex gap-8 items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-15 w-15 items-center justify-center rounded-full bg-amber-950/90 shadow-[inset_0_2px_18px_rgba(255,191,36,0.18),0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-amber-400/20">
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-radial-[at_30%_30%] from-amber-300/20 via-transparent to-transparent">
              <LiveQuoteInstrumentIcon
                symbol={marketCode}
                className="h-14 w-14"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="min-w-0 mb-5">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              {item.symbol} <span className="text-base text-zinc-500">({marketCode})</span>
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="grid gap-3 lg:gap-2">
              <div className="flex items-center justify-between gap-3 min-w-40">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-200">
                  {fieldLabels.high}
                </p>
                <p className="text-xl font-black tracking-tight text-yellow-400">
                  {marketMetrics.high}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 min-w-40">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-200">
                  {fieldLabels.low}
                </p>
                <p className="text-xl font-black tracking-tight text-yellow-400">
                  {marketMetrics.low}
                </p>
              </div>
            </div>

            <div className="hidden lg:block lg:w-px lg:self-stretch lg:bg-white/30" />

            <div className="grid gap-3 lg:gap-2">
              <div className="flex items-center justify-between gap-3 min-w-40">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-200">
                  {fieldLabels.open}
                </p>
                <p className="text-xl font-black tracking-tight text-yellow-400">
                  {marketMetrics.open}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 min-w-40">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-zinc-200">
                  <FontAwesomeIcon icon={["far", "alarm-clock"]} className="text-sm text-zinc-300" />
                </p>
                <p className="text-xl font-black tracking-tight text-yellow-400">
                  {marketMetrics.time}
                </p>
              </div>
            </div>

            <div className="hidden lg:block lg:w-px lg:self-stretch lg:bg-white/30" />

            <div className="grid gap-3 lg:gap-2">
              <div className="flex items-center justify-between gap-3 min-w-40">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-zinc-200">
                  <FontAwesomeIcon icon={["fas", directionIcon]} className={`text-base ${directionClassName}`} />
                  {fieldLabels.sell}
                </p>
                <p className={`text-xl font-black tracking-tight ${directionClassName}`}>
                  {marketMetrics.sell}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 min-w-40">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-zinc-200">
                  <FontAwesomeIcon icon={["fas", directionIcon]} className={`text-base ${directionClassName}`} />
                  {fieldLabels.buy}
                </p>
                <p className={`text-xl font-black tracking-tight ${directionClassName}`}>
                  {marketMetrics.buy}
                </p>
              </div>
            </div>

            <div className="flex items-center lg:pl-8">
              <ButtonLink href={resolveClientAreaMarketChartHref(locale, marketCode)}>
                Live Chart
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
