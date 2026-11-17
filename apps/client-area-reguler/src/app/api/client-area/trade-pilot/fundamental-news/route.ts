import { z } from "zod";

import { getLiveTradePilotFundamentalNews } from "@/lib/trade-pilot/trade-pilot-api";
import {
  authorizeTradePilotRoute,
  rateLimitTradePilotRoute,
  tradePilotRouteError,
} from "@/lib/trade-pilot/trade-pilot-route";
import { withApiProtectionHeaders } from "@/lib/api-protection";
import { NextResponse } from "next/server";

const querySchema = z.object({
  instrumentId: z.enum(["gold", "brent", "hang-seng", "nikkei"]),
  limit: z.coerce.number().int().min(1).max(10).default(5),
});

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = querySchema.safeParse({
    instrumentId: params.get("instrumentId"),
    limit: params.get("limit") ?? undefined,
  });
  if (!query.success) {
    return withApiProtectionHeaders(
      NextResponse.json({ error: "invalid_request" }, { status: 400 }),
      { cacheControl: "private, no-store, max-age=0" },
    );
  }
  const auth = await authorizeTradePilotRoute(request);
  if (auth.response) return auth.response;
  const limited = rateLimitTradePilotRoute(auth.context, "market-data", 30);
  if (limited) return limited;

  try {
    const news = await getLiveTradePilotFundamentalNews(
      auth.context,
      query.data.instrumentId,
      query.data.limit,
    );
    // Berita sama untuk semua nasabah; cache privat 5 menit mengikuti backend.
    return withApiProtectionHeaders(NextResponse.json(news), {
      cacheControl: "private, max-age=300",
    });
  } catch (error) {
    return tradePilotRouteError(error);
  }
}
