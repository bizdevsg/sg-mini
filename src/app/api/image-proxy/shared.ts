import { NextResponse } from "next/server";

import { isAllowedImageProxySource } from "@/lib/env";

function buildErrorResponse(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
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

export async function proxyImageSource(sourceUrl: string) {
  if (!sourceUrl) {
    return buildErrorResponse(400, "Missing src parameter.");
  }

  if (!isAllowedImageProxySource(sourceUrl)) {
    return buildErrorResponse(400, "Unsupported image source.");
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(sourceUrl, {
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
  const contentType = upstreamResponse.headers.get("content-type");
  const cacheControl = upstreamResponse.headers.get("cache-control");
  const contentLength = upstreamResponse.headers.get("content-length");
  const etag = upstreamResponse.headers.get("etag");
  const lastModified = upstreamResponse.headers.get("last-modified");

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

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
