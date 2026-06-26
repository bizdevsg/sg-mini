import {
  formatLocaleNumber,
  formatLocaleTime,
  type AppLocale,
} from "@/locales";

export type QuoteDirection = "up" | "down" | "-";

export type LiveQuoteTick = {
  price_change: QuoteDirection | string;
  price: string;
  sell: string;
  buy: string;
  oprice: string;
  hprice: string;
  lprice: string;
  time: string;
  date_time: string;
};

export type LiveQuotePayload = Record<string, LiveQuoteTick>;

export function getDirectionClassName(direction: string) {
  if (direction === "up") {
    return "text-green-500";
  }

  if (direction === "down") {
    return "text-red-500";
  }

  return "text-white/78";
}

export function getRowClassName(direction: string) {
  if (direction === "up") {
    return "bg-linear-to-br from-green-400/20 to-white/5 border-green-400/40";
  }

  if (direction === "down") {
    return "bg-linear-to-br from-red-400/20 to-white/5 border-red-400/40";
  }

  return "bg-linear-to-br from-white/10 to-white/5 border-white/10";
}

export function formatQuoteNumber(value: string, locale: AppLocale) {
  return formatLocaleNumber(value, locale);
}

export function formatQuoteTime(
  time: string,
  dateTime: string,
  locale: AppLocale,
) {
  return formatLocaleTime(time, dateTime, locale);
}
