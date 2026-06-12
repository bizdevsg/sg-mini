import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocoLondonGoldPage as LocoLondonGoldPageView } from "@/components/organisms/LocoLondonGoldPage";
import {
  getLocaleConfig,
  getLocoLondonGoldPageContent,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type LocoLondonGoldPageProps = {
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
}: LocoLondonGoldPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getLocoLondonGoldPageContent(locales);

  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: `/${locales}/education/loco-london-gold`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/education/loco-london-gold`,
        ]),
      ),
    },
  };
}

export default async function LocoLondonGoldPage({
  params,
}: LocoLondonGoldPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getLocoLondonGoldPageContent(locales);

  return <LocoLondonGoldPageView page={page} />;
}
