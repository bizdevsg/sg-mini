import { LiveQuoteInstrumentIcon } from "@/components/atoms/LiveQuoteInstrumentIcon";
import { LiveQuoteSymbol } from "@/components/atoms/LiveQuoteSymbol";
import { LiveQuoteTrendIndicator } from "@/components/atoms/LiveQuoteTrendIndicator";
import type { AppLocale, AppMessages } from "@/locales";

import {
  formatQuoteNumber,
  getDirectionClassName,
  getRowClassName,
  type LiveQuoteTick,
} from "./live-quote.shared";

type LiveQuoteCompactCardProps = {
  locale: AppLocale;
  symbol: string;
  tick: LiveQuoteTick;
  fieldLabels: AppMessages["liveQuoteTable"]["fields"];
};

export function LiveQuoteCompactCard({
  locale,
  symbol,
  tick,
  fieldLabels,
}: LiveQuoteCompactCardProps) {
  const directionClassName = getDirectionClassName(tick.price_change);
  const rowClassName = getRowClassName(tick.price_change);

  return (
    <article
      className={`rounded-xl border px-5 py-5 shadow-[0_16px_36px_rgba(0,0,0,0.24)] sm:px-6 select-none ${rowClassName}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LiveQuoteInstrumentIcon symbol={symbol} />

          <LiveQuoteSymbol
            symbol={symbol}
            className={`${directionClassName}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <LiveQuoteTrendIndicator
            direction={tick.price_change}
            locale={locale}
          />

          <div className={`text-lg font-bold sm:text-xl ${directionClassName}`}>
            {formatQuoteNumber(tick.price, locale)}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-white/10 bg-black/10 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">
            {fieldLabels.buy}
          </p>
          <p className="mt-2 font-mono text-white/78">
            {formatQuoteNumber(tick.buy, locale)}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/10 px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">
            {fieldLabels.sell}
          </p>
          <p className="mt-2 font-mono text-white/78">
            {formatQuoteNumber(tick.sell, locale)}
          </p>
        </div>
      </div>
    </article>
  );
}
