"use server";

import { getMessages, isSupportedLocale, type AppLocale } from "@/locales";

export type ClientAreaLoginState = {
  status: "idle" | "error";
  message: string;
};

function resolveLocale(value: string): AppLocale {
  return isSupportedLocale(value) ? value : "id";
}

export async function submitClientAreaLogin(
  _prevState: ClientAreaLoginState,
  formData: FormData,
): Promise<ClientAreaLoginState> {
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const login = getMessages(locale).clientArea.login;

  // Account authentication requires the real backend API.
  return {
    status: "error",
    message: login.errorUnavailable,
  };
}
