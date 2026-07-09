import { NextResponse } from "next/server";

import {
  protectInternalApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getCompanyProfile } from "@/lib/company-profile";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const blockedResponse = protectInternalApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const data = await getCompanyProfile();

  return withApiProtectionHeaders(
    NextResponse.json({
      data,
    }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
