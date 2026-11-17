import { z } from "zod";

import { getLiveTradePilotPerformance } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

const instrumentSchema = z.enum(["gold", "brent", "hang-seng", "nikkei"]);

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("mode");
  const instrument = params.get("instrumentId");
  const instrumentId = instrument ? instrumentSchema.safeParse(instrument) : null;
  if (
    (mode !== "demo" && mode !== "real") ||
    (instrumentId && !instrumentId.success)
  ) {
    return tradePilotJson({ error: "invalid_request" }, 400);
  }
  const auth = await authorizeTradePilotRoute(request, mode);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "read");
  if (limited) return limited;

  try {
    return tradePilotJson(
      await getLiveTradePilotPerformance(
        auth.context,
        mode,
        instrumentId?.success ? instrumentId.data : undefined,
      ),
    );
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
