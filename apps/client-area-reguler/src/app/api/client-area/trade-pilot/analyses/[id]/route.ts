import { getLiveTradePilotAnalysis } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

export async function GET(
  request: Request,
  context: RouteContext<"/api/client-area/trade-pilot/analyses/[id]">,
) {
  const auth = await authorizeTradePilotRoute(request);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "read");
  if (limited) return limited;
  const { id } = await context.params;
  if (!/^[a-zA-Z0-9_-]{3,100}$/.test(id)) {
    return tradePilotJson({ error: "invalid_id" }, 400);
  }

  try {
    const analysis = await getLiveTradePilotAnalysis(auth.context, id);
    if (!auth.context.allowedModes.includes(analysis.mode)) {
      return tradePilotJson({ error: "access_denied" }, 403);
    }
    return tradePilotJson(analysis);
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
