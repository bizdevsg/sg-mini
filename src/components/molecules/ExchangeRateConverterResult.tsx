import type { AppLocale, AppMessages } from "@/locales";

type ExchangeRateConverterResultProps = {
  locale: AppLocale;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  exchangeRate: number;
  outputDecimals: number;
  rateDecimals: number;
  labels: AppMessages["liveQuotePage"]["exchangeRate"];
  formatNumber: (
    value: number,
    locale: AppLocale,
    minimumFractionDigits: number,
    maximumFractionDigits: number,
  ) => string;
};

export function ExchangeRateConverterResult({
  locale,
  fromCurrency,
  toCurrency,
  amount,
  convertedAmount,
  exchangeRate,
  outputDecimals,
  rateDecimals,
  labels,
  formatNumber,
}: ExchangeRateConverterResultProps) {
  return (
    <div className="rounded-2xl h-full flex flex-col justify-between border border-yellow-500/15 bg-[linear-gradient(180deg,rgba(205,161,58,0.07),rgba(10,10,10,0.88)_45%)] p-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
          {labels.outputLabel}
        </p>
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 py-1">
          <span className="text-xs font-semibold text-foreground/70">{fromCurrency}</span>
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none" className="text-foreground/35">
            <path d="M1 3.5H9M6.5 1L9 3.5L6.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs font-semibold text-foreground/70">{toCurrency}</span>
        </div>
      </div>

      {/* Converted amount */}
      <div className="mt-4 flex items-end gap-2">
        <p className="mt-1 text-sm font-semibold text-yellow-500/60 mb-1">{toCurrency}</p>
        <p className="font-mono text-4xl font-bold tracking-[-0.04em] text-yellow-500">
          {formatNumber(convertedAmount, locale, outputDecimals, outputDecimals)}
        </p>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-line" />

      {/* Rate details */}
      <div className="space-y-1.5">
        {/* <p className="text-sm text-foreground/62">
          {formatNumber(amount, locale, 2, 2)} {fromCurrency}
          {" = "}
          {formatNumber(convertedAmount, locale, outputDecimals, outputDecimals)} {toCurrency}
        </p> */}
        <p className="text-xs text-foreground/40">
          1 {fromCurrency}
          {" = "}
          {formatNumber(exchangeRate, locale, rateDecimals, rateDecimals)} {toCurrency}
        </p>
      </div>
    </div>
  );
}
