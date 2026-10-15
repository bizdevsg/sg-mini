import type {
  ClientAreaTradePilotMarketSentiment,
  ClientAreaTradePilotScenarioLevels,
  ClientAreaTradePilotTimeframe,
  ClientAreaTradePilotTimeframePerformance,
} from "@/lib/client-area-trade-pilot.shared";

export type TradePilotMode = "demo" | "real";
export type TradePilotDataSource = "mock";

export type TradePilotAccessReason =
  | "allowed"
  | "unauthenticated"
  | "trading_account_required"
  | "invalid_account_data";

export type TradePilotAccessContext = {
  allowed: boolean;
  authenticated: boolean;
  availableModes: TradePilotMode[];
  hasDemoAccount: boolean;
  hasRealAccount: boolean;
  reason: TradePilotAccessReason;
  userId: string | null;
};

export type TradePilotCreditBalance = {
  allowance: number;
  consumed: number;
  mode: TradePilotMode;
  remaining: number;
  source: TradePilotDataSource;
};

export type TradePilotAnalysisRequest = {
  instrumentId: "gold" | "brent" | "hang-seng" | "nikkei";
  instrumentLabel: string;
  mode: TradePilotMode;
  timeframe: ClientAreaTradePilotTimeframe;
};

export type TradePilotAnalysisResult = {
  analyzedAt: string;
  buyLevels: ClientAreaTradePilotScenarioLevels;
  direction: "bullish" | "bearish" | "neutral";
  id: string;
  instrumentLabel: string;
  marketSentiment: ClientAreaTradePilotMarketSentiment;
  mode: TradePilotMode;
  sellLevels: ClientAreaTradePilotScenarioLevels;
  source: TradePilotDataSource;
  timeframe: ClientAreaTradePilotTimeframe;
  timeframeLabel: string;
};

export type TradePilotHistoryStatus =
  | "still_valid"
  | "expired"
  | "stop_loss"
  | "take_profit_1"
  | "take_profit_2"
  | "invalid";

export type TradePilotHistoryItem = {
  createdAt: string;
  id: string;
  instrumentLabel: string;
  mode: TradePilotMode;
  source: TradePilotDataSource;
  status: TradePilotHistoryStatus;
  timeframeLabel: string;
};

export type TradePilotBootstrap = {
  access: TradePilotAccessContext;
  credits: Partial<Record<TradePilotMode, TradePilotCreditBalance>>;
  histories: Partial<Record<TradePilotMode, TradePilotHistoryItem[]>>;
  latestAnalyses: Partial<Record<TradePilotMode, TradePilotAnalysisResult>>;
  source: TradePilotDataSource;
  timeframePerformance: ClientAreaTradePilotTimeframePerformance[];
};

export type TradePilotAnalysisActionResult =
  | {
      analysis: TradePilotAnalysisResult;
      credit: TradePilotCreditBalance;
      history: TradePilotHistoryItem;
      status: "success";
    }
  | { status: "access_denied" | "insufficient_credit" | "invalid_request" }
  | { message: string; status: "error" };

export interface TradePilotCreditService {
  getBalance(userId: string, mode: TradePilotMode): Promise<TradePilotCreditBalance>;
  consumeCredit(
    userId: string,
    mode: TradePilotMode,
    amount: number,
    idempotencyKey: string,
  ): Promise<TradePilotCreditBalance | "insufficient_credit">;
}

export interface TradePilotAnalysisService {
  getLatest(userId: string, mode: TradePilotMode): Promise<TradePilotAnalysisResult | undefined>;
  run(
    userId: string,
    request: TradePilotAnalysisRequest,
    idempotencyKey: string,
  ): Promise<
    | "insufficient_credit"
    | null
    | {
        analysis: TradePilotAnalysisResult;
        credit: TradePilotCreditBalance;
        history: TradePilotHistoryItem;
      }
  >;
}

export interface TradePilotHistoryService {
  get(userId: string, analysisId: string): Promise<TradePilotHistoryItem | null>;
  list(userId: string, mode: TradePilotMode): Promise<TradePilotHistoryItem[]>;
}
