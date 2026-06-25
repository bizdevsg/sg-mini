import { NextRequest, NextResponse } from "next/server";

import { getPengumuman } from "@/lib/pengumuman";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const pageParam = request.nextUrl.searchParams.get("page");
  const page =
    pageParam && /^\d+$/.test(pageParam)
      ? Number.parseInt(pageParam, 10)
      : 1;

  const result = await getPengumuman(page);

  return NextResponse.json(result);
}
