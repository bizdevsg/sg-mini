import type { ReactNode } from "react";

import { ClientAreaSidebar } from "@/components/layout/ClientAreaSidebar";
import { ClientAreaTopbar } from "@/components/layout/ClientAreaTopbar";
import { LocaleDocumentSync } from "@/components/providers/LocaleDocumentSync";
import { getLocaleConfig, type AppLocale } from "@/locales";

type ClientAreaLayoutProps = {
  children: ReactNode;
  locale: AppLocale;
};

export function ClientAreaLayout({
  children,
  locale,
}: ClientAreaLayoutProps) {
  return (
    <div
      lang={getLocaleConfig(locale).lang}
      data-locale={locale}
      className="min-h-screen bg-[#f3f6fb] text-[#163245]"
    >
      <LocaleDocumentSync locale={locale} />
      <ClientAreaTopbar locale={locale} />

      <div className="mx-auto flex max-w-[1480px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-start lg:px-8">
        <ClientAreaSidebar locale={locale} className="lg:sticky lg:top-8 lg:w-[96px]" />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
