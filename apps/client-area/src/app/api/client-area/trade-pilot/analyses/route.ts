import { z } from "zod";

import { runLiveTradePilotAnalysis } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotJson,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";

const requestSchema = z.object({
  instrumentId: z.enum(["gold", "brent", "hang-seng", "nikkei"]),
  mode: z.enum(["demo", "real"]),
  timeframe: z.enum(["1", "5", "15", "30", "60", "240", "D", "W", "M"]),
});

export async function POST(request: Request) {
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return tradePilotJson({ error: "invalid_request" }, 400);
  const auth = await authorizeTradePilotRoute(request, input.data.mode);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "analysis", 12);
  if (limited) return limited;

  // Key wajib dari client (sekali per klik). Jangan dibuat di server: retry
  // otomatis akan dianggap analisis baru dan memotong kredit dua kali.
  const idempotencyKey = request.headers.get("idempotency-key") ?? "";
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(idempotencyKey)) {
    return tradePilotJson({ error: "invalid_request" }, 400);
  }

  try {
    return tradePilotJson(
      await runLiveTradePilotAnalysis(
        auth.context,
        input.data,
        idempotencyKey,
      ),
      201,
    );
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
