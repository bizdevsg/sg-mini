import { z } from "zod";

import {
  createLiveTradePilotTradingPlan,
  listLiveTradePilotTradingPlans,
} from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

const ID_PATTERN = /^[a-zA-Z0-9_-]{3,100}$/;
const decimalSchema = z
  .union([z.string(), z.number()])
  .transform(String)
  .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/));

const createSchema = z.object({
  accountType: z.enum(["micro", "mini", "regular"]),
  analysisId: z.string().regex(ID_PATTERN),
  lossLimit: decimalSchema,
  result: z
    .record(z.string(), z.unknown())
    .refine((value) => JSON.stringify(value).length <= 8_192)
    .optional(),
  riskStyle: z.string().trim().min(1).max(32),
  tradingCapital: decimalSchema,
  variant: z.enum(["buy", "sell"]),
});

export async function GET(request: Request) {
  const analysisId = new URL(request.url).searchParams.get("analysisId") ?? "";
  if (!ID_PATTERN.test(analysisId)) return tradePilotJson({ error: "invalid_request" }, 400);
  const auth = await authorizeTradePilotRoute(request);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "read");
  if (limited) return limited;

  try {
    return tradePilotJson({
      items: await listLiveTradePilotTradingPlans(auth.context, analysisId),
    });
  } catch (error) {
    return tradePilotRouteError(error);
  }
}

export async function POST(request: Request) {
  const input = createSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return tradePilotJson({ error: "invalid_request" }, 400);
  const auth = await authorizeTradePilotRoute(request);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "plan-write", 20);
  if (limited) return limited;

  try {
    return tradePilotJson(
      await createLiveTradePilotTradingPlan(auth.context, input.data),
      201,
    );
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
