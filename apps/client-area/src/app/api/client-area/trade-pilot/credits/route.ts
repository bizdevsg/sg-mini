import { getLiveTradePilotCredits } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get("mode");
  if (mode !== "demo" && mode !== "real") {
    return tradePilotJson({ error: "invalid_mode" }, 400);
  }
  const auth = await authorizeTradePilotRoute(request, mode);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "read");
  if (limited) return limited;

  try {
    return tradePilotJson(await getLiveTradePilotCredits(auth.context, mode));
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
