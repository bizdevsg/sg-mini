import { QUOTE_ORDER } from "@/lib/live-quotes";

export type ClientAreaTradingViewSymbolKey = (typeof QUOTE_ORDER)[number];

export type ClientAreaTradingViewPreset = {
  id: string;
  label: string;
  marketCode: ClientAreaTradingViewSymbolKey;
  symbol: string;
};

export const FALLBACK_CLIENT_AREA_TRADING_VIEW_SYMBOL_BY_MARKET_CODE: Record<
  ClientAreaTradingViewSymbolKey,
  string
> = {
  XUL10: "OANDA:XAUUSD",
  BCO10_BBJ: "VELOCITY:BRENT",
  HKK50_BBJ: "VANTAGE:HK50",
  JPK50_BBJ: "SPREADEX:NIKKEI",
  DX1010_BBJ: "CAPITALCOM:DXY",
  AU1010_BBJ: "OANDA:AUDUSD",
  EU1010_BBJ: "OANDA:EURUSD",
  GU1010_BBJ: "OANDA:GBPUSD",
  UC1010_BBJ: "OANDA:USDCAD",
  UJ1010_BBJ: "OANDA:USDJPY",
  UI1010_BBJ: "FX_IDC:USDIDR",
};

export const FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS: ClientAreaTradingViewPreset[] =
  QUOTE_ORDER.map((marketCode) => ({
    id: marketCode.toLowerCase(),
    label: marketCode,
    marketCode,
    symbol:
      FALLBACK_CLIENT_AREA_TRADING_VIEW_SYMBOL_BY_MARKET_CODE[marketCode],
  }));

export function getClientAreaTradingViewPresets(
  presets: ClientAreaTradingViewPreset[] = FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS,
) {
  return presets;
}

export function getClientAreaTradingViewPresetById(
  presetId: string,
  presets: ClientAreaTradingViewPreset[] = FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS,
) {
  return presets.find((preset) => preset.id === presetId);
}

export function getClientAreaTradingViewPresetByMarketCode(
  marketCode: string,
  presets: ClientAreaTradingViewPreset[] = FALLBACK_CLIENT_AREA_TRADING_VIEW_PRESETS,
) {
  return presets.find((preset) => preset.marketCode === marketCode);
}
