"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { StoreBadgeLink } from "@/components/atoms/StoreBadgeLink";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";
import { getMessages, type AppLocale } from "@/locales";

type FundTransferAction = "deposit" | "withdrawal";

type ClientAreaFundTransferUnavailableModalProps = {
  action: FundTransferAction;
  isOpen: boolean;
  locale: AppLocale;
  onClose: () => void;
};

const MODAL_ANIMATION_DURATION_MS = 220;

export function ClientAreaFundTransferUnavailableModal({
  action,
  isOpen,
  locale,
  onClose,
}: ClientAreaFundTransferUnavailableModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const messages = getMessages(locale);
  const modalCopy = messages.clientArea.fundTransferModal;
  const appPromoMessages = messages.appPromoSection;
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const title =
    action === "deposit"
      ? modalCopy.depositTitle
      : modalCopy.withdrawalTitle;
  const description =
    action === "deposit"
      ? modalCopy.depositDescription
      : modalCopy.withdrawalDescription;

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

  if (!shouldRender || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[140] flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-sm ${isClosing
        ? "animate-[pengumuman-modal-overlay-out_220ms_ease_forwards]"
        : "animate-[pengumuman-modal-overlay-in_220ms_ease_forwards]"
        }`}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fund-transfer-unavailable-title"
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-800/70 px-6 pb-7 pt-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:px-10 sm:pb-10 sm:pt-8 ${isClosing
          ? "animate-[pengumuman-modal-panel-out_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          : "animate-[pengumuman-modal-panel-in_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label={modalCopy.closeLabel}
          className="absolute right-4 top-4 flex size-12 z-10 items-center justify-center rounded-full text-white transition hover:bg-white/6 sm:right-6 sm:top-6 cursor-pointer"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="relative mt-2 w-full max-w-[360px] sm:max-w-[430px]">
            <Image
              src="/assets/sorry-image.png"
              alt={title}
              width={320}
              height={392}
              className="mx-auto h-auto w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
              priority={false}
            />
          </div>

          <h2
            id="fund-transfer-unavailable-title"
            className="mt-6 max-w-2xl text-3xl font-black tracking-[-0.04em] text-white"
          >
            {title}
          </h2>

          <p className="mt-3 max-w-3xl text-sm text-zinc-200">
            {description}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
            <StoreBadgeLink
              href={googlePlayLink}
              alt={appPromoMessages.googlePlayAlt}
              imageSrc="/assets/gp-button.png"
              sizes="(max-width: 640px) 180px, 210px"
              imageClassName="h-auto w-full max-w-[130px] object-contain sm:max-w-[150px]"
              className="inline-flex"
            />

            <StoreBadgeLink
              href={appStoreLink}
              alt={appPromoMessages.appStoreAlt}
              imageSrc="/assets/as-button.png"
              sizes="(max-width: 640px) 180px, 210px"
              imageClassName="h-auto w-full max-w-[80px] object-contain sm:max-w-[100px]"
              className="inline-flex"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
