"use client";

import { HomeCookieConsentBanner } from "@/components/organisms/HomeCookieConsentBanner";
import { TawkChatWidget } from "@/components/providers/TawkChatWidget";
import type { AppLocale } from "@/locales";

type LocalizedLayoutEnhancementsProps = {
  locale: AppLocale;
  shouldShowCookieConsent: boolean;
  tawkChatEnabled: boolean;
};

export function LocalizedLayoutEnhancements({
  locale,
  shouldShowCookieConsent,
  tawkChatEnabled,
}: LocalizedLayoutEnhancementsProps) {
  return (
    <>
      <TawkChatWidget
        canEnable={tawkChatEnabled}
        enabledInitially={tawkChatEnabled && !shouldShowCookieConsent}
      />
      {shouldShowCookieConsent ? (
        <HomeCookieConsentBanner locale={locale} />
      ) : null}
    </>
  );
}
