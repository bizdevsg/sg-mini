import { notFound } from "next/navigation";

import { LocalizedLayoutEnhancements } from "@/components/providers/LocalizedLayoutEnhancements";
import { hasAcceptedCookieConsent } from "@/lib/cookie-consent";
import { PUBLIC_TAWK_CHAT_ENABLED } from "@/lib/env";
import { isSupportedLocale, type AppLocale } from "@/locales";

type LocalizedLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function LocalizedLayout({
  children,
  params,
}: LocalizedLayoutProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  const shouldShowCookieConsent = !(await hasAcceptedCookieConsent());

  return (
    <>
      {children}
      <LocalizedLayoutEnhancements
        locale={locales}
        shouldShowCookieConsent={shouldShowCookieConsent}
        tawkChatEnabled={PUBLIC_TAWK_CHAT_ENABLED}
      />
    </>
  );
}
