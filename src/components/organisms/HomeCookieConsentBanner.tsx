import { acceptCookieConsent, dismissCookieConsent } from "@/app/actions/cookieConsent";
import { getMessages, type AppLocale } from "@/locales";

type HomeCookieConsentBannerProps = {
  locale: AppLocale;
};

export function HomeCookieConsentBanner({
  locale,
}: HomeCookieConsentBannerProps) {
  const copy = getMessages(locale).cookieConsent;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40">
      <div className="pointer-events-auto mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[rgba(205,161,58,0.26)] bg-[rgba(10,10,10,0.94)] shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_center,rgba(240,203,115,0.18),transparent_70%)]" />
          <div className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-2xs font-semibold uppercase tracking-[0.32em] text-yellow-500/80">
                {copy.badge}
              </p>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  {copy.title}
                </h2>
                <p className="text-sm leading-6 text-zinc-300 sm:text-[0.95rem]">
                  {copy.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xxs font-medium uppercase tracking-[0.18em] text-zinc-300">
                  {copy.essentialTag}
                </span>
                <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xxs font-medium uppercase tracking-[0.18em] text-yellow-300">
                  {copy.preferenceTag}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <form action={dismissCookieConsent}>
                <button
                  type="submit"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 hover:border-white/20 hover:bg-white/8 sm:w-auto"
                >
                  {copy.dismissLabel}
                </button>
              </form>

              <form action={acceptCookieConsent}>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_14px_30px_rgba(205,161,58,0.24)] hover:from-yellow-400 hover:to-amber-400 sm:w-auto"
                >
                  {copy.acceptLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
