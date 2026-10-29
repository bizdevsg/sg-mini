import type {
  ClientAreaTradePilotMarketSentiment,
  ClientAreaTradePilotScenarioLevels,
  ClientAreaTradePilotTimeframe,
  ClientAreaTradePilotTimeframePerformance,
} from "@/lib/client-area-trade-pilot.shared";

export type TradePilotMode = "demo" | "real";
export type TradePilotDataSource = "api" | "mock";
export type TradePilotInstrumentId = "gold" | "brent" | "hang-seng" | "nikkei";
export type TradePilotIndicatorStatus = "buy" | "neutral" | "sell";
export type TradePilotIndicatorGroup = "oscillator" | "movingAverage";

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
  resetsAt: string;
  source: TradePilotDataSource;
};

export type TradePilotAnalysisRequest = {
  instrumentId: TradePilotInstrumentId;
  instrumentLabel: string;
  mode: TradePilotMode;
  timeframe: ClientAreaTradePilotTimeframe;
};

export type TradePilotIndicator = {
  group: TradePilotIndicatorGroup;
  /** Tidak dikirim oleh API v1; diisi dari label saat parsing. */
  key: string;
  label: string;
  marker: number;
  status: TradePilotIndicatorStatus;
  value: string;
};

export type TradePilotDataSnapshot = {
  asOf: string;
  candleCount: number;
  price: string;
};

export type TradePilotMarketContext = {
  description: string;
  note: string;
  title: string;
};

/** Penjelasan keyakinan dari output AI (modal "Kenapa keyakinan tidak lebih tinggi?"). */
export type TradePilotConfidence = {
  fundamental: string | null;
  invalidation: string[];
  max: number | null;
  min: number | null;
  reason: string | null;
  risk: string | null;
  riskLevel: "low" | "medium" | "high" | null;
  sources: {
    calendar: Array<{ date: string | null; name: string }>;
    news: string[];
  };
  technical: string | null;
};

export type TradePilotAnalysisResult = {
  analyzedAt: string;
  /** Null/undefined untuk data mock atau analisis lama tanpa audit AI. */
  confidence?: TradePilotConfidence | null;
  /** Wajib ditampilkan di setiap hasil analisis; sudah mengikuti Accept-Language. */
  disclaimer?: string;
  dataSnapshot?: TradePilotDataSnapshot;
  marketContext?: TradePilotMarketContext;
  buyLevels: ClientAreaTradePilotScenarioLevels;
  direction: "bullish" | "bearish" | "neutral";
  id: string;
  indicators: TradePilotIndicator[];
  instrumentId: TradePilotInstrumentId;
  instrumentLabel: string;
  marketSentiment: ClientAreaTradePilotMarketSentiment;
  mode: TradePilotMode;
  priceAtAnalysis: string;
  resolvedAt: string | null;
  sellLevels: ClientAreaTradePilotScenarioLevels;
  source: TradePilotDataSource;
  timeframe: ClientAreaTradePilotTimeframe;
  timeframeLabel: string;
  validUntil: string;
  status: TradePilotHistoryStatus;
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
  resolvedAt: string | null;
  source: TradePilotDataSource;
  status: TradePilotHistoryStatus;
  timeframeLabel: string;
};

/** Kill switch analisis dari konsol admin TradePilot (GET /bootstrap). */
export type TradePilotAnalysisAvailability = {
  enabled: boolean;
  modes: Partial<Record<TradePilotMode, boolean>>;
  instruments: Partial<Record<string, boolean>>;
  timeframes: Partial<Record<string, boolean>>;
  /** Pesan admin untuk nasabah (sudah sesuai bahasa), atau null. */
  message: string | null;
};

export type TradePilotBootstrap = {
  access: TradePilotAccessContext;
  /** true hanya di bootstrap pertama user: tampilkan onboarding/disclaimer. */
  isNewUser: boolean;
  credits: Partial<Record<TradePilotMode, TradePilotCreditBalance>>;
  histories: Partial<Record<TradePilotMode, TradePilotHistoryItem[]>>;
  latestAnalyses: Partial<Record<TradePilotMode, TradePilotAnalysisResult>>;
  source: TradePilotDataSource;
  timeframePerformance: Partial<
    Record<TradePilotMode, ClientAreaTradePilotTimeframePerformance[]>
  >;
  /** true bila backend TradePilot tidak bisa dihubungi saat bootstrap. */
  unavailable: boolean;
  /** null = backend lama / mock: anggap semua analisis aktif. */
  analysisAvailability: TradePilotAnalysisAvailability | null;
};

export type TradePilotFundamentalNewsItem = {
  id: string;
  language: "id" | "en";
  publishedAt: string;
  source: string;
  title: string;
  url: string;
};

export type TradePilotFundamentalNews = {
  instrumentId: TradePilotInstrumentId;
  items: TradePilotFundamentalNewsItem[];
};

export type TradePilotAccountType = "micro" | "mini" | "regular";

// ---------------------------------------------------------------------------
// Adaptive Position Plan (POST /analyses/{id}/position-plan)
// Lot, margin, risiko, dan profit dihitung backend dari aturan trading broker.
// ---------------------------------------------------------------------------

export type TradePilotPlanAccountType = "micro" | "mini" | "regular";
export type TradePilotPlanRiskStyle = "conservative" | "balanced" | "aggressive";
export type TradePilotPlanPosture = "scaling_allowed" | "entry_only" | "not_recommended";
export type TradePilotPlanSide = "buy" | "sell";

export type TradePilotPlanLadderLevel = {
  level: number;
  price: number;
  lot: number;
  cumulativeLots: number;
  estimatedRiskToStop: number;
  riskToStopForLot: number;
  dayMarginForLot: number;
  profitToTakeProfit1: number | null;
  profitToTakeProfit2: number | null;
  cumulativeDayMargin: number;
  cumulativeFundsAtStop: number;
  remainingFundsAtStop: number | null;
  cumulativeProfitToTakeProfit1: number | null;
  cumulativeProfitToTakeProfit2: number | null;
  basis: string;
};

export type TradePilotPlanRejectedLevel = TradePilotPlanLadderLevel & {
  rejectReason: "day_margin" | "loss_ceiling" | "tier_limit" | "analysis_limit";
  financialAlternative: {
    additionalFundsRequired: number;
    additionalLossBudgetRequired: number;
  } | null;
};

export type TradePilotSidePositionPlan = {
  side: TradePilotPlanSide;
  entry: number;
  stopLoss: number;
  takeProfit1: number | null;
  takeProfit2: number | null;
  totalLots: number;
  marginRequired: number;
  estimatedCycleLoss: number;
  weightedAverageEntry: number;
  totalFundsAtStop: number;
  remainingFundsAtStop: number | null;
  profitToTakeProfit1: number | null;
  profitToTakeProfit2: number | null;
  riskRewardToTakeProfit1: number | null;
  riskRewardToTakeProfit2: number | null;
  ladder: TradePilotPlanLadderLevel[];
  rejectedLadder: TradePilotPlanRejectedLevel[];
};

export type TradePilotMinimumLotDiagnostic = {
  lot: number;
  marginRequired: number;
  riskAtStop: number;
  fundsRequiredAtStop: number;
  effectiveLossBudget: number;
  marginShortfall: number;
  riskShortfall: number;
  blocker: "margin" | "risk" | "margin_and_risk" | "analysis" | "direction";
  nextAction: "funds" | "loss_budget" | "funds_and_loss_budget" | "reanalysis" | "wait";
};

export type TradePilotSideEvaluation = {
  status: "viable" | "blocked" | "not_aligned" | "unavailable";
  diagnostic: TradePilotMinimumLotDiagnostic | null;
  conditionalPlan: TradePilotSidePositionPlan | null;
};

export type TradePilotPositionPlan = {
  analysisId: string;
  accountType: TradePilotPlanAccountType;
  riskStyle: TradePilotPlanRiskStyle;
  rulesVersion: string;
  valid: boolean;
  errors: string[];
  decision: {
    posture: TradePilotPlanPosture;
    preferredSide: "buy" | "sell" | "both" | "none";
    reasonCodes: string[];
  };
  recommendation: {
    initialLot: number;
    usableRiskBudget: number;
    riskUtilizationRate: number;
    maximumLoss: number;
    marginBudget: number;
  } | null;
  rule: {
    contractSize: number;
    contractUnit: string;
    marginPerLot: number;
    minimumLot: number;
    maximumLot: number | null;
    lotStep: number;
  } | null;
  buy: TradePilotSidePositionPlan | null;
  sell: TradePilotSidePositionPlan | null;
  sideEvaluations: Record<TradePilotPlanSide, TradePilotSideEvaluation>;
};

export type TradePilotTradingPlanInput = {
  accountType: TradePilotAccountType;
  analysisId: string;
  lossLimit: string;
  result?: Record<string, unknown>;
  riskStyle: string;
  tradingCapital: string;
  variant: "buy" | "sell";
};

export type TradePilotTradingPlan = TradePilotTradingPlanInput & {
  createdAt: string;
  id: string;
  mode: TradePilotMode;
};

export type TradePilotContractSpec = {
  contractSize: number;
  contractUnit: string;
  lot: string;
  margin: string;
  marginCurrency: string;
  marginSource: "broker_document" | "derived_from_contract_size" | string;
};

export type TradePilotInstrumentInfo = {
  contractSpecs: Partial<Record<TradePilotAccountType, TradePilotContractSpec>>;
  id: TradePilotInstrumentId;
  label: string;
  quoteSymbols: string[];
  timeframes: Array<{ label: string; value: string }>;
  tradingViewSymbol: string;
};

export type TradePilotInstrumentCatalog = {
  items: TradePilotInstrumentInfo[];
  rulesVersion: string;
};

export type TradePilotIndicatorSnapshot = {
  calculatedAt: string;
  instrumentId: TradePilotInstrumentId;
  items: TradePilotIndicator[];
  timeframe: TradePilotAnalysisRequest["timeframe"];
};

export type TradePilotCandle = {
  close: number;
  date: string;
  high: number;
  low: number;
  open: number;
};

export type TradePilotCandleSnapshot = {
  candleTimeframe: string;
  candles: TradePilotCandle[];
  instrumentId: TradePilotInstrumentId;
  instrumentLabel: string;
  isStale: boolean;
  sourceFetchedAt: string;
  sourceMaxAgeMs: number;
  staleReason: "source_age" | "feed_unavailable" | null;
  timeframe: TradePilotAnalysisRequest["timeframe"];
  timeframeLabel: string;
};

export type TradePilotRequestContext = {
  allowedModes: TradePilotMode[];
  language?: "id" | "en";
  /** HMAC hex 64 karakter, dikirim sebagai X-TradePilot-User. */
  userId: string;
};

export type TradePilotHistoryPage = {
  items: TradePilotHistoryItem[];
  nextCursor: string | null;
};

export type TradePilotAnalysisActionResult =
  | {
      analysis: TradePilotAnalysisResult;
      credit: TradePilotCreditBalance;
      history: TradePilotHistoryItem;
      status: "success";
    }
  | { resetsAt: string | null; status: "insufficient_credit" }
  | { retryAfterSeconds: number | null; status: "rate_limited" }
  /** Analisis dijeda admin (kill switch); message dari backend sudah terlokalisasi. */
  | { message: string; status: "analysis_paused" }
  | {
      status:
        | "access_denied"
        | "analysis_unavailable"
        | "invalid_request";
    }
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
