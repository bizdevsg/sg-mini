"use client";

import { HomeCookieConsentBanner } from "@/components/organisms/HomeCookieConsentBanner";
import { TawkChatWidget } from "@/components/providers/TawkChatWidget";
import type { AppLocale } from "@/locales";

type LocalizedLayoutEnhancementsProps = {
  locale: AppLocale;
  shouldShowCookieConsent: boolean;
  /** Resolved on the server from the admin switch (see isTawkChatEnabled). */
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
        locale={locale}
      />
      {shouldShowCookieConsent ? (
        <HomeCookieConsentBanner locale={locale} />
      ) : null}
    </>
  );
}
