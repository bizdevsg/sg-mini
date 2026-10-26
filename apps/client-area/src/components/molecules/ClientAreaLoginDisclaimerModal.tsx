"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DISCLAIMER_STORAGE_KEY = "sgb_client_area_disclaimer_session";

type ClientAreaLoginDisclaimerModalProps = {
  acknowledgeLabel: string;
  body: string;
  sessionIssuedAtMs: number;
  title: string;
};

export function ClientAreaLoginDisclaimerModal({
  acknowledgeLabel,
  body,
  sessionIssuedAtMs,
  title,
}: ClientAreaLoginDisclaimerModalProps) {
  const acknowledgeButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const sessionKey = String(sessionIssuedAtMs);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      try {
        setIsOpen(
          window.sessionStorage.getItem(DISCLAIMER_STORAGE_KEY) !== sessionKey,
        );
      } catch {
        // Restricted storage must not prevent the disclaimer from being shown.
        setIsOpen(true);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [sessionKey]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    acknowledgeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleAcknowledge = () => {
    try {
      window.sessionStorage.setItem(DISCLAIMER_STORAGE_KEY, sessionKey);
    } catch {
      // The modal can still be dismissed when browser storage is unavailable.
    }

    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/10 p-4 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-area-disclaimer-title"
        aria-describedby="client-area-disclaimer-description"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/30 bg-zinc-950/70 backdrop-blur-lg p-6 shadow-[0_24px_80px_rgba(0,0,0,0.7)] sm:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/25 bg-amber-500/10 text-2xl text-amber-400">
            <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
          </div>

          <h2
            id="client-area-disclaimer-title"
            className="mt-5 text-2xl font-bold text-white"
          >
            {title}
          </h2>
          <p
            id="client-area-disclaimer-description"
            className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base"
          >
            {body}
          </p>

          <button
            ref={acknowledgeButtonRef}
            type="button"
            onClick={handleAcknowledge}
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            {acknowledgeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
