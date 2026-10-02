import { notFound } from "next/navigation";

import { PageTemplate } from "@/components/layouts/PageTemplate";
import { LocalizedLayoutEnhancements } from "@/components/providers/LocalizedLayoutEnhancements";
import { isSupportedLocale, type AppLocale } from "@/locales";
import { hasAcceptedCookieConsent } from "@/lib/cookie-consent";
import { isTawkChatEnabled } from "@/lib/client-area-config";

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
  // The admin switch (GET /api/v1/client-area → tawk_to_dev / tawk_to_prod) decides
  // whether live chat is on; when it is off the WhatsApp widget replaces it. Falls
  // back to NEXT_PUBLIC_ENABLE_TAWK_CHAT if the admin API cannot be reached.
  const tawkChatEnabled = await isTawkChatEnabled();

  return (
    <PageTemplate locale={locales}>
      {children}
      <LocalizedLayoutEnhancements
        locale={locales}
        shouldShowCookieConsent={shouldShowCookieConsent}
        tawkChatEnabled={tawkChatEnabled}
      />
    </PageTemplate>
  );
}
