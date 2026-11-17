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
  XUL10: "/assets/icon/gold-icon.webp",
  XUL10_BBJ: "/assets/icon/gold-icon.webp",
  XAGUSD: "/assets/icon/silver-icon.webp",
  BCO10_BBJ: "/assets/icon/bco-icon.webp",
  HKK50_BBJ: "/assets/icon/hkk-icon.webp",
  JPK50_BBJ: "/assets/icon/jpk-icon.webp",
  DX1010_BBJ: "/assets/icon/dxy-icon.webp",
  AU1010_BBJ: "/assets/icon/aud-usd-icon.webp",
  AUDUSD: "/assets/icon/aud-usd-icon.webp",
  EU1010_BBJ: "/assets/icon/eur-usd-icon.webp",
  EURUSD: "/assets/icon/eur-usd-icon.webp",
  GU1010_BBJ: "/assets/icon/gbp-usd-icon.webp",
  GBPUSD: "/assets/icon/gbp-usd-icon.webp",
  UC1010_BBJ: "/assets/icon/usd-cad-icon.webp",
  USDCAD: "/assets/icon/usd-cad-icon.webp",
  UJ1010_BBJ: "/assets/icon/usd-jpy-icon.webp",
  USDJPY: "/assets/icon/usd-jpy-icon.webp",
  USDCHF: "/assets/icon/usd-chf-icon.webp",
  UI1010_BBJ: "/assets/icon/usd-idr-icon.webp",
  USDIDR: "/assets/icon/usd-idr-icon.webp",
};
const LIVE_QUOTE_ICON_VERSION = "20260626-1";

export const LIVE_QUOTE_SOCKET_URL = PUBLIC_LIVE_QUOTE_SOCKET_URL;

// Simbol yang tetap dikirim feed websocket tetapi tidak boleh tampil di list
// mana pun (duplikat "-NC" dari instrumen yang sudah diwakili kontrak BBJ-nya).
const LIVE_QUOTE_EXCLUDED_SYMBOLS = new Set(["BCO-NC", "HKK-NC", "JPK-NC"]);

export function isExcludedLiveQuoteSymbol(symbol: string) {
  return LIVE_QUOTE_EXCLUDED_SYMBOLS.has(symbol.trim().toUpperCase());
}

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

const LIVE_QUOTE_DISPLAY_ORDER = [
  "XUL10",
  "XUL10_BBJ",
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

export const LIVE_QUOTE_LABELS: Record<string, string> = {
  XUL10: "Gold",
  XUL10_BBJ: "Gold",
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
  const normalizedSymbol = symbol.trim().toUpperCase();
  const label = LIVE_QUOTE_LABELS[normalizedSymbol];

  if (!label || label === normalizedSymbol) {
    return {
      label: normalizedSymbol,
      symbol: null,
    };
  }

  return {
    label,
    symbol: normalizedSymbol,
  };
}

export function getLiveQuoteIconSrc(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const appendVersion = (src: string) =>
    `${src}${src.includes("?") ? "&" : "?"}v=${LIVE_QUOTE_ICON_VERSION}`;

  if (normalizedSymbol in LIVE_QUOTE_ICON_BY_SYMBOL) {
    return appendVersion(LIVE_QUOTE_ICON_BY_SYMBOL[normalizedSymbol]);
  }

  const normalized = normalizedSymbol.replace(/[^A-Z]/gi, "").toUpperCase();
  return LIVE_QUOTE_ICON_BY_SYMBOL[normalized]
    ? appendVersion(LIVE_QUOTE_ICON_BY_SYMBOL[normalized])
    : null;
}

export function getSortedSymbols(quotes: LiveQuotePayload) {
  const ordered = LIVE_QUOTE_DISPLAY_ORDER.filter(
    (symbol) => symbol in quotes && !isExcludedLiveQuoteSymbol(symbol),
  );
  const remaining = Object.keys(quotes)
    .filter(
      (symbol) =>
        !isExcludedLiveQuoteSymbol(symbol) &&
        !LIVE_QUOTE_DISPLAY_ORDER.includes(
          symbol as (typeof LIVE_QUOTE_DISPLAY_ORDER)[number],
        ),
    )
    .sort();

  return [...ordered, ...remaining];
}
