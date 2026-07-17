import { NextResponse } from "next/server";

import { withApiProtectionHeaders } from "@/lib/api-protection";
import { isAllowedImageProxySource, normalizeSgAdminUrl } from "@/lib/env";

const IMAGE_CONTENT_TYPES_BY_EXTENSION: Record<string, string> = {
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".webp": "image/webp",
};

function buildErrorResponse(status: number, message: string) {
  return withApiProtectionHeaders(
    NextResponse.json({ error: message }, { status }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}

function decodeBase64Url(value: string) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4;
  const paddedValue = `${normalizedValue}${"=".repeat(paddingLength)}`;

  return Buffer.from(paddedValue, "base64").toString("utf8").trim();
}

export function getImageProxySourceFromEncodedParam(encodedSource?: string) {
  if (!encodedSource) {
    return "";
  }

  try {
    return decodeBase64Url(encodedSource);
  } catch {
    return "";
  }
}

function inferImageContentTypeFromUrl(sourceUrl: string) {
  try {
    const { pathname } = new URL(sourceUrl);
    const normalizedPathname = pathname.toLowerCase();

    for (const [extension, contentType] of Object.entries(
      IMAGE_CONTENT_TYPES_BY_EXTENSION,
    )) {
      if (normalizedPathname.endsWith(extension)) {
        return contentType;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function resolveImageContentType(
  sourceUrl: string,
  upstreamContentType: string | null,
) {
  const normalizedContentType = upstreamContentType?.toLowerCase().trim() ?? "";

  if (normalizedContentType.startsWith("image/")) {
    return upstreamContentType;
  }

  if (normalizedContentType === "application/octet-stream") {
    return inferImageContentTypeFromUrl(sourceUrl);
  }

  return null;
}

export async function proxyImageSource(sourceUrl: string) {
  const normalizedSourceUrl = normalizeSgAdminUrl(sourceUrl);

  if (!normalizedSourceUrl) {
    return buildErrorResponse(400, "Missing src parameter.");
  }

  if (!isAllowedImageProxySource(normalizedSourceUrl)) {
    return buildErrorResponse(400, "Unsupported image source.");
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(normalizedSourceUrl, {
      cache: "no-store",
      headers: {
        Accept: "image/*,*/*;q=0.8",
      },
    });
  } catch {
    return buildErrorResponse(502, "Failed to fetch upstream image.");
  }

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return buildErrorResponse(
      upstreamResponse.status || 502,
      "Upstream image request failed.",
    );
  }

  const responseHeaders = new Headers();
  const contentType = resolveImageContentType(
    normalizedSourceUrl,
    upstreamResponse.headers.get("content-type"),
  );
  const cacheControl = upstreamResponse.headers.get("cache-control");
  const contentLength = upstreamResponse.headers.get("content-length");
  const etag = upstreamResponse.headers.get("etag");
  const lastModified = upstreamResponse.headers.get("last-modified");

  if (!contentType?.toLowerCase().startsWith("image/")) {
    return buildErrorResponse(415, "Upstream response is not an image.");
  }

  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  responseHeaders.set(
    "cache-control",
    cacheControl ?? "public, max-age=300, stale-while-revalidate=86400",
  );

  if (contentLength) {
    responseHeaders.set("content-length", contentLength);
  }

  if (etag) {
    responseHeaders.set("etag", etag);
  }

  if (lastModified) {
    responseHeaders.set("last-modified", lastModified);
  }

  return withApiProtectionHeaders(
    new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    }),
  );
}
