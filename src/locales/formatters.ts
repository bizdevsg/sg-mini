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
    ? normalizedValue.split(".")[1]?.length ?? 0
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

  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(parsedDate);
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

  const timeLabel = new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: getLocaleConfig(locale).timeZone,
  })
    .format(parsedDate)
    .replace(":", ".");

  return `${dateLabel} - ${timeLabel}`;
}

export function formatLocaleTime(
  value: string,
  dateTime?: string,
  locale: AppLocale = DEFAULT_LOCALE,
) {
  const parsedDate = dateTime ? parseDateValue(dateTime) : null;

  if (!parsedDate) {
    return value;
  }

  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(parsedDate);
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
