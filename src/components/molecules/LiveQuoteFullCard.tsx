import { LiveQuoteSymbol } from "@/components/atoms/LiveQuoteSymbol";
import { LiveQuoteTrendIndicator } from "@/components/atoms/LiveQuoteTrendIndicator";
import type { AppLocale, AppMessages } from "@/locales";

import {
  formatQuoteNumber,
  formatQuoteTime,
  getDirectionClassName,
  getRowClassName,
  type LiveQuoteTick,
} from "./live-quote.shared";

type LiveQuoteFullCardProps = {
  locale: AppLocale;
  symbol: string;
  tick: LiveQuoteTick;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
};

export function LiveQuoteFullCard({
  locale,
  symbol,
  tick,
  fieldLabels,
}: LiveQuoteFullCardProps) {
  const directionClassName = getDirectionClassName(tick.price_change);
  const rowClassName = getRowClassName(tick.price_change);

  return (
    <article
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
        <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
            {fieldLabels.sell}
          </p>
          <p className="mt-1 font-mono text-foreground/78">
            {formatQuoteNumber(tick.sell, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
            {fieldLabels.buy}
          </p>
          <p className="mt-1 font-mono text-foreground/78">
            {formatQuoteNumber(tick.buy, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
            {fieldLabels.open}
          </p>
          <p className="mt-1 font-mono text-foreground/78">
            {formatQuoteNumber(tick.oprice, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
            {fieldLabels.high}
          </p>
          <p className="mt-1 font-mono text-foreground/78">
            {formatQuoteNumber(tick.hprice, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
            {fieldLabels.low}
          </p>
          <p className="mt-1 font-mono text-foreground/78">
            {formatQuoteNumber(tick.lprice, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-black/20 px-4 py-3">
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
