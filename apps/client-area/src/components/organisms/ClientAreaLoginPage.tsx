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
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
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
};

const INITIAL_STATE: ClientAreaLoginState = {
  status: "idle",
  message: "",
};

export function ClientAreaLoginPage({
  isRecaptchaEnabled,
  locale,
  recaptchaSiteKey,
}: ClientAreaLoginPageProps) {
  const { appPromoSection: appPromoMessages, clientArea } = getMessages(locale);
  const login = clientArea.login;
  const otpMessages = clientArea.otp;
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const downloadModalCopy = getAppDownloadModalCopy(locale);
  const supportHref = resolveLocalizedHref(locale, "/contact-us");
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
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const errorModalCopy =
    locale === "id"
      ? {
        title: "Login Gagal",
        closeLabel: "COBA LAGI",
      }
      : {
        title: "Login Failed",
        closeLabel: "TRY AGAIN",
      };

  // ── OTP state ──────────────────────────────────────────────────────

  const [otpMode, setOtpMode] = useState(false);
  const [otpLoginToken, setOtpLoginToken] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpRememberMe, setOtpRememberMe] = useState(false);

  useEffect(() => {
    if (state.status === "otp_required") {
      setOtpMode(true);
      setOtpLoginToken(state.loginToken ?? "");
      setOtpEmail(state.email ?? "");
      setOtpRememberMe(state.rememberMe ?? false);
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
    setOtpLoginToken("");
    setOtpEmail("");
    setOtpRememberMe(false);
  }

  return (
    <div
      className="flex min-h-0 flex-1 overflow-hidden bg-black bg-top bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <SectionContainer className="relative flex w-full max-w-8xl flex-1 items-center overflow-visible py-6 sm:py-8 lg:!pl-8 lg:!pr-12 xl:py-10 xl:!pl-6 xl:!pr-20 2xl:!pl-8 2xl:!pr-24">
        {/* VISUAL — BELAKANG */}
        <div className="absolute inset-y-0 left-[26rem] right-12 z-10 hidden xl:block 2xl:left-[28rem] 2xl:right-16">
          <ClientAreaLoginVisualPanel
            googlePlayLink={googlePlayLink}
            googlePlayAlt={appPromoMessages.googlePlayAlt}
            appStoreLink={appStoreLink}
            appStoreAlt={appPromoMessages.appStoreAlt}
          />
        </div>

        {/* FORM — DEPAN */}
        <div className="relative z-20 flex w-full items-center justify-start">
          {otpMode ? (
            <ClientAreaOtpFormPanel
              locale={locale}
              otp={otpMessages}
              loginToken={otpLoginToken}
              email={otpEmail}
              rememberMe={otpRememberMe}
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
              supportHref={supportHref}
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
        supportHref={supportHref}
        supportLabel={login.forgotPassword}
        googlePlayLink={googlePlayLink}
        googlePlayAlt={appPromoMessages.googlePlayAlt}
        appStoreLink={appStoreLink}
        appStoreAlt={appPromoMessages.appStoreAlt}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      <ClientAreaLoginErrorModal
        isOpen={isErrorModalOpen}
        title={errorModalCopy.title}
        message={state.message}
        closeLabel={errorModalCopy.closeLabel}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
}
