"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { LocaleOptionLink } from "@/components/molecules/LocaleOptionLink";
import type { AppLocale } from "@/locales";

export type LocaleSwitcherOption = {
  alt: string;
  href: string;
  iconSrc: string;
  value: AppLocale;
};

type LocaleSwitcherDialogProps = {
  activeLabel: string;
  currentLocale: AppLocale;
  dialogId: string;
  isOpen: boolean;
  onClose: () => void;
  options: LocaleSwitcherOption[];
  title: string;
};

export function LocaleSwitcherDialog({
  activeLabel,
  currentLocale,
  dialogId,
  isOpen,
  onClose,
  options,
  title,
}: LocaleSwitcherDialogProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      id={dialogId}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-[90] transition-all duration-200 ${
        isOpen
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label={title}
        onClick={onClose}
        className="absolute inset-0 bg-black/72 backdrop-blur-md"
      />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[rgba(12,12,12,0.96)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.56)] backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/8 pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-500/90">
              {title}
            </p>

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <span className="text-lg leading-none">x</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <LocaleOptionLink
                key={option.value}
                activeLabel={activeLabel}
                href={option.href}
                iconAlt={option.alt}
                iconSrc={option.iconSrc}
                isActive={option.value === currentLocale}
                localeCode={option.value}
                onClick={onClose}
                title={option.alt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
