import { z } from "zod";

import { getLiveTradePilotPositionPlan } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

const ID_PATTERN = /^[a-zA-Z0-9_-]{3,100}$/;

const inputSchema = z.object({
  accountType: z.enum(["micro", "mini", "regular"]),
  lossLimit: z.coerce.number().positive().max(100_000_000),
  riskStyle: z.enum(["conservative", "balanced", "aggressive"]),
  tradingCapital: z.coerce.number().positive().max(100_000_000),
});

/** Adaptive Position Plan: lot, margin, risiko SL, profit TP dari backend TradePilot. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!ID_PATTERN.test(id)) return tradePilotJson({ error: "invalid_request" }, 400);
  const input = inputSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return tradePilotJson({ error: "invalid_request" }, 400);
  const auth = await authorizeTradePilotRoute(request);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "position-plan", 30);
  if (limited) return limited;

  try {
    return tradePilotJson(await getLiveTradePilotPositionPlan(auth.context, id, input.data));
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
