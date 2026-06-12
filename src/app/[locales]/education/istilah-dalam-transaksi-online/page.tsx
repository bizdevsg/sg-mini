import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OnlineTradingTermsPage as OnlineTradingTermsPageView } from "@/components/organisms/OnlineTradingTermsPage";
import {
  getLocaleConfig,
  getMessages,
  getOnlineTradingTermsPageContent,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type OnlineTradingTermsPageProps = {
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
}: OnlineTradingTermsPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getOnlineTradingTermsPageContent(locales);

  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: `/${locales}/education/istilah-dalam-transaksi-online`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/education/istilah-dalam-transaksi-online`,
        ]),
      ),
    },
  };
}

export default async function OnlineTradingTermsPage({
  params,
}: OnlineTradingTermsPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);
  const page = getOnlineTradingTermsPageContent(locales);

  return (
    <OnlineTradingTermsPageView
      page={page}
      messages={messages}
      locales={locales}
    />
  );
}
