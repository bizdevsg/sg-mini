"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { AppLocale } from "@/locales";
import { StoreBadgeLink } from "@/components/atoms/StoreBadgeLink";

type ClientAreaAppDownloadModalProps = {
  isOpen: boolean;
  locale: AppLocale;
  title: string;
  subtitle: string;
  description: string;
  closeLabel: string;
  supportHref: string;
  supportLabel: string;
  googlePlayLink: string;
  googlePlayAlt: string;
  appStoreLink: string;
  appStoreAlt: string;
  visualVariant?: "phone" | "qr";
  onClose: () => void;
};

const MODAL_ANIMATION_DURATION_MS = 220;

function buildQrCodeUrl(value: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}`;
}

export function ClientAreaAppDownloadModal({
  isOpen,
  locale,
  title,
  subtitle,
  description,
  closeLabel,
  supportHref,
  supportLabel,
  googlePlayLink,
  googlePlayAlt,
  appStoreLink,
  appStoreAlt,
  visualVariant = "phone",
  onClose,
}: ClientAreaAppDownloadModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const scanLabel =
    locale === "id"
      ? "Scan QR Code untuk membuka store sesuai device"
      : "Scan the QR code to open the correct store for your device";
  const smartDownloadUrl =
    typeof window === "undefined"
      ? ""
      : new URL(
        `/api/app-download?locale=${locale}`,
        window.location.origin,
      ).toString();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      return;
    }

    if (!shouldRender) {
      return;
    }

    setIsClosing(true);
    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
    }, MODAL_ANIMATION_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-sm ${isClosing
        ? "animate-[pengumuman-modal-overlay-out_220ms_ease_forwards]"
        : "animate-[pengumuman-modal-overlay-in_220ms_ease_forwards]"
        }`}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-app-modal-title"
        className={`w-full max-w-md rounded-[1.5rem] border border-white/10 bg-[rgba(12,12,16,0.96)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-7 ${isClosing
          ? "animate-[pengumuman-modal-panel-out_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          : "animate-[pengumuman-modal-panel-in_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex items-start justify-between gap-4 mb-5">
          {/* <LogoMark locale={locale} /> */}

          <button
            type="button"
            aria-label={closeLabel}
            className="absolute right-0 top-0 flex size-10 items-center cursor-pointer justify-center rounded-full border border-white/10 text-sm font-bold text-gray-300 transition-colors hover:border-amber-500/40 hover:text-white"
            onClick={onClose}
          >
            X
          </button>
        </div>

        {visualVariant === "phone" ? (
          <div className="mt-6">
            <Image
              src="/assets/HP Solid-3.png"
              alt="Solid Gold Berjangka App"
              width={400}
              height={300}
              className="mx-auto mb-2 h-auto w-full max-w-[320px] object-contain"
            />
          </div>
        ) : null}

        <h2
          id="download-app-modal-title"
          className="text-[1.5rem] font-extrabold tracking-[-0.03em] text-white text-center"
        >
          <span>{title}</span><br />
          <span>{subtitle}</span>
        </h2>

        {visualVariant === "qr" ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
              <img
                src={buildQrCodeUrl(smartDownloadUrl)}
                alt="App Download QR Code"
                width={220}
                height={220}
                className="block h-[220px] w-[220px]"
              />
            </div>
          </div>
        ) : null}

        <p className="mt-4 text-sm leading-6 text-gray-300 text-center">{description}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <StoreBadgeLink
            href={googlePlayLink}
            alt={googlePlayAlt}
            imageSrc="/assets/gp-button.png"
            sizes="(max-width: 640px) 160px, 180px"
            imageClassName="h-auto w-full object-contain"
            className="inline-flex"
          />

          <StoreBadgeLink
            href={appStoreLink}
            alt={appStoreAlt}
            imageSrc="/assets/as-button.png"
            sizes="(max-width: 640px) 160px, 180px"
            imageClassName="h-auto w-full object-contain"
            className="inline-flex"
          />
        </div>
      </div>
    </div>
  );
}
