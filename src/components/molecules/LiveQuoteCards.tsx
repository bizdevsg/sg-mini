import { LiveQuoteTrendIndicator } from "@/components/atoms/LiveQuoteTrendIndicator";
import type { AppLocale, AppMessages } from "@/locales";

import {
  formatQuoteNumber,
  formatQuoteTime,
  getDirectionClassName,
  getLiveQuoteSymbolDisplay,
  getRowClassName,
  type LiveQuotePayload,
} from "./live-quote.shared";

type LiveQuoteCardsProps = {
  locale: AppLocale;
  mode: "compact" | "full";
  quotes: LiveQuotePayload;
  symbols: string[];
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
};

function LiveQuoteSymbol({
  symbol,
  className,
}: {
  symbol: string;
  className: string;
}) {
  const display = getLiveQuoteSymbolDisplay(symbol);

  return (
    <span className={className}>
      <span className="text-sm font-semibold md:text-base">{display.label}</span>
      {display.symbol ? (
        <span className="ml-1 text-xs font-medium text-foreground/62">
          ({display.symbol})
        </span>
      ) : null}
    </span>
  );
}

export function LiveQuoteCards({
  locale,
  mode,
  quotes,
  symbols,
  fieldLabels,
}: LiveQuoteCardsProps) {
  return (
    <div className={mode === "full" ? "grid gap-4 md:hidden" : "grid gap-4 lg:grid-cols-3"}>
      {symbols.map((symbol) => {
        const tick = quotes[symbol];
        const directionClassName = getDirectionClassName(tick.price_change);
        const rowClassName = getRowClassName(tick.price_change);

        if (mode === "full") {
          return (
            <article
              key={symbol}
              className={`rounded-xl border border-line p-4 shadow-[0_16px_36px_rgba(0,0,0,0.24)] ${rowClassName}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <LiveQuoteTrendIndicator
                    direction={tick.price_change}
                    locale={locale}
                  />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                      {fieldLabels.symbol}
                    </p>
                    <p className={`font-mono text-base font-bold ${directionClassName}`}>
                      <LiveQuoteSymbol
                        symbol={symbol}
                        className="font-mono text-base font-bold"
                      />
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55">
                    {fieldLabels.price}
                  </p>
                  <p className={`font-mono text-base font-bold ${directionClassName}`}>
                    {formatQuoteNumber(tick.price, locale)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                    {fieldLabels.sell}
                  </p>
                  <p className="mt-1 font-mono text-foreground/78">
                    {formatQuoteNumber(tick.sell, locale)}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                    {fieldLabels.buy}
                  </p>
                  <p className="mt-1 font-mono text-foreground/78">
                    {formatQuoteNumber(tick.buy, locale)}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                    {fieldLabels.open}
                  </p>
                  <p className="mt-1 font-mono text-foreground/78">
                    {formatQuoteNumber(tick.oprice, locale)}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                    {fieldLabels.high}
                  </p>
                  <p className="mt-1 font-mono text-foreground/78">
                    {formatQuoteNumber(tick.hprice, locale)}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                    {fieldLabels.low}
                  </p>
                  <p className="mt-1 font-mono text-foreground/78">
                    {formatQuoteNumber(tick.lprice, locale)}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-black/20 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                    {fieldLabels.time}
                  </p>
                  <p className="mt-1 text-foreground/72">
                    {formatQuoteTime(tick.time, tick.date_time, locale)}
                  </p>
                </div>
              </div>
            </article>
          );
        }

        return (
          <article
            key={symbol}
            className={`rounded-xl border px-5 py-5 shadow-[0_16px_36px_rgba(0,0,0,0.24)] sm:px-6 ${rowClassName}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LiveQuoteTrendIndicator
                  direction={tick.price_change}
                  locale={locale}
                />
                <div>
                  {/* <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">
                    {fieldLabels.symbol}
                  </p> */}
                  <p
                    className={`font-mono text-lg font-bold sm:text-xl ${directionClassName}`}
                  >
                    <LiveQuoteSymbol
                      symbol={symbol}
                      className="font-mono text-lg font-bold sm:text-xl"
                    />
                  </p>
                </div>
              </div>

              <p className={`text-lg font-bold sm:text-xl ${directionClassName}`}>
                {formatQuoteNumber(tick.price, locale)}
              </p>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.14em] text-foreground/55">
              {fieldLabels.price}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-line bg-black/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                  {fieldLabels.buy}
                </p>
                <p className="mt-2 font-mono text-foreground/78">
                  {formatQuoteNumber(tick.buy, locale)}
                </p>
              </div>
              <div className="rounded-lg border border-line bg-black/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-foreground/55">
                  {fieldLabels.sell}
                </p>
                <p className="mt-2 font-mono text-foreground/78">
                  {formatQuoteNumber(tick.sell, locale)}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
