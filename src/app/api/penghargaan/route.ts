import { NextResponse } from "next/server";

import { getPenghargaanRecords } from "@/lib/penghargaan";

export const runtime = "nodejs";

export async function GET() {
  const data = await getPenghargaanRecords();

  return NextResponse.json({
    data,
    meta: {
      total: data.length,
    },
  });
}
