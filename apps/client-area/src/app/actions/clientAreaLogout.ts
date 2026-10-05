"use server";

import { describeError } from "@/lib/safe-log";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  clearClientAreaSession,
  getClientAreaLoginHref,
} from "@/lib/client-area-auth";
import { CLIENT_AREA_SESSION_COOKIE } from "@/lib/client-area-session";
import { SGB_FLAVOR } from "@/lib/env";
import { callSgbApi } from "@/lib/sgb-api/client";
import { buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import { decryptSgbSession, getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";
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
    const cookieStore = await cookies();
    const raw = cookieStore.get(CLIENT_AREA_SESSION_COOKIE)?.value;
    const session = raw ? await decryptSgbSession(raw) : null;

    if (!session) {
      return;
    }

    const deviceUuid = await getOrCreateSgbDeviceUuid();
    await callSgbApi({
      method: "POST",
      host: "sso",
      path: "/sso/logout/v1",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token: session.token,
      deviceHeaders: buildSgbDeviceHeaders(deviceUuid),
      jsonBody: {},
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
