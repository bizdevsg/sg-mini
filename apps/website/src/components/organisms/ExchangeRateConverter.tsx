"use client";

import { useEffect, useState } from "react";

import { ExchangeRateConverterForm } from "@/components/molecules/ExchangeRateConverterForm";
import { ExchangeRateConverterResult } from "@/components/molecules/ExchangeRateConverterResult";
import {
  getLocaleConfig,
  type AppLocale,
  type AppMessages,
} from "@/locales";
import type {
  ExchangeRateCurrency,
  ExchangeRateSnapshot,
} from "@/lib/exchange-rates";

type ExchangeRateConverterProps = {
  locale: AppLocale;
  labels: AppMessages["liveQuotePage"]["exchangeRate"];
  initialSnapshot: ExchangeRateSnapshot;
  onSnapshotChange?: (snapshot: ExchangeRateSnapshot) => void;
};

function formatNumber(
  value: number,
  locale: AppLocale,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
) {
  return new Intl.NumberFormat(getLocaleConfig(locale).intl, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

function convertAmount(
  amount: number,
  from: ExchangeRateCurrency,
  to: ExchangeRateCurrency,
  rates: ExchangeRateSnapshot["rates"],
) {
  if (from === to) {
    return amount;
  }

  const fromRate = rates[from];
  const toRate = rates[to];

  if (!Number.isFinite(amount) || amount < 0 || !fromRate || !toRate) {
    return 0;
  }

  return (amount / fromRate) * toRate;
}

function findFirstDifferentCurrency(
  currencies: ExchangeRateSnapshot["currencies"],
  currentCurrency: ExchangeRateCurrency,
) {
  return (
    currencies.find((currency) => currency.code !== currentCurrency)?.code ??
    currentCurrency
  );
}

function getInitialTargetCurrency(snapshot: ExchangeRateSnapshot) {
  if (snapshot.base !== "IDR" && snapshot.currencies.some((item) => item.code === "IDR")) {
    return "IDR";
  }

  return findFirstDifferentCurrency(snapshot.currencies, snapshot.base);
}

export function ExchangeRateConverter({
  locale,
  labels,
  initialSnapshot,
  onSnapshotChange,
}: ExchangeRateConverterProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState<ExchangeRateCurrency>(
    initialSnapshot.base,
  );
  const [toCurrency, setToCurrency] = useState<ExchangeRateCurrency>(
    getInitialTargetCurrency(initialSnapshot),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setSnapshot(initialSnapshot);
    setFromCurrency(initialSnapshot.base);
    setToCurrency(getInitialTargetCurrency(initialSnapshot));
    setHasError(false);
  }, [initialSnapshot]);

  useEffect(() => {
    onSnapshotChange?.(snapshot);
  }, [onSnapshotChange, snapshot]);

  useEffect(() => {
    if (fromCurrency !== toCurrency) {
      return;
    }

    setToCurrency(findFirstDifferentCurrency(snapshot.currencies, fromCurrency));
  }, [fromCurrency, toCurrency, snapshot.currencies]);

  useEffect(() => {
    if (snapshot.base === fromCurrency) {
      return;
    }

    const controller = new AbortController();

    async function loadSnapshot() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch(`/api/exchange-rates?base=${fromCurrency}`, {
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load exchange rates: ${response.status}`);
        }

        const nextSnapshot = (await response.json()) as ExchangeRateSnapshot;

        if (!controller.signal.aborted) {
          setSnapshot(nextSnapshot);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error("Failed to refresh exchange rates", error);
        setHasError(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadSnapshot();

    return () => {
      controller.abort();
    };
  }, [fromCurrency, snapshot.base]);

  const parsedAmount = Number(amount.replace(/,/g, "."));
  const safeAmount =
    Number.isFinite(parsedAmount) && parsedAmount >= 0 ? parsedAmount : 0;
  const convertedAmount = convertAmount(
    safeAmount,
    fromCurrency,
    toCurrency,
    snapshot.rates,
  );
  const exchangeRate = convertAmount(1, fromCurrency, toCurrency, snapshot.rates);
  const outputDecimals = 2;
  const rateDecimals = 2;

  return (
    <div
      className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]"
      aria-busy={isLoading}
    >
      <ExchangeRateConverterForm
        amount={amount}
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        currencies={snapshot.currencies}
        labels={labels}
        onAmountChange={setAmount}
        onFromCurrencyChange={(nextFromCurrency) => {
          setFromCurrency(nextFromCurrency);

          if (nextFromCurrency === toCurrency) {
            setToCurrency(fromCurrency);
          }
        }}
        onToCurrencyChange={(nextToCurrency) => {
          setToCurrency(nextToCurrency);

          if (nextToCurrency === fromCurrency) {
            setFromCurrency(toCurrency);
          }
        }}
        onSwap={() => {
          setFromCurrency(toCurrency);
          setToCurrency(fromCurrency);
        }}
      />
      <div className={isLoading ? "transition-opacity duration-200 opacity-70" : undefined}>
        <ExchangeRateConverterResult
          locale={locale}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          amount={safeAmount}
          convertedAmount={convertedAmount}
          exchangeRate={exchangeRate}
          outputDecimals={outputDecimals}
          rateDecimals={rateDecimals}
          labels={labels}
          formatNumber={formatNumber}
        />
        {hasError ? (
          <p className="mt-3 text-sm text-rose-400">{labels.unavailable}</p>
        ) : null}
      </div>
    </div>
  );
}
