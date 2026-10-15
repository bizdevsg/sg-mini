import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { EncryptJWT, jwtDecrypt } from "jose";

import { CLIENT_AREA_SESSION_SECRET } from "@/lib/env";
import { STATIC_CLIENT_AREA_TRADE_PILOT_TIMEFRAME_PERFORMANCE } from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotAnalysisRequest,
  TradePilotAnalysisResult,
  TradePilotCreditBalance,
  TradePilotAnalysisService,
  TradePilotCreditService,
  TradePilotHistoryService,
  TradePilotHistoryItem,
  TradePilotMode,
} from "@/lib/trade-pilot/trade-pilot.types";

const TRADE_PILOT_MOCK_COOKIE = "sgb_trade_pilot_mock";
const MAX_HISTORY_ITEMS = 12;
const POLICY = {
  demo: { allowance: 5, initialConsumed: 0 },
  real: { allowance: 50, initialConsumed: 3 },
} as const;

type MockState = {
  completedRequests: Array<{
    analysis: TradePilotAnalysisResult;
    history: TradePilotHistoryItem;
    key: string;
  }>;
  creditOperationKeys: string[];
  consumed: Record<TradePilotMode, number>;
  histories: TradePilotHistoryItem[];
  latestAnalyses: Partial<Record<TradePilotMode, TradePilotAnalysisResult>>;
  userId: string;
};

function encryptionKey(): Uint8Array {
  if (!CLIENT_AREA_SESSION_SECRET) {
    throw new Error("CLIENT_AREA_SESSION_SECRET is required for Trade Pilot.");
  }

  return createHash("sha256")
    .update(`${CLIENT_AREA_SESSION_SECRET}:trade-pilot-mock`)
    .digest();
}

function initialState(userId: string): MockState {
  return {
    consumed: { demo: POLICY.demo.initialConsumed, real: POLICY.real.initialConsumed },
    completedRequests: [],
    creditOperationKeys: [],
    histories: [
      { createdAt: "2026-10-06T02:00:00.000Z", id: "mock-seed-real-1", instrumentLabel: "XAU/USD", mode: "real", source: "mock", status: "take_profit_2", timeframeLabel: "1h" },
      { createdAt: "2026-10-05T06:00:00.000Z", id: "mock-seed-real-2", instrumentLabel: "XAU/USD", mode: "real", source: "mock", status: "stop_loss", timeframeLabel: "1h" },
      { createdAt: "2026-10-04T03:00:00.000Z", id: "mock-seed-real-3", instrumentLabel: "XAU/USD", mode: "real", source: "mock", status: "expired", timeframeLabel: "4h" },
    ],
    latestAnalyses: {},
    userId,
  };
}

async function readState(userId: string): Promise<MockState> {
  const raw = (await cookies()).get(TRADE_PILOT_MOCK_COOKIE)?.value;

  if (!raw) return initialState(userId);

  try {
    const { payload } = await jwtDecrypt(raw, encryptionKey());
    if (
      payload.userId !== userId ||
      typeof payload.consumed !== "object" ||
      !Array.isArray(payload.histories) ||
      !Array.isArray(payload.completedRequests) ||
      !Array.isArray(payload.creditOperationKeys)
    ) {
      return initialState(userId);
    }

    return payload as unknown as MockState;
  } catch {
    return initialState(userId);
  }
}

async function writeState(state: MockState): Promise<void> {
  const value = await new EncryptJWT({ ...state })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .encrypt(encryptionKey());

  (await cookies()).set({
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    name: TRADE_PILOT_MOCK_COOKIE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    value,
  });
}

function credit(mode: TradePilotMode, consumed: number): TradePilotCreditBalance {
  const allowance = POLICY[mode].allowance;
  const safeConsumed = Math.min(Math.max(consumed, 0), allowance);

  return {
    allowance,
    consumed: safeConsumed,
    mode,
    remaining: allowance - safeConsumed,
    source: "mock",
  };
}

function consumeCreditInState(
  state: MockState,
  mode: TradePilotMode,
  amount: number,
  idempotencyKey: string,
): TradePilotCreditBalance | "insufficient_credit" {
  if (state.creditOperationKeys.includes(idempotencyKey)) {
    return credit(mode, state.consumed[mode]);
  }

  const current = credit(mode, state.consumed[mode]);
  if (amount < 1 || current.remaining < amount) return "insufficient_credit";

  state.consumed[mode] += amount;
  state.creditOperationKeys = [idempotencyKey, ...state.creditOperationKeys].slice(0, 12);
  return credit(mode, state.consumed[mode]);
}

function timeframeLabel(timeframe: TradePilotAnalysisRequest["timeframe"]): string {
  return ({ "1": "1m", "5": "5m", "15": "15m", "60": "1h", "240": "4h", D: "1D", W: "1W", M: "1M" })[timeframe];
}

function buildAnalysis(
  request: TradePilotAnalysisRequest,
  idempotencyKey: string,
): TradePilotAnalysisResult {
  const seed = [...`${request.instrumentId}:${request.timeframe}`].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const direction = (["bullish", "bearish", "neutral"] as const)[seed % 3];
  const base = request.instrumentId === "gold" ? 4162 : 100 + (seed % 900);

  return {
    analyzedAt: new Date().toISOString(),
    buyLevels: {
      entry: (base + 10).toFixed(2),
      stopLoss: (base - 10).toFixed(2),
      takeProfitOne: (base + 30).toFixed(2),
      takeProfitTwo: (base + 50).toFixed(2),
    },
    direction,
    id: createHash("sha256").update(idempotencyKey).digest("hex").slice(0, 16),
    instrumentLabel: request.instrumentLabel,
    marketSentiment: direction === "bullish" ? "bullish" : "bearish",
    mode: request.mode,
    sellLevels: {
      entry: (base - 14).toFixed(2),
      stopLoss: (base + 6).toFixed(2),
      takeProfitOne: (base - 34).toFixed(2),
      takeProfitTwo: (base - 54).toFixed(2),
    },
    source: "mock",
    timeframe: request.timeframe,
    timeframeLabel: timeframeLabel(request.timeframe),
  };
}

export async function getMockTradePilotSnapshot(userId: string) {
  const state = await readState(userId);

  return {
    credits: {
      demo: credit("demo", state.consumed.demo),
      real: credit("real", state.consumed.real),
    },
    histories: {
      demo: state.histories.filter(({ mode }) => mode === "demo"),
      real: state.histories.filter(({ mode }) => mode === "real"),
    },
    latestAnalyses: state.latestAnalyses,
    timeframePerformance: STATIC_CLIENT_AREA_TRADE_PILOT_TIMEFRAME_PERFORMANCE,
  };
}

export async function runMockTradePilotAnalysis(
  userId: string,
  request: TradePilotAnalysisRequest,
  idempotencyKey: string,
) {
  const state = await readState(userId);
  const completed = state.completedRequests.find(({ key }) => key === idempotencyKey);

  if (completed) {
    return {
      analysis: completed.analysis,
      credit: credit(request.mode, state.consumed[request.mode]),
      history: completed.history,
    };
  }

  const consumedCredit = consumeCreditInState(state, request.mode, 1, idempotencyKey);
  if (consumedCredit === "insufficient_credit") return consumedCredit;

  const analysis = buildAnalysis(request, idempotencyKey);
  const history: TradePilotHistoryItem = {
    createdAt: analysis.analyzedAt,
    id: idempotencyKey,
    instrumentLabel: request.instrumentLabel,
    mode: request.mode,
    source: "mock",
    status: "still_valid",
    timeframeLabel: analysis.timeframeLabel,
  };

  state.histories = [history, ...state.histories].slice(0, MAX_HISTORY_ITEMS);
  state.completedRequests = [
    { analysis, history, key: idempotencyKey },
    ...state.completedRequests,
  ].slice(0, 2);
  state.latestAnalyses[request.mode] = analysis;
  await writeState(state);

  return {
    analysis,
    credit: consumedCredit,
    history,
  };
}

export const mockTradePilotCreditService: TradePilotCreditService = {
  async getBalance(userId, mode) {
    return (await getMockTradePilotSnapshot(userId)).credits[mode];
  },
  async consumeCredit(userId, mode, amount, idempotencyKey) {
    const state = await readState(userId);
    const result = consumeCreditInState(state, mode, amount, idempotencyKey);
    if (result !== "insufficient_credit") await writeState(state);
    return result;
  },
};

export const mockTradePilotHistoryService: TradePilotHistoryService = {
  async get(userId, analysisId) {
    return (await readState(userId)).histories.find(({ id }) => id === analysisId) ?? null;
  },
  async list(userId, mode) {
    return (await getMockTradePilotSnapshot(userId)).histories[mode];
  },
};

export const mockTradePilotAnalysisService: TradePilotAnalysisService = {
  async getLatest(userId, mode) {
    return (await getMockTradePilotSnapshot(userId)).latestAnalyses[mode];
  },
  run: runMockTradePilotAnalysis,
};
