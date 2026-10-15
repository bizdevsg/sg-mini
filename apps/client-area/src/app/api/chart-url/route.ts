import {
  protectSameOriginBrowserApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import { getSession } from "@/lib/client-area-auth";
import { buildChartUrlResponse } from "@/lib/mini-chart";

export async function GET(request: Request) {
  const blocked = protectSameOriginBrowserApiRoute(request);

  if (blocked) {
    return blocked;
  }

  const session = await getSession();
  return withApiProtectionHeaders(buildChartUrlResponse(request, session));
}
