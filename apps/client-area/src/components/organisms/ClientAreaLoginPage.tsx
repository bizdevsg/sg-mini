"use client";

import Script from "next/script";
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
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import {
  getMessages,
  type AppLocale,
} from "@/locales";
import { getAppDownloadModalCopy } from "@/lib/app-download-modal-copy";
import { CLIENT_AREA_LOGIN_RECAPTCHA_ACTION } from "@/lib/recaptcha.shared";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";

declare global {
  interface Window {
    grecaptcha?: {
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

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
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const downloadModalCopy = getAppDownloadModalCopy(locale);
  const supportHref = resolveLocalizedHref(locale, "/contact-us");
  const loginAction = useCallback(
    async (prevState: ClientAreaLoginState, formData: FormData) => {
      if (!isRecaptchaEnabled) {
        return submitClientAreaLogin(prevState, formData);
      }

      const recaptcha = window.grecaptcha;

      if (!recaptcha) {
        return {
          status: "error" as const,
          message: login.errorCaptchaFailed,
        };
      }

      try {
        await new Promise<void>((resolve) => recaptcha.ready(resolve));
        const token = await recaptcha.execute(recaptchaSiteKey, {
          action: CLIENT_AREA_LOGIN_RECAPTCHA_ACTION,
        });

        if (!token) {
          throw new Error("reCAPTCHA returned an empty token.");
        }

        formData.set("g-recaptcha-response", token);
        return submitClientAreaLogin(prevState, formData);
      } catch {
        return {
          status: "error" as const,
          message: login.errorCaptchaFailed,
        };
      }
    },
    [isRecaptchaEnabled, login.errorCaptchaFailed, recaptchaSiteKey],
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

  useEffect(() => {
    if (state.status !== "error") {
      return;
    }

    setIsErrorModalOpen(true);
  }, [state]);

  return (
    <div
      className="flex min-h-0 flex-1 overflow-hidden bg-black bg-top bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      {isRecaptchaEnabled ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`}
          strategy="afterInteractive"
        />
      ) : null}

      <SectionContainer className="relative flex w-full max-w-8xl flex-1 items-center overflow-visible py-6 sm:py-8 lg:px-12 xl:py-10 2xl:px-14">
        {/* VISUAL — BELAKANG */}
        <div className="absolute inset-y-[-5rem] left-[15rem] right-[-8rem] z-10 hidden overflow-visible xl:block">
          <ClientAreaLoginVisualPanel
            googlePlayLink={googlePlayLink}
            googlePlayAlt={appPromoMessages.googlePlayAlt}
            appStoreLink={appStoreLink}
            appStoreAlt={appPromoMessages.appStoreAlt}
          />
        </div>

        {/* FORM — DEPAN */}
        <div className="relative z-20 flex w-full items-center justify-start">
          <ClientAreaLoginFormPanel
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
