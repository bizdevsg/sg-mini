"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { submitClientAreaLogout } from "@/app/actions/clientAreaLogout";
import { getMessages } from "@/locales";
import type { AppLocale } from "@/locales";

type ClientAreaLogoutModalProps = {
  isOpen: boolean;
  locale: AppLocale;
  onClose: () => void;
  redirectPath: string;
};

function LogoutModalActions({
  cancelLabel,
  confirmLabel,
  onClose,
  submittingLabel,
}: {
  cancelLabel: string;
  confirmLabel: string;
  onClose: () => void;
  submittingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onClose}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cancelLabel}
      </button>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:border-red-400/40 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? submittingLabel : confirmLabel}
      </button>
    </div>
  );
}

export function ClientAreaLogoutModal({
  isOpen,
  locale,
  onClose,
  redirectPath,
}: ClientAreaLogoutModalProps) {
  const messages = getMessages(locale).clientArea.topbar.logoutModal;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-area-logout-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 transition hover:text-white"
          aria-label={messages.cancelLabel}
        >
          <FontAwesomeIcon icon={["fas", "xmark"]} className="text-lg" />
        </button>

        <form action={submitClientAreaLogout} className="space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="redirectPath" value={redirectPath} />

          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-400">
              <FontAwesomeIcon icon={["fas", "right-from-bracket"]} />
            </div>

            <div className="space-y-2">
              <h3
                id="client-area-logout-title"
                className="text-lg font-bold text-zinc-100"
              >
                {messages.title}
              </h3>
              <p className="text-sm leading-6 text-zinc-400">
                {messages.description}
              </p>
            </div>
          </div>

          <LogoutModalActions
            cancelLabel={messages.cancelLabel}
            confirmLabel={messages.confirmLabel}
            onClose={onClose}
            submittingLabel={messages.submittingLabel}
          />
        </form>
      </div>
    </div>
  );
}
