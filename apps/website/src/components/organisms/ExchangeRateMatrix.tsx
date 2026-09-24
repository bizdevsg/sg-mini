"use client";

import { getLocaleConfig, type AppLocale, type AppMessages } from "@/locales";
import type { ExchangeRateSnapshot } from "@/lib/exchange-rates";

type ExchangeRateMatrixProps = {
  locale: AppLocale;
  labels: AppMessages["liveQuotePage"]["exchangeRate"];
  snapshot: ExchangeRateSnapshot;
};

function getMatrixValue(
  fromRate: number | undefined,
  toRate: number | undefined,
) {
  if (!fromRate || !toRate) {
    return null;
  }

  return toRate / fromRate;
}

function formatMatrixValue(value: number, locale: AppLocale) {
  return new Intl.NumberFormat(getLocaleConfig(locale).intl, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function ExchangeRateMatrix({
  locale,
  labels,
  snapshot,
}: ExchangeRateMatrixProps) {
  const scrollAreaClassName = [
    "mt-4 overflow-auto rounded-xl border border-white/8",
    "[scrollbar-color:rgba(234,179,8,0.55)_rgba(255,255,255,0.08)] [scrollbar-width:thin]",
    "[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2",
    "[&::-webkit-scrollbar-track]:bg-white/[0.08]",
    "[&::-webkit-scrollbar-track]:rounded-full",
    "[&::-webkit-scrollbar-thumb]:rounded-full",
    "[&::-webkit-scrollbar-thumb]:bg-yellow-500/55",
  ].join(" ");

  return (
    <div className="mt-6 rounded-2xl border border-line bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{labels.matrixTitle}</h3>
          <p className="mt-1 text-sm text-foreground/55">
            {labels.matrixBaseLabel}: {snapshot.base}
          </p>
        </div>
        <div className="rounded-full border border-line bg-black/20 px-3 py-1.5 text-xs text-foreground/62">
          {labels.matrixUnitLabel}
        </div>
      </div>

      <div className={scrollAreaClassName}>
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-white/[0.04]">
              <th className="sticky left-0 top-0 z-20 min-w-[140px] border-b border-r border-white/8 bg-neutral-950 px-4 py-3 text-left font-semibold text-white">
                FX
              </th>
              {snapshot.currencies.map((currency) => (
                <th
                  key={currency.code}
                  className="min-w-[132px] border-b border-white/8 px-4 py-3 text-left font-semibold text-white"
                >
                  {currency.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {snapshot.currencies.map((fromCurrency) => (
              <tr key={fromCurrency.code}>
                <th className="sticky left-0 z-10 border-r border-t border-white/8 bg-neutral-950 px-4 py-3 text-left font-semibold text-white">
                  <div>{fromCurrency.code}</div>
                  <div className="mt-1 text-xs font-normal text-foreground/45">
                    {fromCurrency.label}
                  </div>
                </th>
                {snapshot.currencies.map((toCurrency) => {
                  const value = getMatrixValue(
                    snapshot.rates[fromCurrency.code],
                    snapshot.rates[toCurrency.code],
                  );
                  const isSameCurrency =
                    fromCurrency.code === toCurrency.code;

                  return (
                    <td
                      key={`${fromCurrency.code}-${toCurrency.code}`}
                      className={
                        isSameCurrency
                          ? "border-t border-white/8 bg-yellow-500/10 px-4 py-3 font-semibold text-yellow-400"
                          : "border-t border-white/8 px-4 py-3 text-foreground/72"
                      }
                    >
                      {value === null ? "-" : formatMatrixValue(value, locale)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
