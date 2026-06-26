import type { NextRequest } from "next/server";
import { proxyImageSource } from "./shared";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get("src")?.trim();

  return proxyImageSource(sourceUrl ?? "");
}
