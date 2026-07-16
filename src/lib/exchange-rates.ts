import "server-only";

import { FRANKFURTER_API_URL } from "@/lib/env";

export type ExchangeRateCurrency = string;

type FrankfurterLatestResponse = {
  amount?: number;
  base?: string;
  date?: string;
  rates?: Partial<Record<string, number>>;
};

export type ExchangeRateCurrencyOption = {
  code: ExchangeRateCurrency;
  label: string;
};

export type ExchangeRateSnapshot = {
  base: ExchangeRateCurrency;
  date: string;
  rates: Record<ExchangeRateCurrency, number>;
  currencies: ExchangeRateCurrencyOption[];
};

export const DEFAULT_EXCHANGE_RATE_BASE: ExchangeRateCurrency = "USD";
const CURRENCY_DISPLAY_NAMES = new Intl.DisplayNames(["en"], {
  type: "currency",
});

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

function normalizeDate(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function normalizeExchangeRateCurrency(
  value: unknown,
): ExchangeRateCurrency | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toUpperCase();

  return isExchangeRateCurrencyCode(normalizedValue) ? normalizedValue : null;
}

function getCurrencyLabel(code: ExchangeRateCurrency) {
  return CURRENCY_DISPLAY_NAMES.of(code) ?? code;
}

function buildExchangeRateCurrencies(
  base: ExchangeRateCurrency,
  rates: Partial<Record<string, number>> | undefined,
) {
  const currencyCodes = Array.from(
    new Set([
      base,
      ...Object.keys(rates ?? {})
        .map((code) => normalizeExchangeRateCurrency(code))
        .filter((code): code is ExchangeRateCurrency => Boolean(code)),
    ]),
  );

  if (currencyCodes.length === 0) {
    return [];
  }

  const sortedCurrencies = currencyCodes
    .filter((code) => code !== base)
    .sort((left, right) => left.localeCompare(right));

  return [base, ...sortedCurrencies].map((code) => ({
    code,
    label: getCurrencyLabel(code),
  }));
}

function buildExchangeRateMap(
  base: ExchangeRateCurrency,
  currencies: ExchangeRateCurrencyOption[],
  rates: Partial<Record<string, number>> | undefined,
) {
  const normalizedRates: Partial<Record<ExchangeRateCurrency, number>> = {
    [base]: 1,
  };

  for (const currency of currencies) {
    if (currency.code === base) {
      continue;
    }

    const rate = normalizeNumber(rates?.[currency.code]);

    if (!rate) {
      return null;
    }

    normalizedRates[currency.code] = rate;
  }

  return normalizedRates as Record<ExchangeRateCurrency, number>;
}

export function isExchangeRateCurrency(
  value: string,
): value is ExchangeRateCurrency {
  return isExchangeRateCurrencyCode(value);
}

export function isExchangeRateCurrencyCode(value: string) {
  return /^[A-Z]{3}$/.test(value.trim().toUpperCase());
}

function buildFrankfurterUrl(base: ExchangeRateCurrency) {
  const url = new URL(FRANKFURTER_API_URL);

  url.searchParams.set("base", base);

  return url.toString();
}

export async function getExchangeRateSnapshot(
  base: ExchangeRateCurrency = DEFAULT_EXCHANGE_RATE_BASE,
) {
  try {
    const response = await fetch(buildFrankfurterUrl(base), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch exchange rates: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const payload = (await response.json()) as FrankfurterLatestResponse;
    const resolvedBase = normalizeExchangeRateCurrency(payload.base) ?? base;
    const date = normalizeDate(payload.date);
    const currencies = buildExchangeRateCurrencies(resolvedBase, payload.rates);
    const rates = buildExchangeRateMap(resolvedBase, currencies, payload.rates);

    if (!date || currencies.length === 0 || !rates) {
      return null;
    }

    return {
      base: resolvedBase,
      date,
      rates,
      currencies,
    } satisfies ExchangeRateSnapshot;
  } catch (error) {
    console.error("Failed to fetch exchange rates", error);
    return null;
  }
}
