import { NextResponse } from "next/server";

import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getWebsiteFeatureConfig } from "@/lib/client-area-config";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const blockedResponse = protectSameOriginBrowserApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const data = await getWebsiteFeatureConfig();

  return withApiProtectionHeaders(
    NextResponse.json({ data }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
