"use server";

import { redirect } from "next/navigation";

import {
  clearClientAreaSession,
  getClientAreaLoginHref,
} from "@/lib/client-area-auth";
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

export async function submitClientAreaLogout(formData: FormData) {
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const redirectPath = resolveLogoutRedirectPath(
    locale,
    String(formData.get("redirectPath") ?? ""),
  );

  await clearClientAreaSession();
  redirect(redirectPath);
}
