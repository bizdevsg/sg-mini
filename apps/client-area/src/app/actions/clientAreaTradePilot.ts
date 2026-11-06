"use server";

import { z } from "zod";

import { TRADE_PILOT_DATA_SOURCE, TRADE_PILOT_MIN_REAL_EQUITY_USD } from "@/lib/env";
import { getTradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot-access";
import { getTradePilotRealEquityStatus } from "@/lib/trade-pilot/trade-pilot-equity";
import {
  getLiveTradePilotCredits,
  runLiveTradePilotAnalysis,
  TRADE_PILOT_UNAVAILABLE_MESSAGE,
  TradePilotApiError,
} from "@/lib/trade-pilot/trade-pilot-api";
import { mockTradePilotAnalysisService } from "@/lib/trade-pilot/trade-pilot-mock";
import { consumeTradePilotRateLimit } from "@/lib/trade-pilot/trade-pilot-rate-limit";
import type {
  TradePilotAnalysisActionResult,
  TradePilotMode,
  TradePilotRealEquityStatus,
} from "@/lib/trade-pilot/trade-pilot.types";

const requestSchema = z.object({
  instrumentId: z.enum(["gold", "brent", "hang-seng", "nikkei"]),
  mode: z.enum(["demo", "real"]),
  timeframe: z.enum(["1", "5", "15", "30", "60", "240", "D", "W", "M"]),
});

const INSTRUMENT_LABELS = {
  gold: "XAU/USD",
  brent: "BCO",
  "hang-seng": "HKK",
  nikkei: "JPK",
} as const;

export async function runClientAreaTradePilotAnalysis(
  input: unknown,
  idempotencyKey: string,
  language: "id" | "en" = "id",
): Promise<TradePilotAnalysisActionResult> {
  const request = requestSchema.safeParse(input);
  if (!request.success || !/^[a-zA-Z0-9-]{8,80}$/.test(idempotencyKey)) {
    return { status: "invalid_request" };
  }

  const access = await getTradePilotAccessContext();
  if (
    !access.allowed ||
    !access.userId ||
    !access.availableModes.includes(request.data.mode)
  ) {
    return { status: "access_denied" };
  }
  // Batas lokal longgar; batas resmi (10/menit, 1 berjalan) ada di backend.
  if (!consumeTradePilotRateLimit(access.userId, "analysis", 12)) {
    return { retryAfterSeconds: 60, status: "rate_limited" };
  }

  const analysisRequest = {
    ...request.data,
    instrumentLabel: INSTRUMENT_LABELS[request.data.instrumentId],
  };

  // Mode Real: 3 analisis/hari HANYA selama akun live punya equity.
  // Fail closed — equity yang gagal dicek juga ditolak (sebelum kredit dipotong).
  let realEquity: TradePilotRealEquityStatus | undefined;
  if (TRADE_PILOT_DATA_SOURCE === "api" && request.data.mode === "real") {
    realEquity = await getTradePilotRealEquityStatus();
    if (realEquity !== "positive") {
      return { reason: realEquity, status: "no_equity" };
    }
  }

  try {
    let result;

    if (TRADE_PILOT_DATA_SOURCE === "api") {
      // idempotencyKey dibuat di client per klik; JANGAN dibuat ulang di sini
      // supaya retry tidak memotong kredit dua kali.
      result = await runLiveTradePilotAnalysis(
        {
          allowedModes: access.availableModes,
          language,
          realEquity,
          userId: access.userId,
        },
        analysisRequest,
        idempotencyKey,
      );
    } else {
      result = await mockTradePilotAnalysisService.run(
        access.userId,
        analysisRequest,
        idempotencyKey,
      );
    }

    if (result === "insufficient_credit") {
      return { resetsAt: null, status: "insufficient_credit" };
    }
    if (!result || !result.history) {
      return { message: "Mock analysis state could not be resolved.", status: "error" };
    }
    return { ...result, status: "success" };
  } catch (error) {
    if (error instanceof TradePilotApiError) {
      if (error.code === "rate_limited") {
        return {
          retryAfterSeconds: error.retryAfterSeconds ?? null,
          status: "rate_limited",
        };
      }
      if (error.code === "upstream_unavailable") {
        return { status: "analysis_unavailable" };
      }
      if (error.code === "analysis_paused") {
        return { message: error.message, status: "analysis_paused" };
      }

      switch (error.uiStatus) {
        case "insufficient_credit":
          return {
            resetsAt: await getCreditResetsAt(access, request.data.mode, language),
            status: "insufficient_credit",
          };
        case "trial_expired":
          return { status: "trial_expired" };
        case "no_equity":
          return { reason: "none", status: "no_equity" };
        case "access_denied":
          return { status: "access_denied" };
        case "invalid_request":
          return { status: "invalid_request" };
        default:
          break;
      }
    }
    return { message: TRADE_PILOT_UNAVAILABLE_MESSAGE, status: "error" };
  }
}

async function getCreditResetsAt(
  access: { availableModes: TradePilotMode[]; userId: string | null },
  mode: TradePilotMode,
  language: "id" | "en",
) {
  if (!access.userId) return null;
  try {
    const credit = await getLiveTradePilotCredits(
      { allowedModes: access.availableModes, language, userId: access.userId },
      mode,
    );
    return credit.resetsAt;
  } catch {
    return null;
  }
}

/**
 * Status equity akun live untuk UI mode Real (tombol Analisis & pesan).
 * Penegakan tetap di runClientAreaTradePilotAnalysis dan backend.
 */
export async function getClientAreaTradePilotRealEquity(): Promise<{
  minEquityUsd: number;
  status: TradePilotRealEquityStatus | "not_applicable";
}> {
  const minEquityUsd = TRADE_PILOT_MIN_REAL_EQUITY_USD;
  if (TRADE_PILOT_DATA_SOURCE !== "api") return { minEquityUsd, status: "not_applicable" };
  const access = await getTradePilotAccessContext();
  if (!access.allowed || !access.availableModes.includes("real")) {
    return { minEquityUsd, status: "not_applicable" };
  }
  return { minEquityUsd, status: await getTradePilotRealEquityStatus() };
}
