import { ExchangeRateCurrencySelect } from "@/components/molecules/ExchangeRateCurrencySelect";
import { ExchangeRateFieldLabel } from "@/components/atoms/ExchangeRateFieldLabel";
import type {
  ExchangeRateCurrency,
  ExchangeRateSnapshot,
} from "@/lib/exchange-rates";
import type { AppMessages } from "@/locales";

type ExchangeRateConverterFormProps = {
  amount: string;
  fromCurrency: ExchangeRateCurrency;
  toCurrency: ExchangeRateCurrency;
  currencies: ExchangeRateSnapshot["currencies"];
  labels: AppMessages["liveQuotePage"]["exchangeRate"];
  onAmountChange: (value: string) => void;
  onFromCurrencyChange: (value: ExchangeRateCurrency) => void;
  onToCurrencyChange: (value: ExchangeRateCurrency) => void;
  onSwap: () => void;
};

export function ExchangeRateConverterForm({
  amount,
  fromCurrency,
  toCurrency,
  currencies,
  labels,
  onAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  onSwap,
}: ExchangeRateConverterFormProps) {
  const fromCurrencyOptions = currencies.filter(
    (currency) => currency.code === fromCurrency || currency.code !== toCurrency,
  );
  const toCurrencyOptions = currencies.filter(
    (currency) => currency.code === toCurrency || currency.code !== fromCurrency,
  );

  return (
    <div className="rounded-2xl border border-line bg-white/5 p-5">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <ExchangeRateFieldLabel>{labels.amountLabel}</ExchangeRateFieldLabel>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            className="h-11 rounded-lg border border-line bg-black/20 px-4 text-base text-foreground outline-none transition placeholder:text-foreground/40 focus:border-yellow-500/70"
            placeholder="1"
          />
        </label>

        <div className="grid grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] items-end gap-3">
          <label className="flex flex-col gap-2">
            <ExchangeRateFieldLabel>{labels.fromLabel}</ExchangeRateFieldLabel>
            <ExchangeRateCurrencySelect
              label={labels.fromLabel}
              value={fromCurrency}
              options={fromCurrencyOptions}
              searchPlaceholder={labels.searchCurrencyPlaceholder}
              emptyLabel={labels.noCurrencyFound}
              onChange={onFromCurrencyChange}
            />
          </label>

          <button
            type="button"
            onClick={onSwap}
            className="group flex h-11 w-10 items-center justify-center self-end rounded-lg border border-line bg-white/5 text-foreground/60 transition-all duration-200 hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-400"
            aria-label={labels.swapLabel}
            title={labels.swapLabel}
          >
            <svg
              className="transition-transform duration-300 group-hover:rotate-180"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M9.5 1.5L12 4L9.5 6.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 4H3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M4.5 7.5L2 10L4.5 12.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 10H11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <label className="flex flex-col gap-2">
            <ExchangeRateFieldLabel>{labels.toLabel}</ExchangeRateFieldLabel>
            <ExchangeRateCurrencySelect
              label={labels.toLabel}
              value={toCurrency}
              options={toCurrencyOptions}
              searchPlaceholder={labels.searchCurrencyPlaceholder}
              emptyLabel={labels.noCurrencyFound}
              onChange={onToCurrencyChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
