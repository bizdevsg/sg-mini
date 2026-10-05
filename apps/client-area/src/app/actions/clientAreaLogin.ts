"use server";

import { describeError } from "@/lib/safe-log";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  createClientAreaSession,
  getClientAreaDashboardHref,
} from "@/lib/client-area-auth";
import { CLIENT_AREA_SKIP_OTP, SGB_FLAVOR } from "@/lib/env";
import { isRecaptchaEnabled, resolveRequestHostname } from "@/lib/recaptcha";
import { callSgbApi, SgbApiError } from "@/lib/sgb-api/client";
import { encryptSgbPassword } from "@/lib/sgb-api/crypto";
import {
  buildSgbDeviceBodyFields,
  buildSgbDeviceHeaders,
} from "@/lib/sgb-api/device";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";
import { getMessages, isSupportedLocale, type AppLocale } from "@/locales";

export type ClientAreaLoginState = {
  status: "idle" | "error" | "otp_required";
  message: string;
  /** Temporary token from login, used during OTP verification. */
  loginToken?: string;
  /** Email used for login — forwarded to OTP verify so it can create the session. */
  email?: string;
  /** Carry rememberMe preference through to the OTP step. */
  rememberMe?: boolean;
};

function resolveLocale(value: string): AppLocale {
  return isSupportedLocale(value) ? value : "id";
}

type SgbLoginResponseData = {
  token?: string;
};

function requiresOtpAuthorization(message: string | undefined) {
  if (!message) {
    return false;
  }

  return /\b(?:need|needs|require|requires|required)\s+otp(?:\s+authorization)?\b/i.test(
    message,
  );
}

export async function submitClientAreaLogin(
  _prevState: ClientAreaLoginState,
  formData: FormData,
): Promise<ClientAreaLoginState> {
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const login = getMessages(locale).clientArea.login;
  const requestHeaders = await headers();
  const requestHostname = resolveRequestHostname(requestHeaders);
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const recaptchaToken = String(formData.get("g-recaptcha-response") ?? "").trim();
  const rememberMe = formData.get("rememberMe") === "on";

  if (!email || !password) {
    return {
      status: "error",
      message: login.errorRequired,
    };
  }

  // A reCAPTCHA token can only be verified once. The SGB SSO API verifies
  // `token_captcha` itself, so the token is forwarded untouched instead of being
  // verified here first (a second verification fails as a duplicate).
  if (isRecaptchaEnabled(requestHostname) && !recaptchaToken) {
    return {
      status: "error",
      message: login.errorCaptchaRequired,
    };
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();
  const deviceHeaders = buildSgbDeviceHeaders(deviceUuid);
  const deviceBodyFields = buildSgbDeviceBodyFields(deviceUuid);

  let token: string | undefined;
  let newToken: string | undefined;
  let otpRequired = false;
  try {
    const loginResult = await callSgbApi<SgbLoginResponseData>({
      method: "POST",
      host: "sso",
      path: "/sso/login/v1",
      flavor: SGB_FLAVOR,
      mode: "normal",
      deviceHeaders,
      jsonBody: {
        email,
        password: encryptSgbPassword(password),
        token_captcha: recaptchaToken,
        ...deviceBodyFields,
      },
    });
    token = loginResult.data?.token;
    newToken = loginResult.newToken;
    otpRequired = requiresOtpAuthorization(loginResult.message);
    const loginData = (loginResult.data ?? {}) as Record<string, unknown>;
    console.info(
      "[client-area-login] SGB login response — message=" +
        JSON.stringify(loginResult.message) +
        ", otpRequired(message)=" +
        otpRequired +
        ", data.otpRequired=" +
        String(loginData.otpRequired) +
        ", data.verify=" +
        String(loginData.verify) +
        ", tokenPresent=" +
        Boolean(token) +
        ", skipOtpFlag=" +
        CLIENT_AREA_SKIP_OTP,
    );
  } catch (error) {
    console.error("[client-area-login] SGB login call failed", describeError(error));

    if (error instanceof SgbApiError && /captcha/i.test(error.message)) {
      return {
        status: "error",
        message: login.errorCaptchaFailed,
      };
    }

    return {
      status: "error",
      message:
        error instanceof SgbApiError
          ? error.safeMessage
          : login.errorInvalidCredentials,
    };
  }

  if ((otpRequired || !token) && CLIENT_AREA_SKIP_OTP) {
    console.warn(
      "[client-area-login] CLIENT_AREA_SKIP_OTP active — OTP skipped, " +
        "creating dev-only session with a placeholder token.",
    );
    await createClientAreaSession(
      { token: "dev-skip-otp", email, accounts: null },
      rememberMe,
    );
    redirect(getClientAreaDashboardHref(locale));
  }

  if (otpRequired || !token) {
    // UAT can return a temporary data.token together with a successful
    // "need OTP Authorization" message. That token must only authorize the
    // OTP endpoints and must never be promoted to an authenticated session.
    const preliminaryToken = token ?? newToken ?? "";
    console.info(
      "[client-area-login] Login requires OTP verification — " +
        "routing to OTP verification flow. Preliminary token present: " +
        Boolean(preliminaryToken),
    );

    return {
      status: "otp_required",
      message: "",
      loginToken: preliminaryToken,
      email,
      rememberMe,
    };
  }

  let accounts: unknown = null;
  try {
    const listAccountResult = await callSgbApi({
      method: "GET",
      host: "sso",
      path: "/sso/list-account/v1",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token,
      deviceHeaders,
    });
    accounts = listAccountResult.data;
  } catch (error) {
    // Non-fatal — the session is still created without account list data.
    console.error("[client-area-login] list-account call failed", describeError(error));
  }

  await createClientAreaSession({ token, email, accounts }, rememberMe);
  redirect(getClientAreaDashboardHref(locale));
}
