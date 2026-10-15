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

export type ClientAreaTradePilotPriceAlertCopy =
  ClientAreaTradePilotCopy["priceAlert"];

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

export const STATIC_CLIENT_AREA_TRADE_PILOT_TIMEFRAME_PERFORMANCE: ClientAreaTradePilotTimeframePerformance[] =
  [
    {
      timeframe: "1h",
      sample: 42,
      stillValid: 1,
      expired: 0,
      stopLoss: 7,
      takeProfitOne: 0,
      takeProfitTwo: 3,
      winRate: 30,
      completion: 30,
      minimumSamples: null,
    },
    {
      timeframe: "1D",
      sample: 5,
      stillValid: 0,
      expired: 5,
      stopLoss: 0,
      takeProfitOne: 0,
      takeProfitTwo: 0,
      winRate: null,
      completion: null,
      minimumSamples: 5,
    },
    {
      timeframe: "15m",
      sample: 4,
      stillValid: 0,
      expired: 0,
      stopLoss: 2,
      takeProfitOne: 0,
      takeProfitTwo: 1,
      winRate: null,
      completion: null,
      minimumSamples: 6,
    },
    {
      timeframe: "1m",
      sample: 2,
      stillValid: 0,
      expired: 0,
      stopLoss: 0,
      takeProfitOne: 0,
      takeProfitTwo: 0,
      winRate: null,
      completion: null,
      minimumSamples: 8,
    },
    {
      timeframe: "4h",
      sample: 2,
      stillValid: 0,
      expired: 0,
      stopLoss: 1,
      takeProfitOne: 0,
      takeProfitTwo: 0,
      winRate: null,
      completion: null,
      minimumSamples: 8,
    },
    {
      timeframe: "5m",
      sample: 1,
      stillValid: 0,
      expired: 0,
      stopLoss: 0,
      takeProfitOne: 0,
      takeProfitTwo: 0,
      winRate: null,
      completion: null,
      minimumSamples: 9,
    },
    {
      timeframe: "30m",
      sample: 1,
      stillValid: 0,
      expired: 0,
      stopLoss: 0,
      takeProfitOne: 1,
      takeProfitTwo: 0,
      winRate: null,
      completion: null,
      minimumSamples: 9,
    },
    {
      timeframe: "1W",
      sample: 1,
      stillValid: 0,
      expired: 0,
      stopLoss: 1,
      takeProfitOne: 0,
      takeProfitTwo: 0,
      winRate: null,
      completion: null,
      minimumSamples: 9,
    },
  ];

type ClientAreaTradePilotStaticAnalysis = {
  instrumentLabel: string;
  timeframe: ClientAreaTradePilotTimeframe;
  timeframeLabel: string;
  direction: "bullish" | "bearish" | "neutral";
  quotePrice: string;
  quotePercentage: number;
  chartPrice: string;
  chartPercentage: number;
  analyzedAt: string;
  updatedAt: string;
  buyLevels: ClientAreaTradePilotScenarioLevels;
  sellLevels: ClientAreaTradePilotScenarioLevels;
  marketSentiment: ClientAreaTradePilotMarketSentiment;
};

export const STATIC_CLIENT_AREA_TRADE_PILOT_ANALYSIS: ClientAreaTradePilotStaticAnalysis = {
  instrumentLabel: "XAU/USD",
  timeframe: "60",
  timeframeLabel: "1h",
  direction: "neutral" as const,
  quotePrice: "4162.35",
  quotePercentage: 0.19,
  chartPrice: "4162.35",
  chartPercentage: 0.19,
  analyzedAt: "7 Okt 2026, 10:01",
  updatedAt: "10.01.42 WIB",
  buyLevels: {
    entry: "4172.00",
    stopLoss: "4152.00",
    takeProfitOne: "4192.00",
    takeProfitTwo: "4212.00",
  },
  sellLevels: {
    entry: "4148.00",
    stopLoss: "4168.00",
    takeProfitOne: "4128.00",
    takeProfitTwo: "4108.00",
  },
  marketSentiment: "bearish",
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
