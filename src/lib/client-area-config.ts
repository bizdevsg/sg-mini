import "server-only";

import {
  APP_ENV,
  CLIENT_AREA_CONFIG_API_TOKEN,
  CLIENT_AREA_CONFIG_API_URL,
} from "@/lib/env";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";

const CLIENT_AREA_CONFIG_REVALIDATE_SECONDS = 60;
const CLIENT_AREA_CONFIG_TIMEOUT_MS = 5000;
const BOOLEAN_CONFIG_KEYS = [
  "enabled",
  "isEnabled",
  "active",
  "isActive",
  "clientAreaEnabled",
  "client_area_enabled",
  "clientAreaActive",
  "client_area_active",
  "value",
] as const;
const NESTED_CONFIG_KEYS = [
  "data",
  "result",
  "payload",
  "settings",
  "feature",
  "flag",
  "clientArea",
  "client_area",
] as const;

function resolveClientAreaEnvironmentKey() {
  return APP_ENV === "prod" ? "prod" : "dev";
}

function parseBooleanValue(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (["true", "1", "yes", "on", "enabled", "active"].includes(normalizedValue)) {
      return true;
    }

    if (["false", "0", "no", "off", "disabled", "inactive"].includes(normalizedValue)) {
      return false;
    }
  }

  return null;
}

function resolveClientAreaEnabledValue(payload: unknown): boolean | null {
  const directValue = parseBooleanValue(payload);

  if (directValue !== null) {
    return directValue;
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const environmentKey = resolveClientAreaEnvironmentKey();
  const environmentScopedData = record.data;

  if (
    environmentScopedData &&
    typeof environmentScopedData === "object" &&
    !Array.isArray(environmentScopedData)
  ) {
    const resolvedEnvironmentValue = parseBooleanValue(
      (environmentScopedData as Record<string, unknown>)[environmentKey],
    );

    if (resolvedEnvironmentValue !== null) {
      return resolvedEnvironmentValue;
    }
  }

  for (const key of BOOLEAN_CONFIG_KEYS) {
    const resolvedValue = parseBooleanValue(record[key]);

    if (resolvedValue !== null) {
      return resolvedValue;
    }
  }

  for (const key of NESTED_CONFIG_KEYS) {
    const resolvedValue = resolveClientAreaEnabledValue(record[key]);

    if (resolvedValue !== null) {
      return resolvedValue;
    }
  }

  return null;
}

export async function isClientAreaEnabled() {
  if (!CLIENT_AREA_CONFIG_API_URL) {
    return false;
  }

  const headers = getSgAdminApiHeaders();

  if (CLIENT_AREA_CONFIG_API_TOKEN) {
    headers.set("Authorization", `Bearer ${CLIENT_AREA_CONFIG_API_TOKEN}`);
    headers.set("x-internal-api-token", CLIENT_AREA_CONFIG_API_TOKEN);
  }

  try {
    const response = await fetch(CLIENT_AREA_CONFIG_API_URL, {
      method: "GET",
      headers,
      ...(APP_ENV === "prod"
        ? {
            next: {
              revalidate: CLIENT_AREA_CONFIG_REVALIDATE_SECONDS,
            },
          }
        : {
            cache: "no-store" as const,
          }),
      signal: AbortSignal.timeout(CLIENT_AREA_CONFIG_TIMEOUT_MS),
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as unknown;
    return resolveClientAreaEnabledValue(payload) ?? false;
  } catch {
    return false;
  }
}
