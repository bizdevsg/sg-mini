"use client";

import { useState } from "react";

import { ClientAreaAppDownloadModal } from "@/components/molecules/ClientAreaAppDownloadModal";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import {
  getMessages,
  type AppLocale,
} from "@/locales";
import { getAppDownloadModalCopy } from "@/lib/app-download-modal-copy";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";

type AppDownloadModalTriggerButtonProps = {
  locale: AppLocale;
  label: string;
  variant?: "primary" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  visualVariant?: "phone" | "qr";
  className?: string;
};

const variants = {
  primary:
    "border border-[#f4cf73]/70 bg-linear-to-b from-[#FF9600] to-[#FFDE00] text-[#1b1307] shadow-[0_18px_40px_rgba(205,161,58,0.28)] ring-1 ring-[rgba(255,240,196,0.18)] hover:border-[#ffe39d] hover:shadow-[0_22px_48px_rgba(205,161,58,0.38)] hover:brightness-105",
  dark:
    "border border-[rgba(214,166,64,0.28)] bg-[linear-gradient(180deg,rgba(31,24,11,0.96),rgba(12,12,12,0.98))] text-[#f1cb74] shadow-[0_14px_34px_rgba(0,0,0,0.3)] ring-1 ring-[rgba(205,161,58,0.16)] hover:border-[rgba(242,207,120,0.42)] hover:bg-[linear-gradient(180deg,rgba(42,31,12,0.98),rgba(16,16,16,0.98))] hover:text-[#ffe29a]",
  ghost:
    "border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-[#f0ca73] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-[rgba(255,255,255,0.04)] hover:border-[rgba(214,166,64,0.24)] hover:bg-[linear-gradient(180deg,rgba(214,166,64,0.12),rgba(255,255,255,0.04))] hover:text-[#ffe29a]",
};

const sizes = {
  sm: "min-h-10 px-8 text-sm",
  md: "min-h-11 px-7 text-sm",
  lg: "min-h-12 px-9 text-base",
};

export function AppDownloadModalTriggerButton({
  locale,
  label,
  variant = "primary",
  size = "md",
  visualVariant = "phone",
  className = "",
}: AppDownloadModalTriggerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const messages = getMessages(locale);
  const appPromoMessages = messages.appPromoSection;
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const supportHref = resolveLocalizedHref(locale, "/contact-us");
  const modalCopy = getAppDownloadModalCopy(locale);

  return (
    <>
      <button
        type="button"
        className={`inline-flex items-center justify-center gap-2 rounded-full text-center font-semibold tracking-[-0.01em] ${variants[variant]} ${sizes[size]} ${className} transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]`}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </button>

      <ClientAreaAppDownloadModal
        isOpen={isOpen}
        locale={locale}
        title={modalCopy.title}
        subtitle={modalCopy.subtitle}
        description={modalCopy.description}
        closeLabel={modalCopy.closeLabel}
        supportHref={supportHref}
        supportLabel={messages.clientArea.login.forgotPassword}
        googlePlayLink={googlePlayLink}
        googlePlayAlt={appPromoMessages.googlePlayAlt}
        appStoreLink={appStoreLink}
        appStoreAlt={appPromoMessages.appStoreAlt}
        visualVariant={visualVariant}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
