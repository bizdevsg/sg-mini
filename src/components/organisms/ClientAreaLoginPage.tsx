"use client";

import Script from "next/script";
import { useActionState, useEffect, useState } from "react";

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
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";

declare global {
  interface Window {
    grecaptcha?: {
      reset: () => void;
    };
  }
}

type ClientAreaLoginPageProps = {
  isRecaptchaEnabled: boolean;
  locale: AppLocale;
};

const INITIAL_STATE: ClientAreaLoginState = {
  status: "idle",
  message: "",
};

export function ClientAreaLoginPage({
  isRecaptchaEnabled,
  locale,
}: ClientAreaLoginPageProps) {
  const { appPromoSection: appPromoMessages, clientArea } = getMessages(locale);
  const login = clientArea.login;
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const downloadModalCopy = getAppDownloadModalCopy(locale);
  const supportHref = resolveLocalizedHref(locale, "/contact-us");
  const [state, formAction, pending] = useActionState(
    submitClientAreaLogin,
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
    if (!isRecaptchaEnabled || state.status !== "error") {
      return;
    }

    window.grecaptcha?.reset();
  }, [isRecaptchaEnabled, state]);

  useEffect(() => {
    if (state.status !== "error") {
      return;
    }

    setIsErrorModalOpen(true);
  }, [state]);

  return (
    <div
      className="bg-black bg-top bg-no-repeat py-16 md:py-20"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      {isRecaptchaEnabled ? (
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="afterInteractive"
        />
      ) : null}

      <SectionContainer className="relative">
        <div className="-mx-4 flex min-h-[520px] items-stretch overflow-hidden sm:-mx-6 lg:-mx-10 lg:min-h-[580px]">
          <ClientAreaLoginFormPanel
            locale={locale}
            login={login}
            supportHref={supportHref}
            isRecaptchaEnabled={isRecaptchaEnabled}
            pending={pending}
            showPassword={showPassword}
            formAction={formAction}
            onTogglePassword={() => setShowPassword((value) => !value)}
            onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
          />

          <ClientAreaLoginVisualPanel
            googlePlayLink={googlePlayLink}
            googlePlayAlt={appPromoMessages.googlePlayAlt}
            appStoreLink={appStoreLink}
            appStoreAlt={appPromoMessages.appStoreAlt}
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
