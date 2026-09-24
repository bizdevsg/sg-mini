import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqMainSection } from "@/components/organisms/FaqMainSection";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type FaqPageProps = {
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
}: FaqPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).faqPage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locales}/faq`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/faq`,
        ]),
      ),
    },
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);

  return (
    <FaqMainSection
      locale={locales}
      copy={messages.faqPage}
      homeLabel={messages.app.homeLabel}
    />
  );
}
