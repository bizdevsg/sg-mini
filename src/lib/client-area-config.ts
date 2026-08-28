import "server-only";

import { cache } from "react";

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
const CLIENT_AREA_FEATURE_KEYS = [
  "clientArea",
  "client_area",
  "clientAreaEnabled",
  "client_area_enabled",
  "clientAreaActive",
  "client_area_active",
] as const;
const TAWK_CHAT_FEATURE_KEYS = [
  "tawk",
  "tawkTo",
  "tawk_to",
  "tawkChat",
  "tawk_chat",
  "tawkEnabled",
  "tawk_enabled",
  "tawkActive",
  "tawk_active",
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

function resolveEnvironmentScopedValue(
  payload: unknown,
  featureKeys: readonly string[],
) {
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
    const dataRecord = environmentScopedData as Record<string, unknown>;

    for (const featureKey of featureKeys) {
      const flatEnvironmentValue = parseBooleanValue(
        dataRecord[`${featureKey}_${environmentKey}`],
      );

      if (flatEnvironmentValue !== null) {
        return flatEnvironmentValue;
      }

      const featureValue = dataRecord[featureKey];

      if (
        featureValue &&
        typeof featureValue === "object" &&
        !Array.isArray(featureValue)
      ) {
        const environmentValue = parseBooleanValue(
          (featureValue as Record<string, unknown>)[environmentKey],
        );

        if (environmentValue !== null) {
          return environmentValue;
        }
      }
    }

    const directEnvironmentValue = parseBooleanValue(dataRecord[environmentKey]);

    if (directEnvironmentValue !== null) {
      return directEnvironmentValue;
    }
  }

  return null;
}

function resolveFeatureEnabledValue(
  payload: unknown,
  featureKeys: readonly string[],
): boolean | null {
  const environmentScopedValue = resolveEnvironmentScopedValue(
    payload,
    featureKeys,
  );

  if (environmentScopedValue !== null) {
    return environmentScopedValue;
  }

  const directValue = parseBooleanValue(payload);

  if (directValue !== null) {
    return directValue;
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;

  for (const featureKey of featureKeys) {
    const resolvedFeatureValue = resolveFeatureEnabledValue(
      record[featureKey],
      featureKeys,
    );

    if (resolvedFeatureValue !== null) {
      return resolvedFeatureValue;
    }
  }

  for (const key of BOOLEAN_CONFIG_KEYS) {
    const resolvedValue = parseBooleanValue(record[key]);

    if (resolvedValue !== null) {
      return resolvedValue;
    }
  }

  for (const key of NESTED_CONFIG_KEYS) {
    const resolvedValue = resolveFeatureEnabledValue(record[key], featureKeys);

    if (resolvedValue !== null) {
      return resolvedValue;
    }
  }

  return null;
}

export const getWebsiteFeatureConfig = cache(async function getWebsiteFeatureConfig() {
  if (!CLIENT_AREA_CONFIG_API_URL) {
    return {
      clientAreaEnabled: false,
      tawkChatEnabled: false,
    };
  }

  const headers = await getSgAdminApiHeaders();

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
      return {
        clientAreaEnabled: false,
        tawkChatEnabled: false,
      };
    }

    const payload = (await response.json()) as unknown;
    return {
      clientAreaEnabled:
        resolveFeatureEnabledValue(payload, CLIENT_AREA_FEATURE_KEYS) ?? false,
      tawkChatEnabled:
        resolveFeatureEnabledValue(payload, TAWK_CHAT_FEATURE_KEYS) ?? false,
    };
  } catch {
    return {
      clientAreaEnabled: false,
      tawkChatEnabled: false,
    };
  }
});

export async function isClientAreaEnabled() {
  return (await getWebsiteFeatureConfig()).clientAreaEnabled;
}

export async function isTawkChatEnabled() {
  return (await getWebsiteFeatureConfig()).tawkChatEnabled;
}
