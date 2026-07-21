import { notFound } from "next/navigation";

import { PageTemplate } from "@/components/layouts/PageTemplate";
import { LocalizedLayoutEnhancements } from "@/components/providers/LocalizedLayoutEnhancements";
import { isSupportedLocale, type AppLocale } from "@/locales";
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
    <PageTemplate locale={locales}>
      {children}
      <LocalizedLayoutEnhancements
        locale={locales}
        shouldShowCookieConsent={shouldShowCookieConsent}
      />
    </PageTemplate>
  );
}
