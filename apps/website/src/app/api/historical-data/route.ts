import { NextResponse } from "next/server";

import {
  protectInternalApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getHistoricalData } from "@/lib/historical-data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const blockedResponse = protectInternalApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const records = await getHistoricalData();
  return withApiProtectionHeaders(
    NextResponse.json({ records }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
