"use client";

import { useEffect, useState } from "react";

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
  const [resolvedTawkChatEnabled, setResolvedTawkChatEnabled] =
    useState(tawkChatEnabled);

  useEffect(() => {
    setResolvedTawkChatEnabled(tawkChatEnabled);
  }, [tawkChatEnabled]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWebsiteFeatures() {
      try {
        const response = await fetch("/api/website-features", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          data?: { tawkChatEnabled?: boolean };
        };

        if (typeof payload.data?.tawkChatEnabled === "boolean") {
          setResolvedTawkChatEnabled(payload.data.tawkChatEnabled);
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }
      }
    }

    void loadWebsiteFeatures();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <TawkChatWidget
        canEnable={resolvedTawkChatEnabled}
        enabledInitially={resolvedTawkChatEnabled && !shouldShowCookieConsent}
      />
      {shouldShowCookieConsent ? (
        <HomeCookieConsentBanner locale={locale} />
      ) : null}
    </>
  );
}
