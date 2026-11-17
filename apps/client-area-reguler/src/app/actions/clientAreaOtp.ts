"use server";

import { describeError } from "@/lib/safe-log";
import { redirect } from "next/navigation";

import {
  createClientAreaSession,
  getClientAreaDashboardHref,
} from "@/lib/client-area-auth";
import { SGB_FLAVOR } from "@/lib/env";
import {
  callSgbApi,
  isSgbSessionRestartError,
  SgbApiError,
} from "@/lib/sgb-api/client";
import {
  buildSgbDeviceBodyFields,
  buildSgbDeviceHeaders,
} from "@/lib/sgb-api/device";
import {
  clearPendingSgbOtpSession,
  getOrCreateSgbDeviceUuid,
  getPendingSgbOtpSession,
  rotatePendingSgbOtpToken,
} from "@/lib/sgb-session";
import { getMessages, isSupportedLocale, type AppLocale } from "@/locales";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClientAreaOtpState = {
  status: "idle" | "error" | "resend_success";
  message: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveLocale(value: string): AppLocale {
  return isSupportedLocale(value) ? value : "id";
}

// ---------------------------------------------------------------------------
// Send OTP
// ---------------------------------------------------------------------------

export async function submitSendOtp(
  _prevState: ClientAreaOtpState,
  formData: FormData,
): Promise<ClientAreaOtpState> {
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const otp = getMessages(locale).clientArea.otp;
  const pendingSession = await getPendingSgbOtpSession();

  if (!pendingSession) {
    return {
      status: "error",
      message: otp.errorSessionExpired,
    };
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();
  const deviceHeaders = buildSgbDeviceHeaders(deviceUuid);

  try {
    const result = await callSgbApi({
      method: "POST",
      host: "sso",
      path: "/client/send-otp",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token: pendingSession.token,
      deviceHeaders,
      jsonBody: {},
    });

    if (result.newToken) {
      await rotatePendingSgbOtpToken(result.newToken);
    }

    return {
      status: "resend_success",
      message: otp.resendSuccess,
    };
  } catch (error) {
    console.error("[client-area-otp] send-otp call failed", describeError(error));

    if (isSgbSessionRestartError(error)) {
      await clearPendingSgbOtpSession();
      return { status: "error", message: otp.errorSessionExpired };
    }

    if (error instanceof SgbApiError) {
      if (error.kind === "session_expired") {
        await clearPendingSgbOtpSession();
        return { status: "error", message: otp.errorSessionExpired };
      }
      if (error.newToken) {
        await rotatePendingSgbOtpToken(error.newToken);
      }
      return { status: "error", message: error.safeMessage };
    }

    return {
      status: "error",
      message:
        locale === "id"
          ? "Gagal mengirim kode OTP. Coba lagi."
          : "Failed to send OTP code. Please try again.",
    };
  }
}

// ---------------------------------------------------------------------------
// Verify OTP
// ---------------------------------------------------------------------------

// UAT returns { value, type, idOtp, expiredAt }. Naming on verify-otp is
// counter-intuitive (confirmed with the API owner): `otp_code` is the unique id
// generated when the OTP was requested (`idOtp`), while `otp_number` is the
// digits the customer received and typed in.
type SgbAccountOtpResponseData = {
  idOtp?: string;
};

async function getOtpRequestId(
  loginToken: string,
  deviceHeaders: Record<string, string>,
): Promise<{ id: string; token: string } | null> {
  try {
    const res = await callSgbApi<SgbAccountOtpResponseData>({
      method: "GET",
      host: "sso",
      path: "/client/account-otp",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token: loginToken,
      deviceHeaders,
    });

    const id = typeof res.data?.idOtp === "string" ? res.data.idOtp : "";
    const token = res.newToken ?? loginToken;

    if (res.newToken) {
      await rotatePendingSgbOtpToken(res.newToken);
    }

    return id ? { id, token } : null;
  } catch (err) {
    console.error("[client-area-otp] account-otp call failed", describeError(err));

    if (
      isSgbSessionRestartError(err) ||
      (err instanceof SgbApiError && err.kind === "session_expired")
    ) {
      await clearPendingSgbOtpSession();
    } else if (err instanceof SgbApiError && err.newToken) {
      await rotatePendingSgbOtpToken(err.newToken);
    }
  }
  return null;
}

type SgbVerifyOtpResponseData = {
  token?: string;
};

export async function submitVerifyOtp(
  _prevState: ClientAreaOtpState,
  formData: FormData,
): Promise<ClientAreaOtpState> {
  const locale = resolveLocale(String(formData.get("locale") ?? ""));
  const otp = getMessages(locale).clientArea.otp;
  const pendingSession = await getPendingSgbOtpSession();
  const otpCode = String(formData.get("otpCode") ?? "").trim();

  if (!pendingSession) {
    return {
      status: "error",
      message: otp.errorSessionExpired,
    };
  }

  if (!otpCode) {
    return {
      status: "error",
      message: otp.errorRequired,
    };
  }

  const deviceUuid = await getOrCreateSgbDeviceUuid();
  const deviceHeaders = buildSgbDeviceHeaders(deviceUuid);
  const deviceBodyFields = buildSgbDeviceBodyFields(deviceUuid);

  // The unique id of the OTP request — sent as `otp_code` (see note above).
  const otpRequest = await getOtpRequestId(
    pendingSession.token,
    deviceHeaders,
  );

  if (!otpRequest) {
    return {
      status: "error",
      message: otp.errorSessionExpired,
    };
  }

  let finalToken: string | undefined;
  try {
    const verifyResult = await callSgbApi<SgbVerifyOtpResponseData>({
      method: "POST",
      host: "sso",
      path: "/client/verify-otp",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token: otpRequest.token,
      deviceHeaders,
      jsonBody: {
        otp_code: otpRequest.id,
        otp_number: otpCode,
        ...deviceBodyFields,
      },
    });
    finalToken = verifyResult.newToken ?? verifyResult.data?.token;
  } catch (error) {
    console.error("[client-area-otp] verify-otp call failed", describeError(error));

    if (isSgbSessionRestartError(error)) {
      await clearPendingSgbOtpSession();
      return { status: "error", message: otp.errorSessionExpired };
    }

    if (error instanceof SgbApiError) {
      if (error.kind === "session_expired") {
        await clearPendingSgbOtpSession();
      } else if (error.newToken) {
        // Wrong code etc. must not strand the retry on a rotated-away token.
        await rotatePendingSgbOtpToken(error.newToken);
      }

      return {
        status: "error",
        message:
          error.kind === "session_expired"
            ? otp.errorSessionExpired
            : error.kind === "business"
              ? otp.errorInvalidCode
              : error.safeMessage,
      };
    }

    return {
      status: "error",
      message: otp.errorInvalidCode,
    };
  }

  if (!finalToken) {
    console.error(
      "[client-area-otp] verify-otp succeeded without a session token",
    );

    return {
      status: "error",
      message: otp.errorSessionExpired,
    };
  }

  // ── Fetch account list (non-fatal, same as login action) ────────────

  let accounts: unknown = null;
  try {
    const listAccountResult = await callSgbApi({
      method: "GET",
      host: "sso",
      path: "/sso/list-account/v1",
      flavor: SGB_FLAVOR,
      mode: "normal",
      token: finalToken,
      deviceHeaders,
    });
    accounts = listAccountResult.data;
    finalToken = listAccountResult.newToken ?? finalToken;
  } catch (error) {
    if (
      isSgbSessionRestartError(error) ||
      (error instanceof SgbApiError && error.kind === "session_expired")
    ) {
      await clearPendingSgbOtpSession();
      return { status: "error", message: otp.errorSessionExpired };
    }

    if (error instanceof SgbApiError && error.newToken) {
      finalToken = error.newToken;
    }

    console.error("[client-area-otp] list-account call failed", describeError(error));
  }

  await createClientAreaSession(
    { token: finalToken, email: pendingSession.email, accounts },
    pendingSession.rememberMe,
  );
  await clearPendingSgbOtpSession();
  redirect(getClientAreaDashboardHref(locale));
}
