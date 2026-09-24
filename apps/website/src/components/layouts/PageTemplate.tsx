import type { ReactNode } from "react";

import { getLocaleConfig, type AppLocale } from "@/locales";
import { FooterSection } from "@/components/organisms/FooterSection";
import { Navbar } from "@/components/organisms/Navbar";
import { getWebsiteFeatureConfig } from "@/lib/client-area-config";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
  bodyClassName?: string;
};

async function getNavbarState(locale: AppLocale) {
  const { clientAreaEnabled } = await getWebsiteFeatureConfig();

  return {
    isClientAreaEnabled: clientAreaEnabled,
    locale,
  };
}

export async function PageTemplate({
  children,
  locale,
  bodyClassName = "",
}: PageTemplateProps) {
  const navbarState = await getNavbarState(locale);

  return (
    <div
      lang={getLocaleConfig(locale).lang}
      data-locale={locale}
      className="min-h-screen bg-transparent"
    >
      <Navbar {...navbarState} />
      <main className={bodyClassName}>{children}</main>
      {/* <ScrollToTopButton locale={locale} /> */}
      <FooterSection locale={locale} />
    </div>
  );
}
