import "server-only";

import { cache } from "react";

import {
  FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS,
  type ClientAreaTradingViewPreset,
  type ClientAreaTradingViewSymbolKey,
} from "@/lib/client-area-tradingview.shared";
import { QUOTE_ORDER, getLiveQuoteDisplay } from "@/lib/live-quotes";
import { TRADINGVIEW_SYMBOL_API_URL } from "@/lib/env";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";

type TradingViewSymbolApiRecord = {
  id?: number;
  name?: string | null;
  symbol_ws?: string | null;
  symbol_tv?: string | null;
};

type TradingViewSymbolApiResponse = {
  data?: TradingViewSymbolApiRecord[];
};

const TRADINGVIEW_SYMBOL_REVALIDATE_SECONDS = 300;
const TRADINGVIEW_SYMBOL_TIMEOUT_MS = 8000;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isTradingViewSymbolKey(
  value: string,
): value is ClientAreaTradingViewSymbolKey {
  return QUOTE_ORDER.includes(value as ClientAreaTradingViewSymbolKey);
}

function mapTradingViewPreset(
  item: TradingViewSymbolApiRecord,
): ClientAreaTradingViewPreset | null {
  const marketCode = normalizeText(item.symbol_ws);
  const symbol = normalizeText(item.symbol_tv);

  if (!isTradingViewSymbolKey(marketCode) || !symbol) {
    return null;
  }

  return {
    id: marketCode.toLowerCase(),
    label:
      normalizeText(item.name) || getLiveQuoteDisplay(marketCode).label || marketCode,
    marketCode,
    symbol,
  };
}

function mergeTradingViewPresets(apiPresets: ClientAreaTradingViewPreset[]) {
  const presetMap = new Map(
    apiPresets.map((preset) => [preset.marketCode, preset] as const),
  );

  return FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS.map(
    (fallbackPreset) => presetMap.get(fallbackPreset.marketCode) ?? fallbackPreset,
  );
}

async function fetchTradingViewPresets() {
  if (!TRADINGVIEW_SYMBOL_API_URL) {
    return FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS;
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    TRADINGVIEW_SYMBOL_TIMEOUT_MS,
  );

  try {
    const response = await fetch(TRADINGVIEW_SYMBOL_API_URL, {
      next: {
        revalidate: TRADINGVIEW_SYMBOL_REVALIDATE_SECONDS,
      },
      headers: await getSgAdminApiHeaders(),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch tradingview symbols: ${response.status} ${response.statusText}`,
      );
      return FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS;
    }

    const payload = (await response.json()) as TradingViewSymbolApiResponse;
    const apiPresets = Array.isArray(payload?.data)
      ? payload.data
          .map(mapTradingViewPreset)
          .filter((preset): preset is ClientAreaTradingViewPreset => preset !== null)
      : [];

    if (apiPresets.length === 0) {
      return FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS;
    }

    return mergeTradingViewPresets(apiPresets);
  } catch (error) {
    console.error("Failed to fetch tradingview presets", error);
    return FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchTradingViewApiPresets() {
  if (!TRADINGVIEW_SYMBOL_API_URL) {
    return [] as ClientAreaTradingViewPreset[];
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    TRADINGVIEW_SYMBOL_TIMEOUT_MS,
  );

  try {
    const response = await fetch(TRADINGVIEW_SYMBOL_API_URL, {
      next: {
        revalidate: TRADINGVIEW_SYMBOL_REVALIDATE_SECONDS,
      },
      headers: await getSgAdminApiHeaders(),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch tradingview symbols: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const payload = (await response.json()) as TradingViewSymbolApiResponse;

    return Array.isArray(payload?.data)
      ? payload.data
          .map(mapTradingViewPreset)
          .filter((preset): preset is ClientAreaTradingViewPreset => preset !== null)
      : [];
  } catch (error) {
    console.error("Failed to fetch tradingview API presets", error);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export const getTradingViewPresets = cache(async function getTradingViewPresets() {
  return fetchTradingViewPresets();
});

export const getTradingViewApiPresets = cache(async function getTradingViewApiPresets() {
  return fetchTradingViewApiPresets();
});
