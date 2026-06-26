import { proxyImageSource, getImageProxySourceFromEncodedParam } from "../shared";

export const runtime = "nodejs";

type ImageProxyRouteProps = {
  params: Promise<{
    encodedSource: string;
  }>;
};

export async function GET(_: Request, { params }: ImageProxyRouteProps) {
  const { encodedSource } = await params;

  return proxyImageSource(getImageProxySourceFromEncodedParam(encodedSource));
}
