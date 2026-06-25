import { getLiveQuoteDisplay, type LiveQuoteDisplay } from "@/lib/live-quotes";
import { formatLocaleNumber, formatLocaleTime, type AppLocale } from "@/locales";

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
    return "text-emerald-400";
  }

  if (direction === "down") {
    return "text-rose-400";
  }

  return "text-foreground/58";
}

export function getRowClassName(direction: string) {
  if (direction === "up") {
    return "bg-linear-to-br from-emerald-400/20 to-white/5 border-emerald-400/40";
  }

  if (direction === "down") {
    return "bg-linear-to-br from-rose-400/20 to-white/5 border-rose-400/40";
  }

  return "bg-white/5 border-line";
}

export function getLiveQuoteSymbolDisplay(symbol: string): LiveQuoteDisplay {
  return getLiveQuoteDisplay(symbol);
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
