import { NextResponse } from "next/server";

import { getLegalitasRecords } from "@/lib/legalitas";

export const runtime = "nodejs";

export async function GET() {
  const data = await getLegalitasRecords();

  return NextResponse.json({
    data,
    meta: {
      total: data.length,
    },
  });
}
