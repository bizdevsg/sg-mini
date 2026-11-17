import { DEFAULT_LOCALE, getLocaleConfig, type AppLocale } from "./config";

function parseDateValue(value: string) {
  const directDate = new Date(value);

  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const normalizedDate = new Date(value.replace(" ", "T"));

  if (!Number.isNaN(normalizedDate.getTime())) {
    return normalizedDate;
  }

  return null;
}

function formatClock(
  date: Date,
  locale: AppLocale,
  includeSeconds: boolean,
) {
  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds ? { second: "2-digit" as const } : {}),
    hourCycle: "h23",
    timeZone: getLocaleConfig(locale).timeZone,
  })
    .format(date)
    .replace(/\./g, ":");
}

function normalizeClockFallback(value: string) {
  const match = value.trim().match(/^(\d{1,2})[.:](\d{2})(?:[.:](\d{2}))?$/);

  if (!match) {
    return value;
  }

  const [, hour, minute, second = "00"] = match;
  return `${hour.padStart(2, "0")}:${minute}:${second}`;
}

export function formatLocaleNumber(
  value: string | number | null | undefined,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  if (value == null) {
    return "-";
  }

  const stringValue = typeof value === "number" ? String(value) : value;
  const normalizedValue = stringValue.trim().replace(/,/g, "");

  if (!/^-?\d+(\.\d+)?$/.test(normalizedValue)) {
    return stringValue;
  }

  const decimalDigits = normalizedValue.includes(".")
    ? (normalizedValue.split(".")[1]?.length ?? 0)
    : 0;
  const numericValue = Number(normalizedValue);

  if (!Number.isFinite(numericValue)) {
    return stringValue;
  }

  return new Intl.NumberFormat(getLocaleConfig(locale).intl, {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  }).format(numericValue);
}

export function formatLocaleDateTime(
  value: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const parsedDate = parseDateValue(value);

  if (!parsedDate) {
    return value;
  }

  const dateLabel = new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    dateStyle: "medium",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(parsedDate);

  return `${dateLabel}, ${formatClock(parsedDate, locale, false)}`;
}

export function formatLocaleArticleDateTime(
  value: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const parsedDate = parseDateValue(value);

  if (!parsedDate) {
    return value;
  }

  const dateLabel = new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(parsedDate);

  const timeLabel = formatClock(parsedDate, locale, false);

  return `${dateLabel} - ${timeLabel}`;
}

export function formatLocaleTime(
  value: string,
  dateTime?: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const parsedDate = dateTime ? parseDateValue(dateTime) : null;

  if (!parsedDate) {
    return normalizeClockFallback(value);
  }

  return formatClock(parsedDate, locale, true);
}

export function formatLocaleYear(
  date = new Date(),
  locale: AppLocale = DEFAULT_LOCALE,
) {
  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    year: "numeric",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(date);
}
