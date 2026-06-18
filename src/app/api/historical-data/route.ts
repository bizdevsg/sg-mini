import { NextResponse } from "next/server";

import { getHistoricalData } from "@/lib/historical-data";

export const runtime = "nodejs";

export async function GET() {
  const records = await getHistoricalData();
  return NextResponse.json({ records });
}
