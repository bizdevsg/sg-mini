import { Suspense, type ReactNode } from "react";

import { getLocaleConfig, type AppLocale } from "@/locales";
import { LocaleDocumentSync } from "@/components/providers/LocaleDocumentSync";
import { FooterSection } from "@/components/organisms/FooterSection";
import { Navbar } from "@/components/organisms/Navbar";
import { ScrollToTopButton } from "@/components/molecules/ScrollToTopButton";
import {
  getClientAreaSessionProfile,
  hasClientAreaSession,
} from "@/lib/client-area-auth";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
  bodyClassName?: string;
};

async function PageTemplateNavbar({ locale }: { locale: AppLocale }) {
  const [isClientAreaAuthenticated, clientAreaProfile] = await Promise.all([
    hasClientAreaSession(),
    getClientAreaSessionProfile(),
  ]);

  return (
    <Navbar
      clientAreaProfile={clientAreaProfile}
      locale={locale}
      isClientAreaAuthenticated={isClientAreaAuthenticated}
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
      <LocaleDocumentSync locale={locale} />
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
