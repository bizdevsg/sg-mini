import { NextResponse } from "next/server";

import {
  ECONOMIC_CALENDAR_RANGE_KEYS,
  getEconomicCalendarRange,
} from "@/lib/economic-calendar";

export const runtime = "nodejs";

function isEconomicCalendarRange(value: string): value is (typeof ECONOMIC_CALENDAR_RANGE_KEYS)[number] {
  return ECONOMIC_CALENDAR_RANGE_KEYS.includes(
    value as (typeof ECONOMIC_CALENDAR_RANGE_KEYS)[number],
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ range: string }> },
) {
  const { range } = await context.params;

  if (!isEconomicCalendarRange(range)) {
    return NextResponse.json(
      { error: `Unsupported range: ${range}` },
      { status: 400 },
    );
  }

  const data = await getEconomicCalendarRange(range);
  return NextResponse.json(data);
}
