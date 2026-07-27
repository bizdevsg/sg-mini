import "server-only";

const SG_ADMIN_API_KEY = process.env.SG_ADMIN_API_KEY?.trim() ?? "";

export function getSgAdminApiHeaders(headers?: HeadersInit) {
  const resolvedHeaders = new Headers(headers);

  if (!resolvedHeaders.has("Accept")) {
    resolvedHeaders.set("Accept", "application/json");
  }

  if (SG_ADMIN_API_KEY) {
    resolvedHeaders.set("X-API-Key", SG_ADMIN_API_KEY);
  }

  return resolvedHeaders;
}
