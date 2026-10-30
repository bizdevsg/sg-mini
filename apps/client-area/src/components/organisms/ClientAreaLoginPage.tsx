"use client";

import { useActionState, useCallback, useEffect, useState } from "react";

import {
  submitClientAreaLogin,
  type ClientAreaLoginState,
} from "@/app/actions/clientAreaLogin";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ClientAreaAppDownloadModal } from "@/components/molecules/ClientAreaAppDownloadModal";
import { ClientAreaLoginErrorModal } from "@/components/molecules/ClientAreaLoginErrorModal";
import { ClientAreaLoginFormPanel } from "@/components/molecules/ClientAreaLoginFormPanel";
import { ClientAreaLoginVisualPanel } from "@/components/molecules/ClientAreaLoginVisualPanel";
import { ClientAreaOtpFormPanel } from "@/components/molecules/ClientAreaOtpFormPanel";
import { ClientAreaRecaptchaV2 } from "@/components/molecules/ClientAreaRecaptchaV2";
import {
  getMessages,
  type AppLocale,
} from "@/locales";
import { getAppDownloadModalCopy } from "@/lib/app-download-modal-copy";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";

type ClientAreaLoginPageProps = {
  isRecaptchaEnabled: boolean;
  locale: AppLocale;
  recaptchaSiteKey: string;
  sessionExpiredMessage?: string;
};

const INITIAL_STATE: ClientAreaLoginState = {
  status: "idle",
  message: "",
};

export function ClientAreaLoginPage({
  isRecaptchaEnabled,
  locale,
  recaptchaSiteKey,
  sessionExpiredMessage,
}: ClientAreaLoginPageProps) {
  const { appPromoSection: appPromoMessages, clientArea } = getMessages(locale);
  const login = clientArea.login;
  const otpMessages = clientArea.otp;
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const downloadModalCopy = getAppDownloadModalCopy(locale);
  // Bumped after every attempt: a reCAPTCHA token works only once, so the widget
  // is remounted to give the next attempt a fresh checkbox.
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const loginAction = useCallback(
    async (prevState: ClientAreaLoginState, formData: FormData) => {
      if (!isRecaptchaEnabled) {
        return submitClientAreaLogin(prevState, formData);
      }

      // The v2 checkbox sits inside the form and puts its token in this field.
      const token = String(formData.get("g-recaptcha-response") ?? "").trim();

      if (!token) {
        return {
          status: "error" as const,
          message: login.errorCaptchaRequired,
        };
      }

      try {
        return await submitClientAreaLogin(prevState, formData);
      } finally {
        setCaptchaResetKey((key) => key + 1);
      }
    },
    [isRecaptchaEnabled, login.errorCaptchaRequired],
  );
  const [state, formAction, pending] = useActionState(
    loginAction,
    INITIAL_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(
    Boolean(sessionExpiredMessage),
  );
  const isSessionExpired = !state.message && Boolean(sessionExpiredMessage);
  const errorModalCopy = {
    title: isSessionExpired ? login.sessionExpiredTitle : login.errorModalTitle,
    closeLabel: login.retryLabel,
  };

  // ── OTP state ──────────────────────────────────────────────────────

  const [otpMode, setOtpMode] = useState(false);

  useEffect(() => {
    if (state.status === "otp_required") {
      setOtpMode(true);
      return;
    }

    if (state.status === "error") {
      setIsErrorModalOpen(true);
    }
  }, [state]);

  function handleBackToLogin() {
    // The earlier token was spent on the login that led to the OTP step.
    setCaptchaResetKey((key) => key + 1);
    setOtpMode(false);
  }

  return (
    <div
      className="flex min-h-0 flex-1 overflow-hidden bg-black bg-top bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/BCG.webp')",
      }}
    >
      <SectionContainer className="relative flex w-full max-w-8xl flex-1 items-center overflow-visible py-6 sm:py-8 lg:!pl-8 lg:!pr-12 xl:py-10 xl:!pl-6 xl:!pr-20 2xl:!pl-8 2xl:!pr-24">
        {/* VISUAL — BELAKANG */}
        <div className="absolute inset-y-0 left-[26rem] right-12 z-10 hidden xl:block 2xl:left-[28rem] 2xl:right-16">
          <ClientAreaLoginVisualPanel />
        </div>

        {/* FORM — DEPAN */}
        <div className="relative z-20 flex w-full items-center justify-start">
          {otpMode ? (
            <ClientAreaOtpFormPanel
              locale={locale}
              otp={otpMessages}
              onBackToLogin={handleBackToLogin}
            />
          ) : (
            <ClientAreaLoginFormPanel
              captcha={
                isRecaptchaEnabled ? (
                  <ClientAreaRecaptchaV2
                    key={captchaResetKey}
                    siteKey={recaptchaSiteKey}
                  />
                ) : null
              }
              locale={locale}
              login={login}
              pending={pending}
              showPassword={showPassword}
              formAction={formAction}
              onTogglePassword={() =>
                setShowPassword((value) => !value)
              }
              onOpenDownloadModal={() =>
                setIsDownloadModalOpen(true)
              }
            />
          )}
        </div>
      </SectionContainer>

      <ClientAreaAppDownloadModal
        isOpen={isDownloadModalOpen}
        locale={locale}
        title={downloadModalCopy.title}
        subtitle={downloadModalCopy.subtitle}
        description={downloadModalCopy.description}
        closeLabel={downloadModalCopy.closeLabel}
        googlePlayLink={googlePlayLink}
        googlePlayAlt={appPromoMessages.googlePlayAlt}
        appStoreLink={appStoreLink}
        appStoreAlt={appPromoMessages.appStoreAlt}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      <ClientAreaLoginErrorModal
        isOpen={isErrorModalOpen}
        title={errorModalCopy.title}
        message={state.message || sessionExpiredMessage || ""}
        closeLabel={errorModalCopy.closeLabel}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
}
