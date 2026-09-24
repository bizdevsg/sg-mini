"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { StoreBadgeLink } from "@/components/atoms/StoreBadgeLink";

export type ClientAreaSignalTransactionModalTone = "buy" | "sell";

type ClientAreaSignalTransactionModalProps = {
  isOpen: boolean;
  tone: ClientAreaSignalTransactionModalTone;
  badgeLabel: string;
  title: string;
  description: string;
  closeLabel: string;
  googlePlayLink: string;
  googlePlayAlt: string;
  appStoreLink: string;
  appStoreAlt: string;
  onClose: () => void;
};

const MODAL_ANIMATION_DURATION_MS = 220;

const TONE_STYLES: Record<
  ClientAreaSignalTransactionModalTone,
  { badge: string; ring: string }
> = {
  buy: {
    badge: "border-green-500/30 bg-green-500/10 text-green-400",
    ring: "ring-green-500/25",
  },
  sell: {
    badge: "border-red-500/30 bg-red-500/10 text-red-400",
    ring: "ring-red-500/25",
  },
};

export function ClientAreaSignalTransactionModal({
  isOpen,
  tone,
  badgeLabel,
  title,
  description,
  closeLabel,
  googlePlayLink,
  googlePlayAlt,
  appStoreLink,
  appStoreAlt,
  onClose,
}: ClientAreaSignalTransactionModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const toneStyles = TONE_STYLES[tone];

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
        aria-labelledby="signal-transaction-modal-title"
        className={`w-full max-w-md rounded-[1.5rem] border border-white/10 bg-[rgba(12,12,16,0.96)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 sm:p-7 ${toneStyles.ring} ${isClosing
          ? "animate-[pengumuman-modal-panel-out_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          : "animate-[pengumuman-modal-panel-in_220ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mb-5 flex items-start justify-between gap-4">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${toneStyles.badge}`}
          >
            {badgeLabel}
          </span>

          <button
            type="button"
            aria-label={closeLabel}
            className="absolute right-0 top-0 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 text-sm font-bold text-gray-300 transition-colors hover:border-amber-500/40 hover:text-white"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <div className="my-5">
          <Image
            src="/assets/HP Solid-3.png"
            alt="Solid Gold Berjangka App"
            width={200}
            height={100}
            className="mx-auto mb-2 h-auto w-75 max-w-[10px] object-contain"
          />
        </div>

        <h2
          id="signal-transaction-modal-title"
          className="text-center text-[1.35rem] font-extrabold tracking-[-0.03em] text-white"
        >
          {title}
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-300">
          {description}
        </p>

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
    </div>,
    document.body,
  );
}
