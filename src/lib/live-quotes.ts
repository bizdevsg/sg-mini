import { PUBLIC_LIVE_QUOTE_SOCKET_URL } from "@/lib/env";

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

export type LiveQuoteDisplay = {
  label: string;
  symbol: string | null;
};

const LIVE_QUOTE_ICON_BY_SYMBOL: Record<string, string> = {
  XUL10: "/assets/icon-symbol/gold-icon.png",
  XAGUSD: "/assets/icon-symbol/silver-icon.png",
  BCO10_BBJ: "/assets/icon-symbol/oil-icon.png",
  HKK50_BBJ: "/assets/icon-symbol/hangseng-icon.png",
  JPK50_BBJ: "/assets/icon-symbol/nikkei-icon.png",
  DX1010_BBJ: "/assets/icon-symbol/dxy-icon.png",
  AU1010_BBJ: "/assets/icon-symbol/audusd-icon.png",
  AUDUSD: "/assets/icon-symbol/audusd-icon.png",
  EU1010_BBJ: "/assets/icon-symbol/eurousd-icon.png",
  EURUSD: "/assets/icon-symbol/eurousd-icon.png",
  GU1010_BBJ: "/assets/icon-symbol/gbpusd-icon.png",
  GBPUSD: "/assets/icon-symbol/gbpusd-icon.png",
  UC1010_BBJ: "/assets/icon-symbol/usdcad-icon.png",
  USDCAD: "/assets/icon-symbol/usdcad-icon.png",
  UJ1010_BBJ: "/assets/icon-symbol/usdjpy-icon.png",
  USDJPY: "/assets/icon-symbol/usdjpy-icon.png",
  USDCHF: "/assets/icon-symbol/usdchf-icon.png",
  UI1010_BBJ: "/assets/icon-symbol/usdidr-icon.png",
  USDIDR: "/assets/icon-symbol/usdidr-icon.png",
};
const LIVE_QUOTE_ICON_VERSION = "20260626-1";

export const LIVE_QUOTE_SOCKET_URL = PUBLIC_LIVE_QUOTE_SOCKET_URL;

export const QUOTE_ORDER = [
  "XUL10",
  "BCO10_BBJ",
  "HKK50_BBJ",
  "JPK50_BBJ",
  "DX1010_BBJ",
  "AU1010_BBJ",
  "EU1010_BBJ",
  "GU1010_BBJ",
  "UC1010_BBJ",
  "UJ1010_BBJ",
  "UI1010_BBJ",
] as const;

export const LIVE_QUOTE_LABELS: Record<(typeof QUOTE_ORDER)[number], string> = {
  XUL10: "Gold",
  BCO10_BBJ: "Brent Crude",
  HKK50_BBJ: "Hang Seng",
  JPK50_BBJ: "Nikkei 225",
  DX1010_BBJ: "DXY",
  AU1010_BBJ: "AUD/USD",
  EU1010_BBJ: "EUR/USD",
  GU1010_BBJ: "GBP/USD",
  UC1010_BBJ: "USD/CAD",
  UJ1010_BBJ: "USD/JPY",
  UI1010_BBJ: "USD/IDR",
};

export function getLiveQuoteDisplay(symbol: string): LiveQuoteDisplay {
  const label = LIVE_QUOTE_LABELS[symbol as keyof typeof LIVE_QUOTE_LABELS];

  if (!label || label === symbol) {
    return {
      label: symbol,
      symbol: null,
    };
  }

  return {
    label,
    symbol,
  };
}

export function getLiveQuoteIconSrc(symbol: string) {
  const appendVersion = (src: string) =>
    `${src}${src.includes("?") ? "&" : "?"}v=${LIVE_QUOTE_ICON_VERSION}`;

  if (symbol in LIVE_QUOTE_ICON_BY_SYMBOL) {
    return appendVersion(LIVE_QUOTE_ICON_BY_SYMBOL[symbol]);
  }

  const normalized = symbol.replace(/[^A-Z]/gi, "").toUpperCase();
  return LIVE_QUOTE_ICON_BY_SYMBOL[normalized]
    ? appendVersion(LIVE_QUOTE_ICON_BY_SYMBOL[normalized])
    : null;
}

export function getSortedSymbols(quotes: LiveQuotePayload) {
  const ordered = QUOTE_ORDER.filter((symbol) => symbol in quotes);
  const remaining = Object.keys(quotes)
    .filter(
      (symbol) => !QUOTE_ORDER.includes(symbol as (typeof QUOTE_ORDER)[number]),
    )
    .sort();

  return [...ordered, ...remaining];
}
