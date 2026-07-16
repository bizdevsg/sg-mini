import { NextResponse } from "next/server";

import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import {
  DEFAULT_EXCHANGE_RATE_BASE,
  getExchangeRateSnapshot,
  isExchangeRateCurrencyCode,
} from "@/lib/exchange-rates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const blockedResponse = protectSameOriginBrowserApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const { searchParams } = new URL(request.url);
  const requestedBase = searchParams.get("base")?.trim().toUpperCase();
  const base =
    requestedBase && isExchangeRateCurrencyCode(requestedBase)
      ? requestedBase
      : DEFAULT_EXCHANGE_RATE_BASE;

  const snapshot = await getExchangeRateSnapshot(base);

  if (!snapshot) {
    return withApiProtectionHeaders(
      NextResponse.json(
        {
          error: "Exchange rate unavailable.",
        },
        {
          status: 502,
        },
      ),
      {
        cacheControl: "private, no-store, max-age=0",
      },
    );
  }

  return withApiProtectionHeaders(NextResponse.json(snapshot), {
    cacheControl: "private, no-store, max-age=0",
  });
}
