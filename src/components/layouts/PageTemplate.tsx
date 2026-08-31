import type { ReactNode } from "react";

import { getLocaleConfig, type AppLocale } from "@/locales";
import { FooterSection } from "@/components/organisms/FooterSection";
import { Navbar } from "@/components/organisms/Navbar";
import { getClientAreaSessionState } from "@/lib/client-area-auth";
import { getWebsiteFeatureConfig } from "@/lib/client-area-config";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
  bodyClassName?: string;
};

async function getNavbarState(locale: AppLocale) {
  const { clientAreaEnabled } = await getWebsiteFeatureConfig();

  if (!clientAreaEnabled) {
    return {
      clientAreaProfile: null,
      isClientAreaEnabled: false,
      isClientAreaAuthenticated: false,
      locale,
    };
  }

  const { isAuthenticated, profile } = await getClientAreaSessionState();

  return {
    clientAreaProfile: profile,
    isClientAreaEnabled: clientAreaEnabled,
    isClientAreaAuthenticated: isAuthenticated,
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
