"use server";

import { z } from "zod";

import { getTradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot-access";
import { mockTradePilotAnalysisService } from "@/lib/trade-pilot/trade-pilot-mock";
import type { TradePilotAnalysisActionResult } from "@/lib/trade-pilot/trade-pilot.types";

const requestSchema = z.object({
  instrumentId: z.enum(["gold", "brent", "hang-seng", "nikkei"]),
  instrumentLabel: z.string().min(1).max(30),
  mode: z.enum(["demo", "real"]),
  timeframe: z.enum(["1", "5", "15", "60", "240", "D", "W", "M"]),
});

export async function runClientAreaTradePilotAnalysis(
  input: unknown,
  idempotencyKey: string,
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

  try {
    const result = await mockTradePilotAnalysisService.run(
      access.userId,
      request.data,
      idempotencyKey,
    );

    if (result === "insufficient_credit") {
      return { status: "insufficient_credit" };
    }
    if (!result || !result.history) {
      return { message: "Mock analysis state could not be resolved.", status: "error" };
    }

    return { ...result, status: "success" };
  } catch {
    return { message: "Trade Pilot analysis is temporarily unavailable.", status: "error" };
  }
}
