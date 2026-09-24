import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutInformationMainSection } from "@/components/organisms/AboutInformationMainSection";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type AboutInformationPageProps = {
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
}: AboutInformationPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).aboutInformationPage;

  return {
    title:
      locales === "id"
        ? `${page.breadcrumb} ${page.parentLabel}`
        : `${page.breadcrumb} | ${page.parentLabel}`,
    description: page.hero.description,
    alternates: {
      canonical: `/${locales}/about/informasi`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/about/informasi`,
        ]),
      ),
    },
  };
}

export default async function AboutInformationPage({
  params,
}: AboutInformationPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  return (
    <main>
      <AboutInformationMainSection locale={locales} />
    </main>
  );
}
