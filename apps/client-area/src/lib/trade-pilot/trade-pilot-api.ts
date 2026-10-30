import "server-only";

import { randomUUID } from "node:crypto";
import { z } from "zod";

import { TRADE_PILOT_API_KEY, TRADE_PILOT_API_ROOT } from "@/lib/env";
import type { ClientAreaTradePilotTimeframePerformance } from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotPositionPlan,
  TradePilotPlanAccountType,
  TradePilotPlanRiskStyle,
  TradePilotAnalysisAvailability,
  TradePilotAnalysisRequest,
  TradePilotAnalysisResult,
  TradePilotCandleSnapshot,
  TradePilotCreditBalance,
  TradePilotFundamentalNews,
  TradePilotHistoryItem,
  TradePilotHistoryPage,
  TradePilotHistoryStatus,
  TradePilotIndicator,
  TradePilotIndicatorSnapshot,
  TradePilotInstrumentCatalog,
  TradePilotInstrumentId,
  TradePilotMode,
  TradePilotRequestContext,
  TradePilotTradingPlan,
  TradePilotTradingPlanInput,
} from "@/lib/trade-pilot/trade-pilot.types";

/*
 * Client HTTP server-only untuk backend SGB-TP `/v1/trade-pilot` (kontrak 27 Okt 2026).
 * Browser tidak pernah memanggil API ini dan tidak pernah melihat API key.
 * Referensi: SGB-TP docs/TRADE_PILOT_V1_API_REFERENCE.md & TRADE_PILOT_V1_OPENAPI.yaml.
 */

// ---------------------------------------------------------------------------
// Error
// ---------------------------------------------------------------------------

export type TradePilotUiStatus =
  | "invalid_request"
  | "access_denied"
  | "insufficient_credit"
  | "error";

export const TRADE_PILOT_UNAVAILABLE_MESSAGE =
  "Trade Pilot analysis is temporarily unavailable.";

export class TradePilotApiError extends Error {
  constructor(
    readonly httpStatus: number,
    readonly code: string,
    message: string,
    readonly requestId: string | null,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "TradePilotApiError";
  }

  get uiStatus(): TradePilotUiStatus {
    if (this.code === "insufficient_credit") return "insufficient_credit";
    if (this.httpStatus === 401 || this.httpStatus === 403) return "access_denied";
    if (this.httpStatus === 400 || this.httpStatus === 404 || this.httpStatus === 409) {
      return "invalid_request";
    }
    return "error"; // 429, 5xx, timeout
  }
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

type CallOptions = {
  body?: unknown;
  idempotencyKey?: string;
  method?: "GET" | "POST" | "PUT";
  query?: Record<string, string | number | undefined>;
  timeoutMs?: number;
};

const errorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional(),
  }),
});

function logTradePilotError(path: string, error: TradePilotApiError) {
  // Jangan pernah log email; requestId cukup untuk dilacak di log backend.
  // Satu string (bukan object) supaya tetap terbaca saat Next.js meneruskan log
  // server ke console browser.
  console.error(
    `[trade-pilot] request failed: ${path} -> HTTP ${error.httpStatus} ${error.code}` +
      ` (${error.message}) requestId=${error.requestId ?? "-"}`,
  );
}

/** Mengembalikan `null` untuk 204 No Content. */
async function tradePilotFetch(
  context: TradePilotRequestContext,
  path: string,
  options: CallOptions = {},
): Promise<unknown> {
  const requestId = `req_${randomUUID().replaceAll("-", "")}`;

  if (!TRADE_PILOT_API_ROOT || !TRADE_PILOT_API_KEY) {
    const error = new TradePilotApiError(
      500,
      "configuration_error",
      "Trade Pilot API configuration is incomplete.",
      requestId,
    );
    logTradePilotError(path, error);
    throw error;
  }

  const url = new URL(`${TRADE_PILOT_API_ROOT}${path}`);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": context.language ?? "id",
    Authorization: `Bearer ${TRADE_PILOT_API_KEY}`,
    "X-Allowed-Modes": context.allowedModes.join(","),
    "X-Request-Id": requestId,
    "X-TradePilot-User": context.userId,
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;

  let response: Response;
  try {
    response = await fetch(url, {
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: "no-store",
      headers,
      method: options.method ?? "GET",
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
    });
  } catch {
    const error = new TradePilotApiError(
      503,
      "upstream_unavailable",
      TRADE_PILOT_UNAVAILABLE_MESSAGE,
      requestId,
    );
    logTradePilotError(path, error);
    throw error;
  }

  if (response.status === 204) return null;
  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const payload = errorSchema.safeParse(json);
    const error = new TradePilotApiError(
      response.status,
      payload.success ? payload.data.error.code : "internal_error",
      payload.success ? payload.data.error.message : TRADE_PILOT_UNAVAILABLE_MESSAGE,
      (payload.success ? payload.data.error.requestId : undefined) ??
        response.headers.get("X-Request-Id") ??
        requestId,
      Number(response.headers.get("Retry-After")) || undefined,
    );
    logTradePilotError(path, error);
    throw error;
  }

  return json;
}

function parse<T extends z.ZodType>(schema: T, value: unknown, path: string): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const error = new TradePilotApiError(
      502,
      "invalid_response",
      TRADE_PILOT_UNAVAILABLE_MESSAGE,
      null,
    );
    logTradePilotError(path, error);
    throw error;
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// Schema (zod default membuang field yang tidak dikenal)
// ---------------------------------------------------------------------------

const modeSchema = z.enum(["demo", "real"]);
const instrumentIdSchema = z.enum(["gold", "brent", "hang-seng", "nikkei"]);
const timeframeSchema = z.enum(["1", "5", "15", "30", "60", "240", "D", "W", "M"]);
const statusSchema = z.enum([
  "still_valid",
  "take_profit_1",
  "take_profit_2",
  "stop_loss",
  "expired",
  "invalid",
]);
const levelsSchema = z.object({
  entry: z.string(),
  stopLoss: z.string(),
  takeProfitOne: z.string(),
  takeProfitTwo: z.string(),
});
const indicatorSchema = z.object({
  group: z.enum(["oscillator", "movingAverage", "moving_average"]),
  key: z.string().optional(),
  label: z.string(),
  marker: z.number().min(0).max(100),
  status: z.enum(["buy", "sell", "neutral"]),
  value: z.string(),
});
const creditSchema = z.object({
  allowance: z.number().int().nonnegative(),
  consumed: z.number().int().nonnegative(),
  mode: modeSchema,
  remaining: z.number().int().nonnegative(),
  resetsAt: z.string(),
});
const confidenceSchema = z.object({
  fundamental: z.string().nullable(),
  invalidation: z.array(z.string()),
  max: z.number().nullable(),
  min: z.number().nullable(),
  reason: z.string().nullable(),
  risk: z.string().nullable(),
  riskLevel: z.enum(["low", "medium", "high"]).nullable(),
  sources: z.object({
    calendar: z.array(z.object({ date: z.string().nullable(), name: z.string() })),
    news: z.array(z.string()),
  }),
  technical: z.string().nullable(),
});
const analysisSchema = z.object({
  analyzedAt: z.string(),
  // Opsional: backend lama belum mengirim; jangan gagalkan parsing bila bentuknya beda.
  confidence: confidenceSchema.nullable().optional().catch(null),
  buyLevels: levelsSchema,
  dataSnapshot: z
    .object({ asOf: z.string(), candleCount: z.number(), price: z.string() })
    .optional(),
  direction: z.enum(["bullish", "bearish", "neutral"]),
  disclaimer: z.string().optional(),
  id: z.string(),
  indicators: z.array(indicatorSchema),
  instrumentId: instrumentIdSchema,
  instrumentLabel: z.string(),
  marketContext: z
    .object({ description: z.string(), note: z.string(), title: z.string() })
    .optional(),
  marketSentiment: z.enum(["bullish", "bearish"]),
  mode: modeSchema,
  priceAtAnalysis: z.string().optional(),
  resolvedAt: z.string().nullable(),
  sellLevels: levelsSchema,
  status: statusSchema,
  timeframe: timeframeSchema,
  timeframeLabel: z.string(),
  validUntil: z.string(),
});
const historySchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  instrumentLabel: z.string(),
  mode: modeSchema,
  resolvedAt: z.string().nullable(),
  status: statusSchema,
  timeframeLabel: z.string(),
  // Ringkasan kartu riwayat; opsional untuk backend lama.
  activeSide: z.enum(["buy", "sell"]).nullable().optional().catch(null),
  buyLevels: levelsSchema.optional().catch(undefined),
  direction: z.enum(["bullish", "bearish", "neutral"]).optional().catch(undefined),
  instrumentId: z.string().optional().catch(undefined),
  priceAtAnalysis: z.string().optional().catch(undefined),
  sellLevels: levelsSchema.optional().catch(undefined),
  timeframe: z.string().optional().catch(undefined),
  validUntil: z.string().optional().catch(undefined),
});
const performanceSchema = z.object({
  completion: z.number().nullable(),
  expired: z.number().int().nonnegative(),
  minimumSamples: z.number().int().nonnegative().nullable(),
  sample: z.number().int().nonnegative(),
  stillValid: z.number().int().nonnegative(),
  stopLoss: z.number().int().nonnegative(),
  takeProfitOne: z.number().int().nonnegative(),
  takeProfitTwo: z.number().int().nonnegative(),
  timeframe: z.string(),
  winRate: z.number().nullable(),
});
const tradingPlanSchema = z.object({
  accountType: z.enum(["micro", "mini", "regular"]),
  analysisId: z.string(),
  createdAt: z.string(),
  id: z.string(),
  lossLimit: z.string(),
  mode: modeSchema,
  result: z.record(z.string(), z.unknown()).optional(),
  riskStyle: z.string(),
  tradingCapital: z.string(),
  variant: z.enum(["buy", "sell"]),
});
const contractSpecSchema = z.object({
  contractSize: z.number(),
  contractUnit: z.string(),
  lot: z.string(),
  margin: z.string(),
  marginCurrency: z.string(),
  marginSource: z.string(),
});

// ---------------------------------------------------------------------------
// Mapper ke tipe FE
// ---------------------------------------------------------------------------

function indicatorKey(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function toIndicator(value: z.infer<typeof indicatorSchema>): TradePilotIndicator {
  return {
    group: value.group === "oscillator" ? "oscillator" : "movingAverage",
    key: value.key ?? indicatorKey(value.label),
    label: value.label,
    marker: value.marker,
    status: value.status,
    value: value.value,
  };
}

function toCredit(value: z.infer<typeof creditSchema>): TradePilotCreditBalance {
  return { ...value, source: "api" };
}

function toAnalysis(value: z.infer<typeof analysisSchema>): TradePilotAnalysisResult {
  return {
    ...value,
    indicators: value.indicators.map(toIndicator),
    priceAtAnalysis: value.priceAtAnalysis ?? value.dataSnapshot?.price ?? "-",
    source: "api",
  };
}

function toHistory(value: z.infer<typeof historySchema>): TradePilotHistoryItem {
  return { ...value, source: "api" };
}

// ---------------------------------------------------------------------------
// P0
// ---------------------------------------------------------------------------

export type TradePilotApiBootstrap = {
  credits: Partial<Record<TradePilotMode, TradePilotCreditBalance>>;
  histories: Partial<Record<TradePilotMode, TradePilotHistoryItem[]>>;
  isNewUser: boolean;
  latestAnalyses: Partial<Record<TradePilotMode, TradePilotAnalysisResult>>;
  timeframePerformance: Partial<
    Record<TradePilotMode, ClientAreaTradePilotTimeframePerformance[]>
  >;
  analysisAvailability: TradePilotAnalysisAvailability | null;
};

const availabilitySchema = z.object({
  enabled: z.boolean(),
  modes: z.record(z.string(), z.boolean()).catch({}),
  instruments: z.record(z.string(), z.boolean()).catch({}),
  timeframes: z.record(z.string(), z.boolean()).catch({}),
  message: z.string().nullable().catch(null),
});

/** `GET /bootstrap` — satu call untuk semua mode; auto-provisioning user. */
export async function getApiTradePilotBootstrap(
  context: TradePilotRequestContext,
  modes: TradePilotMode[] = context.allowedModes,
): Promise<TradePilotApiBootstrap> {
  const path = "/bootstrap";
  const value = parse(
    z.object({
      credits: z.partialRecord(modeSchema, creditSchema),
      histories: z.partialRecord(modeSchema, z.array(historySchema)),
      isNewUser: z.boolean(),
      latestAnalyses: z.partialRecord(modeSchema, analysisSchema.nullable()),
      timeframePerformance: z.array(performanceSchema.extend({ mode: modeSchema })),
      // Opsional: backend sebelum fitur kill switch tidak mengirim field ini.
      analysisAvailability: availabilitySchema.nullable().optional().catch(null),
    }),
    await tradePilotFetch(context, path, { query: { modes: modes.join(",") } }),
    path,
  );

  const timeframePerformance: TradePilotApiBootstrap["timeframePerformance"] = {};
  for (const { mode, ...row } of value.timeframePerformance) {
    (timeframePerformance[mode] ??= []).push(row);
  }

  return {
    credits: Object.fromEntries(
      Object.entries(value.credits).map(([mode, credit]) => [mode, toCredit(credit)]),
    ),
    histories: Object.fromEntries(
      Object.entries(value.histories).map(([mode, items]) => [mode, items.map(toHistory)]),
    ),
    isNewUser: value.isNewUser,
    latestAnalyses: Object.fromEntries(
      Object.entries(value.latestAnalyses).flatMap(([mode, analysis]) =>
        analysis ? [[mode, toAnalysis(analysis)]] : [],
      ),
    ),
    timeframePerformance,
    analysisAvailability: value.analysisAvailability ?? null,
  };
}

/** `GET /credits?mode=` */
export async function getLiveTradePilotCredits(
  context: TradePilotRequestContext,
  mode: TradePilotMode,
) {
  const path = "/credits";
  return toCredit(parse(creditSchema, await tradePilotFetch(context, path, { query: { mode } }), path));
}

/**
 * `POST /analyses` — memotong 1 kredit. `idempotencyKey` WAJIB dibuat sekali per
 * klik di client component; retry dengan key yang sama tidak memotong kredit lagi.
 */
export async function runLiveTradePilotAnalysis(
  context: TradePilotRequestContext,
  input: Pick<TradePilotAnalysisRequest, "instrumentId" | "mode" | "timeframe">,
  idempotencyKey: string,
) {
  const path = "/analyses";
  const value = parse(
    z.object({ analysis: analysisSchema, credit: creditSchema, history: historySchema }),
    await tradePilotFetch(context, path, {
      body: { instrumentId: input.instrumentId, mode: input.mode, timeframe: input.timeframe },
      idempotencyKey,
      method: "POST",
      timeoutMs: 30_000,
    }),
    path,
  );

  return {
    analysis: toAnalysis(value.analysis),
    credit: toCredit(value.credit),
    history: toHistory(value.history),
  };
}

/** `GET /analyses/latest?mode=` — `null` bila belum ada (204). */
export async function getLiveTradePilotLatestAnalysis(
  context: TradePilotRequestContext,
  mode: TradePilotMode,
) {
  const path = "/analyses/latest";
  const value = await tradePilotFetch(context, path, { query: { mode } });
  return value === null ? null : toAnalysis(parse(analysisSchema, value, path));
}

/** `GET /histories?mode=` */
export async function getLiveTradePilotHistory(
  context: TradePilotRequestContext,
  mode: TradePilotMode,
  options: {
    cursor?: string;
    instrumentId?: TradePilotInstrumentId;
    limit?: number;
    status?: TradePilotHistoryStatus;
    timeframe?: TradePilotAnalysisRequest["timeframe"];
  } = {},
): Promise<TradePilotHistoryPage> {
  const path = "/histories";
  const value = parse(
    z.object({ items: z.array(historySchema), nextCursor: z.string().nullable() }),
    await tradePilotFetch(context, path, {
      query: { mode, ...options, limit: options.limit ?? 20 },
    }),
    path,
  );
  return { items: value.items.map(toHistory), nextCursor: value.nextCursor };
}

/** `GET /performance/timeframes?mode=` — agregat global per mode. */
export async function getLiveTradePilotPerformance(
  context: TradePilotRequestContext,
  mode: TradePilotMode,
  instrumentId?: TradePilotInstrumentId,
): Promise<ClientAreaTradePilotTimeframePerformance[]> {
  const path = "/performance/timeframes";
  return parse(
    z.array(performanceSchema),
    await tradePilotFetch(context, path, { query: { instrumentId, mode } }),
    path,
  );
}

// ---------------------------------------------------------------------------
// P1
// ---------------------------------------------------------------------------

/** `GET /analyses/{id}` — ID milik user lain dibalas 404. */
export async function getLiveTradePilotAnalysis(
  context: TradePilotRequestContext,
  analysisId: string,
) {
  const path = `/analyses/${encodeURIComponent(analysisId)}`;
  return toAnalysis(parse(analysisSchema, await tradePilotFetch(context, path), path));
}

/** `GET /analyses/{id}/indicators` — refresh panel indikator milik analisis. */
export async function getLiveTradePilotAnalysisIndicators(
  context: TradePilotRequestContext,
  analysisId: string,
) {
  const path = `/analyses/${encodeURIComponent(analysisId)}/indicators`;
  const value = parse(
    z.object({ analysisId: z.string(), calculatedAt: z.string(), items: z.array(indicatorSchema) }),
    await tradePilotFetch(context, path),
    path,
  );
  return { ...value, items: value.items.map(toIndicator) };
}

/** `GET /fundamental-news?instrumentId=&limit=` (maks 10). */
export async function getLiveTradePilotFundamentalNews(
  context: TradePilotRequestContext,
  instrumentId: TradePilotInstrumentId,
  limit = 5,
): Promise<TradePilotFundamentalNews> {
  const path = "/fundamental-news";
  return parse(
    z.object({
      instrumentId: instrumentIdSchema,
      items: z.array(
        z.object({
          id: z.string(),
          language: z.enum(["id", "en"]),
          publishedAt: z.string(),
          source: z.string(),
          title: z.string(),
          url: z.string(),
        }),
      ),
    }),
    await tradePilotFetch(context, path, { query: { instrumentId, limit } }),
    path,
  );
}

/** `GET /indicators?instrumentId=&timeframe=` — indikator live tanpa analisis (pendukung). */
export async function getLiveTradePilotIndicators(
  context: TradePilotRequestContext,
  instrumentId: TradePilotInstrumentId,
  timeframe: TradePilotAnalysisRequest["timeframe"],
): Promise<TradePilotIndicatorSnapshot> {
  const path = "/indicators";
  const value = parse(
    z.object({
      calculatedAt: z.string(),
      instrumentId: instrumentIdSchema,
      items: z.array(indicatorSchema),
      timeframe: timeframeSchema,
    }),
    await tradePilotFetch(context, path, { query: { instrumentId, timeframe } }),
    path,
  );
  return { ...value, items: value.items.map(toIndicator) };
}

/** `GET /candles?instrumentId=&timeframe=` — candle untuk chart level (pendukung). */
export async function getLiveTradePilotCandles(
  context: TradePilotRequestContext,
  instrumentId: TradePilotInstrumentId,
  timeframe: TradePilotAnalysisRequest["timeframe"],
): Promise<TradePilotCandleSnapshot> {
  const path = "/candles";
  return parse(
    z.object({
      candleTimeframe: z.string(),
      candles: z
        .array(
          z.object({
            close: z.number(),
            date: z.string(),
            high: z.number(),
            low: z.number(),
            open: z.number(),
          }),
        )
        .max(300),
      instrumentId: instrumentIdSchema,
      instrumentLabel: z.string(),
      isStale: z.boolean(),
      sourceFetchedAt: z.string(),
      sourceMaxAgeMs: z.number().int().nonnegative(),
      staleReason: z.enum(["source_age", "feed_unavailable"]).nullable(),
      timeframe: timeframeSchema,
      timeframeLabel: z.string(),
    }),
    await tradePilotFetch(context, path, { query: { instrumentId, timeframe } }),
    path,
  );
}

// ---------------------------------------------------------------------------
// P2
// ---------------------------------------------------------------------------

const nullableNumber = z.number().nullable();
const ladderLevelSchema = z.object({
  level: z.number(),
  price: z.number(),
  lot: z.number(),
  cumulativeLots: z.number(),
  estimatedRiskToStop: z.number(),
  riskToStopForLot: z.number(),
  dayMarginForLot: z.number(),
  profitToTakeProfit1: nullableNumber,
  profitToTakeProfit2: nullableNumber,
  cumulativeDayMargin: z.number(),
  cumulativeFundsAtStop: z.number(),
  remainingFundsAtStop: nullableNumber,
  cumulativeProfitToTakeProfit1: nullableNumber,
  cumulativeProfitToTakeProfit2: nullableNumber,
  basis: z.string(),
});
const sidePlanSchema = z.object({
  side: z.enum(["buy", "sell"]),
  entry: z.number(),
  stopLoss: z.number(),
  takeProfit1: nullableNumber,
  takeProfit2: nullableNumber,
  totalLots: z.number(),
  marginRequired: z.number(),
  estimatedCycleLoss: z.number(),
  weightedAverageEntry: z.number(),
  totalFundsAtStop: z.number(),
  remainingFundsAtStop: nullableNumber,
  profitToTakeProfit1: nullableNumber,
  profitToTakeProfit2: nullableNumber,
  riskRewardToTakeProfit1: nullableNumber,
  riskRewardToTakeProfit2: nullableNumber,
  ladder: z.array(ladderLevelSchema),
  rejectedLadder: z.array(
    ladderLevelSchema.extend({
      rejectReason: z.enum(["day_margin", "loss_ceiling", "tier_limit", "analysis_limit"]),
      financialAlternative: z
        .object({ additionalFundsRequired: z.number(), additionalLossBudgetRequired: z.number() })
        .nullable(),
    }),
  ),
});
const sideEvaluationSchema = z.object({
  status: z.enum(["viable", "blocked", "not_aligned", "unavailable"]),
  diagnostic: z
    .object({
      lot: z.number(),
      marginRequired: z.number(),
      riskAtStop: z.number(),
      fundsRequiredAtStop: z.number(),
      effectiveLossBudget: z.number(),
      marginShortfall: z.number(),
      riskShortfall: z.number(),
      blocker: z.enum(["margin", "risk", "margin_and_risk", "analysis", "direction"]),
      nextAction: z.enum(["funds", "loss_budget", "funds_and_loss_budget", "reanalysis", "wait"]),
    })
    .nullable(),
  conditionalPlan: sidePlanSchema.nullable().optional().transform((value) => value ?? null),
});
const positionPlanSchema = z.object({
  analysisId: z.string(),
  accountType: z.enum(["micro", "mini", "regular"]),
  riskStyle: z.enum(["conservative", "balanced", "aggressive"]),
  rulesVersion: z.string(),
  valid: z.boolean(),
  errors: z.array(z.string()),
  decision: z.object({
    posture: z.enum(["scaling_allowed", "entry_only", "not_recommended"]),
    preferredSide: z.enum(["buy", "sell", "both", "none"]),
    reasonCodes: z.array(z.string()),
  }),
  recommendation: z
    .object({
      initialLot: z.number(),
      usableRiskBudget: z.number(),
      riskUtilizationRate: z.number(),
      maximumLoss: z.number(),
      marginBudget: z.number(),
    })
    .nullable(),
  rule: z
    .object({
      contractSize: z.number(),
      contractUnit: z.string(),
      marginPerLot: z.number(),
      minimumLot: z.number(),
      maximumLot: nullableNumber,
      lotStep: z.number(),
    })
    .nullable(),
  buy: sidePlanSchema.nullable(),
  sell: sidePlanSchema.nullable(),
  sideEvaluations: z.object({ buy: sideEvaluationSchema, sell: sideEvaluationSchema }),
});

/**
 * `POST /analyses/{id}/position-plan` — Adaptive Position Plan. Tidak memotong
 * kredit; seluruh angka uang dihitung backend dari aturan trading broker.
 */
export async function getLiveTradePilotPositionPlan(
  context: TradePilotRequestContext,
  analysisId: string,
  input: {
    accountType: TradePilotPlanAccountType;
    lossLimit: number;
    riskStyle: TradePilotPlanRiskStyle;
    tradingCapital: number;
  },
): Promise<TradePilotPositionPlan> {
  const path = `/analyses/${encodeURIComponent(analysisId)}/position-plan`;
  return parse(
    positionPlanSchema,
    await tradePilotFetch(context, path, { body: input, method: "POST" }),
    path,
  );
}

/** `POST /trading-plans` — kalkulasi tetap di FE; backend hanya menyimpan. */
export async function createLiveTradePilotTradingPlan(
  context: TradePilotRequestContext,
  input: TradePilotTradingPlanInput,
): Promise<TradePilotTradingPlan> {
  const path = "/trading-plans";
  return parse(
    tradingPlanSchema,
    await tradePilotFetch(context, path, { body: input, method: "POST" }),
    path,
  );
}

/** `GET /trading-plans?analysisId=` */
export async function listLiveTradePilotTradingPlans(
  context: TradePilotRequestContext,
  analysisId: string,
): Promise<TradePilotTradingPlan[]> {
  const path = "/trading-plans";
  return parse(
    z.object({ items: z.array(tradingPlanSchema) }),
    await tradePilotFetch(context, path, { query: { analysisId } }),
    path,
  ).items;
}

/**
 * `GET /instruments` — margin Micro/Regular masih hasil skala contract size
 * (`marginSource: "derived_from_contract_size"`); konfirmasi tim produk sebelum
 * menggantikan konstanta `ACCOUNT_VALUES`.
 */
export async function getLiveTradePilotInstruments(
  context: TradePilotRequestContext,
): Promise<TradePilotInstrumentCatalog> {
  const path = "/instruments";
  return parse(
    z.object({
      items: z.array(
        z.object({
          contractSpecs: z.partialRecord(z.enum(["micro", "mini", "regular"]), contractSpecSchema),
          id: instrumentIdSchema,
          label: z.string(),
          quoteSymbols: z.array(z.string()),
          timeframes: z.array(z.object({ label: z.string(), value: z.string() })),
          tradingViewSymbol: z.string(),
        }),
      ),
      rulesVersion: z.string(),
    }),
    await tradePilotFetch(context, path),
    path,
  );
}
