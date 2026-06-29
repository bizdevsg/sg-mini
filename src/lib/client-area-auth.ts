import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AppLocale } from "@/locales";

const CLIENT_AREA_SESSION_COOKIE = "sgb_client_area_session";
const CLIENT_AREA_SESSION_VALUE = "demo-authenticated";
const CLIENT_AREA_REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;
const CLIENT_AREA_ALLOWED_IDENTIFIERS = new Set([
  "bbh10158",
  "user.sgb@demo-trading.com",
]);
const CLIENT_AREA_DEMO_PASSWORD = "demo12345";

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

export async function createClientAreaSession(rememberMe: boolean) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: CLIENT_AREA_SESSION_COOKIE,
    value: CLIENT_AREA_SESSION_VALUE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: CLIENT_AREA_REMEMBER_ME_MAX_AGE } : {}),
  });
}

export async function clearClientAreaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_AREA_SESSION_COOKIE);
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
