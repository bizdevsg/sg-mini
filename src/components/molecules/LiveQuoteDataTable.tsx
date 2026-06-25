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

type LiveQuoteDataTableProps = {
  locale: AppLocale;
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

export function LiveQuoteDataTable({
  locale,
  quotes,
  symbols,
  fieldLabels,
}: LiveQuoteDataTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-line md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.symbol}
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.price}
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.sell}
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.buy}
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.open}
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.high}
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.low}
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                {fieldLabels.time}
              </th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((symbol) => {
              const tick = quotes[symbol];
              const directionClassName = getDirectionClassName(tick.price_change);
              const rowClassName = getRowClassName(tick.price_change);

              return (
                <tr
                  key={symbol}
                  className={`border-t border-line align-middle ${rowClassName}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <LiveQuoteTrendIndicator
                        direction={tick.price_change}
                        locale={locale}
                      />
                      <LiveQuoteSymbol
                        symbol={symbol}
                        className={`font-mono ${directionClassName}`}
                      />
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 text-center font-mono text-sm font-semibold sm:text-base ${directionClassName}`}
                  >
                    {formatQuoteNumber(tick.price, locale)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                    {formatQuoteNumber(tick.sell, locale)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                    {formatQuoteNumber(tick.buy, locale)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                    {formatQuoteNumber(tick.oprice, locale)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                    {formatQuoteNumber(tick.hprice, locale)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                    {formatQuoteNumber(tick.lprice, locale)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-foreground/72">
                    {formatQuoteTime(tick.time, tick.date_time, locale)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
