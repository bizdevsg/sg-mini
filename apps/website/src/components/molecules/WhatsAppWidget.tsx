"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { PUBLIC_WHATSAPP_NUMBER } from "@/lib/env";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { AppLocale } from "@/locales";

const COPY = {
  id: {
    title: "Solid Gold Berjangka",
    subtitle: "Customer Support",
    greeting:
      "Halo! 👋 Live chat sedang tidak tersedia. Silakan hubungi kami lewat WhatsApp, tim kami siap membantu.",
    cta: "Mulai Chat WhatsApp",
    open: "Buka widget WhatsApp",
    close: "Tutup widget WhatsApp",
    message: "Halo, saya butuh bantuan terkait Client Area.",
  },
  en: {
    title: "Solid Gold Berjangka",
    subtitle: "Customer Support",
    greeting:
      "Hello! 👋 Live chat is currently unavailable. Please reach us on WhatsApp — our team is ready to help.",
    cta: "Start WhatsApp Chat",
    open: "Open the WhatsApp widget",
    close: "Close the WhatsApp widget",
    message: "Hello, I need help with the Client Area.",
  },
} as const;

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

type WhatsAppWidgetProps = {
  locale: AppLocale;
};

/**
 * Floating WhatsApp widget shown in place of the live chat when that is off or
 * failed to load: a round bubble that opens a small greeting panel with a button
 * to start the chat on WhatsApp.
 */
export function WhatsAppWidget({ locale }: WhatsAppWidgetProps) {
  const copy = COPY[locale];
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div
          role="dialog"
          aria-label={copy.title}
          className="w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl bg-[#ece5dd] shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#25D366]">
              <WhatsAppLogo className="size-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">
                {copy.title}
              </span>
              <span className="block text-xs text-white/80">
                {copy.subtitle}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={copy.close}
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4 px-4 py-5">
            <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-zinc-800 shadow-sm">
              {copy.greeting}
            </p>

            <a
              href={buildWhatsAppHref(PUBLIC_WHATSAPP_NUMBER, copy.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-white shadow-md transition hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075e54]"
            >
              <WhatsAppLogo className="size-5" />
              {copy.cta}
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? copy.close : copy.open}
        aria-expanded={isOpen}
        className="grid size-14 cursor-pointer place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition hover:-translate-y-0.5 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {isOpen ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <WhatsAppLogo className="size-8" />
        )}
      </button>
    </div>
  );
}
