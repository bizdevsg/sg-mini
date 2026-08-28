import { NextResponse } from "next/server";

import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import {
  ECONOMIC_CALENDAR_REVALIDATE_SECONDS,
  ECONOMIC_CALENDAR_RANGE_KEYS,
  getEconomicCalendarRange,
} from "@/lib/economic-calendar";

export const runtime = "nodejs";

function isEconomicCalendarRange(
  value: string,
): value is (typeof ECONOMIC_CALENDAR_RANGE_KEYS)[number] {
  return ECONOMIC_CALENDAR_RANGE_KEYS.includes(
    value as (typeof ECONOMIC_CALENDAR_RANGE_KEYS)[number],
  );
}

function parsePageParam(value: string | null) {
  if (!value) {
    return 1;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ range: string }> },
) {
  const blockedResponse = protectSameOriginBrowserApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const { range } = await context.params;
  const page = parsePageParam(new URL(request.url).searchParams.get("page"));

  if (!isEconomicCalendarRange(range)) {
    return withApiProtectionHeaders(
      NextResponse.json(
        { error: `Unsupported range: ${range}` },
        { status: 400 },
      ),
      {
        cacheControl: "private, no-store, max-age=0",
      },
    );
  }

  const data = await getEconomicCalendarRange(range, page);
  return withApiProtectionHeaders(
    NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${ECONOMIC_CALENDAR_REVALIDATE_SECONDS}, stale-while-revalidate=${ECONOMIC_CALENDAR_REVALIDATE_SECONDS}`,
      },
    }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
