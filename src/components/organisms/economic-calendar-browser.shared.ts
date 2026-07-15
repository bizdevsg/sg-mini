import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";
import { getLocaleConfig, type AppLocale } from "@/locales";

export type EconomicCalendarDetailLabels = {
  source: string;
  measures: string;
  effect: string;
  frequency: string;
  nextRelease: string;
  notes: string;
  whyCare: string;
};

export type EconomicCalendarHistoryLabels = {
  date: string;
  previous: string;
  forecast: string;
  actual: string;
  noHistory: string;
};

export type EconomicCalendarExpandedLabels = EconomicCalendarDetailLabels &
  EconomicCalendarHistoryLabels;

export function formatCalendarDate(value: string, locale: AppLocale) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    dateStyle: "medium",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(parsedDate);
}

function parseEconomicValue(value: string) {
  const normalizedValue = value.trim().toUpperCase();

  if (!normalizedValue || normalizedValue === "-") {
    return null;
  }

  const matchedValue = normalizedValue.match(
    /-?\d+(?:[.,]\d+)?(?:\s*[KMBT])?/,
  );

  if (!matchedValue) {
    return null;
  }

  const compactValue = matchedValue[0].replace(/\s+/g, "");
  const suffix = compactValue.match(/[KMBT]$/)?.[0] ?? "";
  const numericPortion = suffix
    ? compactValue.slice(0, -1)
    : compactValue;
  const parsedNumber = Number(numericPortion.replace(/,/g, ""));

  if (!Number.isFinite(parsedNumber)) {
    return null;
  }

  const multipliers: Record<string, number> = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000,
    T: 1_000_000_000_000,
  };

  return parsedNumber * (multipliers[suffix] ?? 1);
}

export function getActualValueColorClassName(actual: string, previous: string) {
  const actualValue = parseEconomicValue(actual);
  const previousValue = parseEconomicValue(previous);

  if (actualValue === null || previousValue === null) {
    return "text-foreground/78";
  }

  if (actualValue > previousValue) {
    return "text-emerald-400";
  }

  if (actualValue < previousValue) {
    return "text-rose-400";
  }

  return "text-foreground/78";
}

export function getEventGroupDateLabel(
  value: string | null,
  locale: AppLocale,
  fallbackLabel: string,
) {
  if (!value) {
    return fallbackLabel;
  }

  return formatCalendarDate(value, locale);
}

export type EconomicCalendarEventComponentProps = {
  event: EconomicCalendarEvent;
};
