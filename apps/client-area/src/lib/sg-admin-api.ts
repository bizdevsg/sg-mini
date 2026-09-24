import "server-only";

import { PUBLIC_SITE_URL } from "@/lib/env";

const SG_ADMIN_API_KEY = process.env.SG_ADMIN_API_KEY?.trim() ?? "";
const SG_ADMIN_REQUEST_ORIGIN = process.env.SG_ADMIN_REQUEST_ORIGIN?.trim() ?? "";

async function resolveWebsiteOrigin() {
  if (SG_ADMIN_REQUEST_ORIGIN) {
    return SG_ADMIN_REQUEST_ORIGIN;
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
      resolvedHeaders.set("Referer", `${websiteOrigin.replace(/\/+$/, "")}/`);
    }
  }

  if (SG_ADMIN_API_KEY) {
    resolvedHeaders.set("X-API-Key", SG_ADMIN_API_KEY);
  }

  return resolvedHeaders;
}
