import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AppLocale } from "@/locales";
import {
  CLIENT_AREA_LAST_ACTIVITY_COOKIE,
  CLIENT_AREA_SESSION_COOKIE,
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
} from "@/lib/client-area-session";
export {
  getClientAreaDashboardHref,
  getClientAreaLoginHref,
} from "@/lib/client-area-session";

export function isClientAreaSessionConfigured() {
  return false;
}

export type ClientAreaSessionProfile = {
  accountId: string;
  displayName: string;
  email: string;
};

export type ClientAreaSessionState = {
  isAuthenticated: boolean;
  profile: ClientAreaSessionProfile | null;
};

export function isValidClientAreaCredentials(account: string, password: string) {
  void account;
  void password;
  return false;
}

export async function hasClientAreaSession() {
  return (await getClientAreaSessionState()).isAuthenticated;
}

export async function getClientAreaSessionProfile() {
  return (await getClientAreaSessionState()).profile;
}

export async function getClientAreaSessionState(): Promise<ClientAreaSessionState> {
  return {
    isAuthenticated: false,
    profile: null,
  };
}

export async function createClientAreaSession(
  account: string,
  rememberMe: boolean,
) {
  void account;
  void rememberMe;
  throw new Error("Client Area authentication API is not configured.");
}

export async function clearClientAreaSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_AREA_SESSION_COOKIE);
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
