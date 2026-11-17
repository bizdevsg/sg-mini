import { z } from "zod";

import { getLiveTradePilotHistory } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

const querySchema = z.object({
  cursor: z.string().min(1).max(500).optional(),
  instrumentId: z.enum(["gold", "brent", "hang-seng", "nikkei"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  mode: z.enum(["demo", "real"]),
  status: z
    .enum(["still_valid", "take_profit_1", "take_profit_2", "stop_loss", "expired", "invalid"])
    .optional(),
  timeframe: z.enum(["1", "5", "15", "30", "60", "240", "D", "W", "M"]).optional(),
});

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = querySchema.safeParse(
    Object.fromEntries([...params].filter(([, value]) => value !== "")),
  );
  if (!query.success) return tradePilotJson({ error: "invalid_request" }, 400);

  const { mode, ...options } = query.data;
  const auth = await authorizeTradePilotRoute(request, mode);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "read");
  if (limited) return limited;

  try {
    return tradePilotJson(await getLiveTradePilotHistory(auth.context, mode, options));
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
