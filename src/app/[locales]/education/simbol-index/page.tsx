import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IndexSymbolsPage as IndexSymbolsPageView } from "@/components/organisms/IndexSymbolsPage";
import {
  getIndexSymbolsPageContent,
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type IndexSymbolsPageProps = {
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
}: IndexSymbolsPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getIndexSymbolsPageContent(locales);

  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: `/${locales}/education/simbol-index`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/education/simbol-index`,
        ]),
      ),
    },
  };
}

export default async function IndexSymbolsPage({
  params,
}: IndexSymbolsPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);
  const page = getIndexSymbolsPageContent(locales);

  return (
    <IndexSymbolsPageView
      page={page}
      messages={messages}
      locales={locales}
    />
  );
}
