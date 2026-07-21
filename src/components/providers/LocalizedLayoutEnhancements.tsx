"use client";

import { HomeCookieConsentBanner } from "@/components/organisms/HomeCookieConsentBanner";
import { TawkChatWidget } from "@/components/providers/TawkChatWidget";
import type { AppLocale } from "@/locales";

type LocalizedLayoutEnhancementsProps = {
  locale: AppLocale;
  shouldShowCookieConsent: boolean;
};

export function LocalizedLayoutEnhancements({
  locale,
  shouldShowCookieConsent,
}: LocalizedLayoutEnhancementsProps) {
  return (
    <>
      <TawkChatWidget enabledInitially={!shouldShowCookieConsent} />
      {shouldShowCookieConsent ? (
        <HomeCookieConsentBanner locale={locale} />
      ) : null}
    </>
  );
}
