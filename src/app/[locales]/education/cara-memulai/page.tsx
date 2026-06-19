import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GettingStartedPage as GettingStartedPageView } from "@/components/organisms/GettingStartedPage";
import {
  getGettingStartedPageContent,
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type GettingStartedPageProps = {
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
}: GettingStartedPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getGettingStartedPageContent(locales);

  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: `/${locales}/education/cara-memulai`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/education/cara-memulai`,
        ]),
      ),
    },
  };
}

export default async function GettingStartedPage({
  params,
}: GettingStartedPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);
  const page = getGettingStartedPageContent(locales);

  return (
    <GettingStartedPageView
      page={page}
      messages={messages}
      locales={locales}
    />
  );
}
