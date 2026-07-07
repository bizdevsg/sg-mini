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
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 px-4 py-4 transition-all sm:px-6 sm:py-5">
      <div className="absolute inset-y-0 left-0 w-24 rounded-full bg-white/[0.04] blur-2xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-950/90 shadow-[inset_0_2px_18px_rgba(255,191,36,0.18),0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-amber-400/20 sm:h-15 sm:w-15">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-radial-[at_30%_30%] from-amber-300/20 via-transparent to-transparent sm:h-15 sm:w-15">
              <LiveQuoteInstrumentIcon
                symbol={marketCode}
                className="h-12 w-12 sm:h-14 sm:w-14"
              />
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
              {item.symbol}{" "}
              <span className="text-sm text-zinc-500 sm:text-base">({marketCode})</span>
            </h3>
          </div>
        </div>

        <div className="w-full min-w-0">
          <div className="grid gap-3 min-[440px]:grid-cols-2 xl:grid-cols-[repeat(3,minmax(0,1fr))_auto] xl:items-center">
            <div className="grid gap-3 lg:gap-2">
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
                  {fieldLabels.high}
                </p>
                <p className="text-base font-black tracking-tight text-yellow-400 sm:text-xl">
                  {marketMetrics.high}
                </p>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
                  {fieldLabels.low}
                </p>
                <p className="text-base font-black tracking-tight text-yellow-400 sm:text-xl">
                  {marketMetrics.low}
                </p>
              </div>
            </div>

            <div className="grid gap-3 lg:gap-2">
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
                  {fieldLabels.open}
                </p>
                <p className="text-base font-black tracking-tight text-yellow-400 sm:text-xl">
                  {marketMetrics.open}
                </p>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
                  <FontAwesomeIcon
                    icon={["far", "alarm-clock"]}
                    className="text-sm text-zinc-300"
                  />
                </p>
                <p className="text-base font-black tracking-tight text-yellow-400 sm:text-xl">
                  {marketMetrics.time}
                </p>
              </div>
            </div>

            <div className="grid gap-3 lg:gap-2 min-[440px]:col-span-2 xl:col-span-1">
              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
                  <FontAwesomeIcon
                    icon={["fas", directionIcon]}
                    className={`text-base ${directionClassName}`}
                  />
                  {fieldLabels.sell}
                </p>
                <p className={`text-base font-black tracking-tight sm:text-xl ${directionClassName}`}>
                  {marketMetrics.sell}
                </p>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
                  <FontAwesomeIcon
                    icon={["fas", directionIcon]}
                    className={`text-base ${directionClassName}`}
                  />
                  {fieldLabels.buy}
                </p>
                <p className={`text-base font-black tracking-tight sm:text-xl ${directionClassName}`}>
                  {marketMetrics.buy}
                </p>
              </div>
            </div>

            <div className="flex items-center xl:justify-end xl:pl-4">
              <ButtonLink
                href={resolveClientAreaMarketChartHref(locale, marketCode)}
                className="w-full sm:w-auto"
              >
                Live Chart
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
