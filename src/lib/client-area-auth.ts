import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AppLocale } from "@/locales";
import {
  CLIENT_AREA_IDENTIFIER_COOKIE,
  CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  CLIENT_AREA_LAST_ACTIVITY_COOKIE,
  CLIENT_AREA_REMEMBER_ME_MAX_AGE,
  CLIENT_AREA_SESSION_COOKIE,
  CLIENT_AREA_SESSION_VALUE,
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
  isClientAreaLastActivityActive,
  normalizeClientAreaIdentifier,
} from "@/lib/client-area-session";
export {
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
} from "@/lib/client-area-session";

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

export function isValidClientAreaCredentials(account: string, password: string) {
  return (
    CLIENT_AREA_ALLOWED_IDENTIFIERS.has(
      normalizeClientAreaIdentifier(account),
    ) &&
    password === CLIENT_AREA_DEMO_PASSWORD
  );
}

export async function hasClientAreaSession() {
  const cookieStore = await cookies();

  const hasAuthenticatedCookie =
    cookieStore.get(CLIENT_AREA_SESSION_COOKIE)?.value ===
    CLIENT_AREA_SESSION_VALUE;

  if (!hasAuthenticatedCookie) {
    return false;
  }

  return isClientAreaLastActivityActive(
    cookieStore.get(CLIENT_AREA_LAST_ACTIVITY_COOKIE)?.value,
  );
}

function resolveClientAreaSessionProfile(identifier?: string | null): ClientAreaSessionProfile {
  const normalizedIdentifier = normalizeClientAreaIdentifier(identifier ?? "");

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
  const hasAuthenticatedCookie =
    cookieStore.get(CLIENT_AREA_SESSION_COOKIE)?.value ===
    CLIENT_AREA_SESSION_VALUE;

  if (
    !hasAuthenticatedCookie ||
    !isClientAreaLastActivityActive(
      cookieStore.get(CLIENT_AREA_LAST_ACTIVITY_COOKIE)?.value,
    )
  ) {
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
  const normalizedAccount = normalizeClientAreaIdentifier(account);
  const now = Date.now().toString();
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
  cookieStore.set({
    name: CLIENT_AREA_LAST_ACTIVITY_COOKIE,
    value: now,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  });
}

export async function clearClientAreaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_AREA_SESSION_COOKIE);
  cookieStore.delete(CLIENT_AREA_IDENTIFIER_COOKIE);
  cookieStore.delete(CLIENT_AREA_LAST_ACTIVITY_COOKIE);
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
