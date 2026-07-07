import { Cookie, ShieldCheck, X } from "lucide-react";

import {
  acceptCookieConsent,
  dismissCookieConsent,
} from "@/app/actions/cookieConsent";
import { getMessages, type AppLocale } from "@/locales";

type HomeCookieConsentBannerProps = {
  locale: AppLocale;
};

export function HomeCookieConsentBanner({
  locale,
}: HomeCookieConsentBannerProps) {
  const copy = getMessages(locale).cookieConsent;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[999] mx-auto max-w-8xl">
      <div className="pointer-events-auto">
        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-zinc-950/95 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-3xl">

          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-amber-500/5 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,193,7,.08),transparent_45%)]" />
          </div>

          <div className="relative p-6 sm:p-8">
            {/* Close */}
            <form
              action={dismissCookieConsent}
              className="absolute right-5 top-5"
            >
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </form>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              {/* Left */}
              <div className="max-w-3xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-500/20 bg-yellow-500/10">
                    <Cookie className="h-7 w-7 text-yellow-400" />
                  </div>

                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-[0.32em] text-yellow-500">
                      {copy.badge}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold leading-tight text-white sm:text-2xl">
                      {copy.title}
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-[15px]">
                      {copy.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">

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
              <div className="flex flex-col gap-3 sm:flex-row">

                <form action={dismissCookieConsent}>
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:w-auto"
                  >
                    {copy.dismissLabel}
                  </button>
                </form>

                <form action={acceptCookieConsent}>
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 px-7 py-3 text-sm font-semibold text-black shadow-[0_18px_35px_rgba(245,158,11,.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_24px_45px_rgba(245,158,11,.35)] active:scale-95 sm:w-auto"
                  >
                    {copy.acceptLabel}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}