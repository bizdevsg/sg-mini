"use server";

import { describeError } from "@/lib/safe-log";
import { redirect } from "next/navigation";

import {
  clearClientAreaSession,
  getClientAreaLoginHref,
} from "@/lib/client-area-auth";
import { buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import { mmFetch } from "@/lib/sgb-api/mm-fetch";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";
import { isSupportedLocale, type AppLocale } from "@/locales";

function resolveLocale(value: string): AppLocale {
  return isSupportedLocale(value) ? value : "id";
}

function resolveLogoutRedirectPath(locale: AppLocale, value: string) {
  const normalizedPath = value.trim();
  const localizedRootPath = `/${locale}`;
  const localizedClientAreaPath = `/${locale}/client-area`;

  if (!normalizedPath.startsWith("/") || normalizedPath.startsWith("//")) {
    return localizedRootPath;
  }

  if (normalizedPath.startsWith(localizedClientAreaPath)) {
    return getClientAreaLoginHref(locale);
  }

  return normalizedPath.startsWith(localizedRootPath)
    ? normalizedPath
    : localizedRootPath;
}

async function callSgbLogoutBestEffort() {
  try {
    const deviceUuid = await getOrCreateSgbDeviceUuid();
    const headers = new Headers(buildSgbDeviceHeaders(deviceUuid));
    headers.set("Content-Type", "application/json");
    await mmFetch("/sso/logout/v1", {
      method: "POST",
      host: "sso",
      mode: "real",
      headers,
      body: "{}",
    });
  } catch (error) {
    // Best-effort: the local session must be cleared regardless of whether
    // the remote logout call succeeds (e.g. token already expired server-side).
    console.error("[client-area-logout] SGB logout call failed", describeError(error));
  }
}

export async function submitClientAreaLogout(formData: FormData) {
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const redirectPath = resolveLogoutRedirectPath(
    locale,
    String(formData.get("redirectPath") ?? ""),
  );

  await callSgbLogoutBestEffort();
  await clearClientAreaSession();
  redirect(redirectPath);
}
