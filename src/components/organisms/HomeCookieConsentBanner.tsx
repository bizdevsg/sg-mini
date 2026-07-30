"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  acceptCookieConsent,
} from "@/app/actions/cookieConsent";
import { TAWK_CHAT_ENABLE_EVENT } from "@/lib/tawk";
import { getMessages, type AppLocale } from "@/locales";
import Image from "next/image";
import { SectionEyebrow } from "../atoms/SectionEyebrow";

type HomeCookieConsentBannerProps = {
  locale: AppLocale;
};

export function HomeCookieConsentBanner({
  locale,
}: HomeCookieConsentBannerProps) {
  const localeMenuRef = useRef<HTMLDivElement | null>(null);
  const [modalLocale, setModalLocale] = useState<AppLocale>(locale);
  const messages = getMessages(modalLocale);
  const copy = messages.cookieConsent;
  const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"accept" | "dismiss" | null>(
    null,
  );
  const localeOptions = [
    {
      value: "id" as const,
      iconSrc: "/assets/icon-id.png",
      alt: "Indonesia",
    },
    {
      value: "en" as const,
      iconSrc: "/assets/icon-us.png",
      alt: "English",
    },
  ];

  useEffect(() => {
    setModalLocale(locale);
    setIsLocaleMenuOpen(false);
  }, [locale]);

  useEffect(() => {
    if (!isLocaleMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!localeMenuRef.current?.contains(event.target as Node)) {
        setIsLocaleMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocaleMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isLocaleMenuOpen]);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsReadyToDisplay(true);
      return;
    }

    const handleWindowLoad = () => {
      setIsReadyToDisplay(true);
    };

    window.addEventListener("load", handleWindowLoad);

    return () => {
      window.removeEventListener("load", handleWindowLoad);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !isReadyToDisplay) {
      return;
    }

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isReadyToDisplay, isVisible]);

  async function handleConsentAction(action: "accept" | "dismiss") {
    setPendingAction(action);

    try {
      if (action === "accept") {
        await acceptCookieConsent();
      }

      setIsVisible(false);
      window.dispatchEvent(new Event(TAWK_CHAT_ENABLE_EVENT));
    } catch {
      setPendingAction(null);
    }
  }

  if (!isVisible || !isReadyToDisplay) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl">
          <div className="relative w-full max-w-full overflow-hidden rounded-2xl border border-white/10 bg-[#2F2F2F]/95 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-3xl sm:rounded-3xl">
            <div className="relative p-4 sm:p-8">
              <div
                ref={localeMenuRef}
                className="absolute right-4 top-4 z-20 sm:right-8 sm:top-8"
              >
                <button
                  type="button"
                  aria-expanded={isLocaleMenuOpen}
                  aria-haspopup="listbox"
                  aria-label={messages.navbar.switchLocaleLabel}
                  onClick={() => setIsLocaleMenuOpen((current) => !current)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:border-white/20 hover:bg-black/30"
                >
                  <Image
                    src={
                      modalLocale === "id"
                        ? "/assets/icon-id.png"
                        : "/assets/icon-us.png"
                    }
                    alt={modalLocale === "id" ? "Indonesia" : "English"}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span>{modalLocale.toUpperCase()}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isLocaleMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isLocaleMenuOpen ? (
                  <div
                    role="listbox"
                    aria-label={messages.navbar.switchLocaleLabel}
                    className="absolute right-0 mt-2 min-w-[180px] w-fit rounded-2xl border border-white/10 bg-[#1E1E1E]/95 p-2 shadow-[0_20px_48px_rgba(0,0,0,.4)] backdrop-blur-xl"
                  >
                    {localeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setModalLocale(option.value);
                          setIsLocaleMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 ${option.value === modalLocale
                          ? "bg-yellow-500/10 text-yellow-300"
                          : "text-zinc-200 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        <Image
                          src={option.iconSrc}
                          alt={option.alt}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{option.alt}</p>
                          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                            {option.value}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex min-w-0 flex-1 flex-col gap-10 lg:flex-row lg:items-center">
                  <div className="shrink-0">
                    <Image
                      src="/assets/cookies.png"
                      alt="Icon Cookies"
                      width={220}
                      height={220}
                      sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px"
                      className="h-auto w-[190px] sm:w-[230px] lg:w-[270px]"
                    />
                  </div>

                  <div className="min-w-0 w-full">
                    <SectionEyebrow>{copy.badge}</SectionEyebrow>

                    <h2 className="mt-4 text-lg font-semibold leading-tight text-white sm:text-2xl">
                      {copy.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-[15px] sm:leading-7">
                      {copy.description}
                    </p>

                    <div className="mt-5 flex w-full min-w-0 flex-col gap-3 lg:w-auto lg:min-w-[320px] lg:flex-shrink-0 lg:grid-cols-none lg:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          startTransition(() => {
                            void handleConsentAction("dismiss");
                          })
                        }
                        disabled={pendingAction !== null}
                        className="w-full min-w-0 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 lg:min-w-[148px]"
                      >
                        {copy.dismissLabel}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          startTransition(() => {
                            void handleConsentAction("accept");
                          })
                        }
                        disabled={pendingAction !== null}
                        className="w-full min-w-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 px-7 py-3 text-sm font-semibold text-black shadow-[0_18px_35px_rgba(245,158,11,.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_24px_45px_rgba(245,158,11,.35)] active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-70 lg:min-w-[148px]"
                      >
                        {copy.acceptLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
