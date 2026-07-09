import { NextResponse } from "next/server";

import {
  protectInternalApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getLegalitasRecords } from "@/lib/legalitas";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const blockedResponse = protectInternalApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const data = await getLegalitasRecords();

  return withApiProtectionHeaders(
    NextResponse.json({
      data,
      meta: {
        total: data.length,
      },
    }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
