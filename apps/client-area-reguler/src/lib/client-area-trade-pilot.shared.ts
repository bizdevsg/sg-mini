import type { LiveQuotePayload, LiveQuoteTick } from "@/lib/live-quotes";
import type { AppMessages } from "@/locales";

export type ClientAreaTradePilotCopy =
  AppMessages["clientArea"]["tradePilotPage"]["analysis"];

export type ClientAreaTradePilotPerformanceHistoryCopy =
  AppMessages["clientArea"]["tradePilotPage"]["performanceHistory"];

export type ClientAreaTradePilotAnalysisResultCopy =
  ClientAreaTradePilotCopy["analysisResult"];

export type ClientAreaTradePilotTechnicalIndicatorsCopy =
  ClientAreaTradePilotCopy["technicalIndicators"];

export type ClientAreaTradePilotFooterCopy =
  ClientAreaTradePilotCopy["footer"];

export const CLIENT_AREA_TRADE_PILOT_APP_LINKS = {
  googlePlay:
    "https://play.google.com/store/apps/details?id=id.tradepilot.app&pcampaignid=web_share",
  appStore: "https://apps.apple.com/id/app/tradepilot-id/id6807276937",
} as const;

export type ClientAreaTradePilotFundamentalContextCopy =
  ClientAreaTradePilotCopy["fundamentalContext"];

export type ClientAreaTradePilotMarketContextSummaryCopy =
  ClientAreaTradePilotCopy["marketContextSummary"];

export type ClientAreaTradePilotTradingPlanCopy =
  ClientAreaTradePilotCopy["tradingPlan"];

export type ClientAreaTradePilotMarketSentiment = "bullish" | "bearish";

export type ClientAreaTradePilotInstrument = {
  id: "gold" | "brent" | "hang-seng" | "nikkei";
  label: string;
  nameKey: keyof ClientAreaTradePilotCopy["instrumentNames"];
  quoteSymbols: string[];
  tradingViewSymbol: string;
};

export type ClientAreaTradePilotTimeframe =
  | "1"
  | "5"
  | "15"
  | "30"
  | "60"
  | "240"
  | "D"
  | "W"
  | "M";

export type ClientAreaTradePilotScenarioLevels = {
  entry: string;
  stopLoss: string;
  takeProfitOne: string;
  takeProfitTwo: string;
};

export type ClientAreaTradePilotTimeframePerformance = {
  completion: number | null;
  expired: number;
  minimumSamples: number | null;
  sample: number;
  stillValid: number;
  stopLoss: number;
  takeProfitOne: number;
  takeProfitTwo: number;
  timeframe: string;
  winRate: number | null;
};

export const CLIENT_AREA_TRADE_PILOT_INSTRUMENTS: ClientAreaTradePilotInstrument[] =
  [
    {
      id: "gold",
      label: "XAU/USD",
      nameKey: "gold",
      quoteSymbols: ["XUL10", "XUL10_BBJ", "XAUUSD"],
      tradingViewSymbol: "OANDA:XAUUSD",
    },
    {
      id: "brent",
      label: "BCO",
      nameKey: "brent",
      quoteSymbols: ["BCO10_BBJ", "BCO"],
      tradingViewSymbol: "VELOCITY:BRENT",
    },
    {
      id: "hang-seng",
      label: "HKK",
      nameKey: "hangSeng",
      quoteSymbols: ["HKK50_BBJ", "HKK"],
      tradingViewSymbol: "VANTAGE:HK50",
    },
    {
      id: "nikkei",
      label: "JPK",
      nameKey: "nikkei",
      quoteSymbols: ["JPK50_BBJ", "JPK"],
      tradingViewSymbol: "SPREADEX:NIKKEI",
    },
  ];

export const CLIENT_AREA_TRADE_PILOT_TIMEFRAMES: Array<{
  label: string;
  value: ClientAreaTradePilotTimeframe;
}> = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "30m", value: "30" },
  { label: "1h", value: "60" },
  { label: "4h", value: "240" },
  { label: "D", value: "D" },
  { label: "W", value: "W" },
  { label: "M", value: "M" },
];

export function findClientAreaTradePilotTick(
  quotes: LiveQuotePayload,
  instrument: ClientAreaTradePilotInstrument,
): { symbol: string; tick?: LiveQuoteTick } {
  for (const symbol of instrument.quoteSymbols) {
    if (quotes[symbol]) {
      return { symbol, tick: quotes[symbol] };
    }
  }

  return { symbol: instrument.quoteSymbols[0], tick: undefined };
}

export function getClientAreaTradePilotPriceMovement(tick?: LiveQuoteTick) {
  if (!tick) {
    return { change: null, percentage: null };
  }

  const price = Number.parseFloat(tick.price || tick.buy || tick.sell);
  const open = Number.parseFloat(tick.oprice);

  if (!Number.isFinite(price) || !Number.isFinite(open) || open === 0) {
    return { change: null, percentage: null };
  }

  const change = price - open;
  return { change, percentage: (change / open) * 100 };
}
