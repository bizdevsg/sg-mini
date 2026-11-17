import { z } from "zod";

import { getLiveTradePilotCandles } from "@/lib/trade-pilot/trade-pilot-api";
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
  const query = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!query.success) return tradePilotJson({ error: "invalid_request" }, 400);
  const auth = await authorizeTradePilotRoute(request);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "market-data", 30);
  if (limited) return limited;

  try {
    return tradePilotJson(
      await getLiveTradePilotCandles(
        auth.context,
        query.data.instrumentId,
        query.data.timeframe,
      ),
    );
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
