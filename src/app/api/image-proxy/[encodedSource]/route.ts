import { protectSameOriginBrowserApiRoute } from "@/lib/api-protection";
import { proxyImageSource, getImageProxySourceFromEncodedParam } from "../shared";

export const runtime = "nodejs";

type ImageProxyRouteProps = {
  params: Promise<{
    encodedSource: string;
  }>;
};

export async function GET(request: Request, { params }: ImageProxyRouteProps) {
  const blockedResponse = protectSameOriginBrowserApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const { encodedSource } = await params;

  return proxyImageSource(getImageProxySourceFromEncodedParam(encodedSource));
}
