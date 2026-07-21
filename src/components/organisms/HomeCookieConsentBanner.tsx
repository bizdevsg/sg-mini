"use client";

import { startTransition, useEffect, useState } from "react";
import { Cookie, ShieldCheck } from "lucide-react";

import {
  acceptCookieConsent,
} from "@/app/actions/cookieConsent";
import { TAWK_CHAT_ENABLE_EVENT } from "@/lib/tawk";
import { getMessages, type AppLocale } from "@/locales";

type HomeCookieConsentBannerProps = {
  locale: AppLocale;
};

export function HomeCookieConsentBanner({
  locale,
}: HomeCookieConsentBannerProps) {
  const copy = getMessages(locale).cookieConsent;
  const [isReadyToDisplay, setIsReadyToDisplay] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [pendingAction, setPendingAction] = useState<"accept" | "dismiss" | null>(
    null,
  );

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
        <div className="pointer-events-auto mx-auto w-full max-w-8xl">
          <div className="relative w-full max-w-full overflow-hidden rounded-[26px] border border-white/10 bg-zinc-950/95 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-3xl sm:rounded-[30px]">

            {/* Background */}
            <div className="absolute inset-0">
              <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />
              <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-amber-500/5 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,193,7,.08),transparent_45%)]" />
            </div>

            <div className="relative p-4 sm:p-8">
              <div className="flex min-w-0 flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
                {/* Left */}
                <div className="min-w-0 max-w-3xl">
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10 sm:h-14 sm:w-14">
                      <Cookie className="h-6 w-6 text-yellow-400 sm:h-7 sm:w-7" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-2xs font-semibold uppercase tracking-[0.24em] text-yellow-500 sm:tracking-[0.32em]">
                        {copy.badge}
                      </p>

                      <h2 className="mt-2 text-lg font-semibold leading-tight text-white sm:text-2xl">
                        {copy.title}
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:mt-4 sm:text-[15px] sm:leading-7">
                        {copy.description}
                      </p>

                      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">

                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                          <ShieldCheck
                            size={17}
                            className="text-emerald-400"
                          />
                          <span>{copy.essentialTag}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                          <span>{copy.preferenceTag}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex w-full min-w-0 flex-col gap-3 sm:grid sm:grid-cols-2 lg:w-auto lg:min-w-[320px] lg:flex-shrink-0 lg:grid-cols-none lg:flex-row">

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
  );
}
