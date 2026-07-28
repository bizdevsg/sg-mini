import "server-only";

import { headers } from "next/headers";

import { PUBLIC_SITE_URL } from "@/lib/env";

const SG_ADMIN_API_KEY = process.env.SG_ADMIN_API_KEY?.trim() ?? "";

async function resolveWebsiteOrigin() {
  try {
    const requestHeaders = await headers();
    const forwardedProto = requestHeaders.get("x-forwarded-proto")?.trim();
    const forwardedHost = requestHeaders.get("x-forwarded-host")?.trim();
    const host = requestHeaders.get("host")?.trim();
    const resolvedHost = forwardedHost || host;
    const resolvedProto = forwardedProto || (resolvedHost?.includes("localhost") ? "http" : "https");

    if (resolvedHost) {
      return `${resolvedProto}://${resolvedHost}`;
    }
  } catch {
    // Fall back to configured public site URL when request headers are unavailable.
  }

  return PUBLIC_SITE_URL;
}

export async function getSgAdminApiHeaders(headersInit?: HeadersInit) {
  const resolvedHeaders = new Headers(headersInit);

  if (!resolvedHeaders.has("Accept")) {
    resolvedHeaders.set("Accept", "application/json");
  }

  if (!resolvedHeaders.has("Origin")) {
    const websiteOrigin = await resolveWebsiteOrigin();

    if (websiteOrigin) {
      resolvedHeaders.set("Origin", websiteOrigin);
    }
  }

  if (SG_ADMIN_API_KEY) {
    resolvedHeaders.set("X-API-Key", SG_ADMIN_API_KEY);
  }

  return resolvedHeaders;
}
