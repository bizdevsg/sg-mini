"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  createClientAreaSession,
  getClientAreaDashboardHref,
  isClientAreaSessionConfigured,
  isValidClientAreaCredentials,
} from "@/lib/client-area-auth";
import { isClientAreaEnabled } from "@/lib/client-area-config";
import {
  isRecaptchaEnabled,
  resolveRequestHostname,
  verifyRecaptchaToken,
} from "@/lib/recaptcha";
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
  const requestHeaders = await headers();
  const requestHostname = resolveRequestHostname(requestHeaders);
  const account = String(formData.get("account") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const recaptchaToken = String(formData.get("g-recaptcha-response") ?? "").trim();
  const rememberMe = formData.get("rememberMe") === "on";

  if (!(await isClientAreaEnabled())) {
    return {
      status: "error",
      message: login.errorUnavailable,
    };
  }

  if (!account || !password) {
    return {
      status: "error",
      message: login.errorRequired,
    };
  }

  if (isRecaptchaEnabled(requestHostname)) {
    if (!recaptchaToken) {
      return {
        status: "error",
        message: login.errorCaptchaRequired,
      };
    }

    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);

    if (!recaptchaResult) {
      return {
        status: "error",
        message: login.errorCaptchaFailed,
      };
    }
  }

  if (!isValidClientAreaCredentials(account, password)) {
    return {
      status: "error",
      message: login.errorInvalidCredentials,
    };
  }

  if (!isClientAreaSessionConfigured()) {
    return {
      status: "error",
      message: login.errorSessionConfiguration,
    };
  }

  await createClientAreaSession(account, rememberMe);
  redirect(getClientAreaDashboardHref(locale));
}
