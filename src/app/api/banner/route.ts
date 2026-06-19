import { NextResponse } from "next/server";

import { getBannerRecords } from "@/lib/banner";

export const runtime = "nodejs";

export async function GET() {
  const data = await getBannerRecords();

  return NextResponse.json({
    data,
    meta: {
      total: data.length,
    },
  });
}
