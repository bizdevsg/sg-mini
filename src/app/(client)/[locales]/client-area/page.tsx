import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAreaDashboard } from "@/components/organisms/ClientAreaDashboard";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type ClientAreaPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locales: locale,
  }));
}

export async function generateMetadata({
  params,
}: ClientAreaPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);

  return {
    title: messages.clientArea.pageTitle,
    description: messages.clientArea.pageDescription,
    alternates: {
      canonical: `/${locales}/client-area`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/client-area`,
        ]),
      ),
    },
  };
}

export default async function ClientAreaPage({
  params,
}: ClientAreaPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  return <ClientAreaDashboard locale={locales} />;
}
