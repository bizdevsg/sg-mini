import { NextRequest, NextResponse } from "next/server";

import {
  protectInternalApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getPengumuman } from "@/lib/pengumuman";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const blockedResponse = protectInternalApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const pageParam = request.nextUrl.searchParams.get("page");
  const page =
    pageParam && /^\d+$/.test(pageParam)
      ? Number.parseInt(pageParam, 10)
      : 1;

  const result = await getPengumuman(page);

  return withApiProtectionHeaders(NextResponse.json(result), {
    cacheControl: "private, no-store, max-age=0",
  });
}
