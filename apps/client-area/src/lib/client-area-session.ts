import type { AppLocale } from "@/locales";

export const CLIENT_AREA_SESSION_COOKIE = "sgb_client_area_session";
export const CLIENT_AREA_IDENTIFIER_COOKIE = "sgb_client_area_identifier";
export const CLIENT_AREA_LAST_ACTIVITY_COOKIE =
  "sgb_client_area_last_activity";
export const CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY =
  "sgb_client_area_last_activity";
export const CLIENT_AREA_SESSION_VALUE = "demo-authenticated";
export const CLIENT_AREA_REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;
export const CLIENT_AREA_INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;
export const CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS =
  CLIENT_AREA_INACTIVITY_TIMEOUT_MS / 1000;

export function normalizeClientAreaIdentifier(value: string) {
  return value.trim().toLowerCase();
}

export function getClientAreaDashboardHref(locale: AppLocale) {
  return `/${locale}/client-area`;
}

export function getClientAreaLoginHref(locale: AppLocale) {
  return `/${locale}/client-area/login`;
}

export function parseClientAreaLastActivity(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

export function isClientAreaLastActivityActive(
  value?: string | null,
  now = Date.now(),
) {
  const lastActivity = parseClientAreaLastActivity(value);

  if (lastActivity === null) {
    return false;
  }

  return now - lastActivity < CLIENT_AREA_INACTIVITY_TIMEOUT_MS;
}
