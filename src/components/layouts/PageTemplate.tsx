import type { ReactNode } from "react";

import { getLocaleConfig, type AppLocale } from "@/locales";
import { LocaleDocumentSync } from "@/components/providers/LocaleDocumentSync";
import { FooterSection } from "@/components/organisms/FooterSection";
import { Navbar } from "@/components/organisms/Navbar";
import { ScrollToTopButton } from "@/components/molecules/ScrollToTopButton";
import { Blur } from "../molecules/Blur";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
  bodyClassName?: string;
};

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
      <Navbar locale={locale} />
      <main className={bodyClassName}>{children}</main>
      <ScrollToTopButton locale={locale} />
      {/* <Blur /> */}
      <FooterSection locale={locale} />
    </div>
  );
}
