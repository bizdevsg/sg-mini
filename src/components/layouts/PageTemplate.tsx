import { Suspense, type ReactNode } from "react";

import { getLocaleConfig, type AppLocale } from "@/locales";
import { FooterSection } from "@/components/organisms/FooterSection";
import { Navbar } from "@/components/organisms/Navbar";
import { ScrollToTopButton } from "@/components/molecules/ScrollToTopButton";
import {
  getClientAreaSessionState,
} from "@/lib/client-area-auth";
import { CLIENT_AREA_ENABLED } from "@/lib/client-area-config";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
  bodyClassName?: string;
};

async function PageTemplateNavbar({ locale }: { locale: AppLocale }) {
  if (!CLIENT_AREA_ENABLED) {
    return (
      <Navbar
        clientAreaProfile={null}
        locale={locale}
        isClientAreaAuthenticated={false}
      />
    );
  }

  const { isAuthenticated, profile } = await getClientAreaSessionState();

  return (
    <Navbar
      clientAreaProfile={profile}
      locale={locale}
      isClientAreaAuthenticated={isAuthenticated}
    />
  );
}

export function PageTemplate({
  children,
  locale,
  bodyClassName = "",
}: PageTemplateProps) {
  return (
    <div
      lang={getLocaleConfig(locale).lang}
      data-locale={locale}
      className="min-h-screen bg-transparent"
    >
      <Suspense
        fallback={
          <Navbar
            clientAreaProfile={null}
            locale={locale}
            isClientAreaAuthenticated={false}
          />
        }
      >
        <PageTemplateNavbar locale={locale} />
      </Suspense>
      <main className={bodyClassName}>{children}</main>
      <ScrollToTopButton locale={locale} />
      <FooterSection locale={locale} />
    </div>
  );
}
