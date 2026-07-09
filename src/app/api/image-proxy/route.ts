import type { NextRequest } from "next/server";

import { protectInternalApiRoute } from "@/lib/api-protection";
import { proxyImageSource } from "./shared";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const blockedResponse = protectInternalApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const sourceUrl = request.nextUrl.searchParams.get("src")?.trim();

  return proxyImageSource(sourceUrl ?? "");
}
