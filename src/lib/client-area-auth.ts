import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AppLocale } from "@/locales";

const CLIENT_AREA_SESSION_COOKIE = "sgb_client_area_session";
const CLIENT_AREA_IDENTIFIER_COOKIE = "sgb_client_area_identifier";
const CLIENT_AREA_SESSION_VALUE = "demo-authenticated";
const CLIENT_AREA_REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;
const CLIENT_AREA_ALLOWED_IDENTIFIERS = new Set([
  "bbh10158",
  "user.sgb@demo-trading.com",
]);
const CLIENT_AREA_DEMO_PASSWORD = "demo12345";

export type ClientAreaSessionProfile = {
  accountId: string;
  displayName: string;
  email: string;
};

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

export function getClientAreaDashboardHref(locale: AppLocale) {
  return `/${locale}/client-area`;
}

export function getClientAreaLoginHref(locale: AppLocale) {
  return `/${locale}/client-area/login`;
}

export function isValidClientAreaCredentials(account: string, password: string) {
  return (
    CLIENT_AREA_ALLOWED_IDENTIFIERS.has(normalizeIdentifier(account)) &&
    password === CLIENT_AREA_DEMO_PASSWORD
  );
}

export async function hasClientAreaSession() {
  const cookieStore = await cookies();

  return (
    cookieStore.get(CLIENT_AREA_SESSION_COOKIE)?.value ===
    CLIENT_AREA_SESSION_VALUE
  );
}

function resolveClientAreaSessionProfile(identifier?: string | null): ClientAreaSessionProfile {
  const normalizedIdentifier = normalizeIdentifier(identifier ?? "");

  if (normalizedIdentifier === "user.sgb@demo-trading.com") {
    return {
      accountId: "BBH10158",
      displayName: "Demo User",
      email: "user.sgb@demo-trading.com",
    };
  }

  return {
    accountId: "BBH10158",
    displayName: "Demo User",
    email: "user.sgb@demo-trading.com",
  };
}

export async function getClientAreaSessionProfile() {
  const cookieStore = await cookies();
  const hasSession =
    cookieStore.get(CLIENT_AREA_SESSION_COOKIE)?.value ===
    CLIENT_AREA_SESSION_VALUE;

  if (!hasSession) {
    return null;
  }

  return resolveClientAreaSessionProfile(
    cookieStore.get(CLIENT_AREA_IDENTIFIER_COOKIE)?.value,
  );
}

export async function createClientAreaSession(
  account: string,
  rememberMe: boolean,
) {
  const cookieStore = await cookies();
  const normalizedAccount = normalizeIdentifier(account);
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: CLIENT_AREA_REMEMBER_ME_MAX_AGE } : {}),
  };

  cookieStore.set({
    name: CLIENT_AREA_SESSION_COOKIE,
    value: CLIENT_AREA_SESSION_VALUE,
    ...cookieOptions,
  });
  cookieStore.set({
    name: CLIENT_AREA_IDENTIFIER_COOKIE,
    value: normalizedAccount,
    ...cookieOptions,
  });
}

export async function clearClientAreaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_AREA_SESSION_COOKIE);
  cookieStore.delete(CLIENT_AREA_IDENTIFIER_COOKIE);
}

export async function requireClientAreaSession(locale: AppLocale) {
  if (!(await hasClientAreaSession())) {
    redirect(getClientAreaLoginHref(locale));
  }
}

export async function redirectAuthenticatedClientAreaUser(locale: AppLocale) {
  if (await hasClientAreaSession()) {
    redirect(getClientAreaDashboardHref(locale));
  }
}
