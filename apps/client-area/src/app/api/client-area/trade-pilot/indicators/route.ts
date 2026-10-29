import { z } from "zod";

import { getLiveTradePilotIndicators } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

const querySchema = z.object({
  instrumentId: z.enum(["gold", "brent", "hang-seng", "nikkei"]),
  timeframe: z.enum(["1", "5", "15", "30", "60", "240", "D", "W", "M"]),
});

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = querySchema.safeParse(Object.fromEntries(params));
  if (!query.success) return tradePilotJson({ error: "invalid_request" }, 400);
  const auth = await authorizeTradePilotRoute(request);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "market-data", 30);
  if (limited) return limited;

  try {
    return tradePilotJson(
      await getLiveTradePilotIndicators(
        auth.context,
        query.data.instrumentId,
        query.data.timeframe,
      ),
    );
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
