import { notFound } from "next/navigation";

import { PageTemplate } from "@/components/layouts/PageTemplate";
import { isSupportedLocale, type AppLocale } from "@/locales";
import { HomeCookieConsentBanner } from "@/components/organisms/HomeCookieConsentBanner";
import { hasAcceptedCookieConsent } from "@/lib/cookie-consent";

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
    <PageTemplate locale={locales}>{children}
      {shouldShowCookieConsent ? (
        <HomeCookieConsentBanner locale={locales} />
      ) : null}
    </PageTemplate>
  );
}
