import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutBusinessLegalityMainSection } from "@/components/organisms/AboutBusinessLegalityMainSection";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type AboutBusinessLegalityPageProps = {
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
}: AboutBusinessLegalityPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).aboutBusinessLegalityPage;

  return {
    title:
      locales === "id"
        ? `${page.breadcrumb} ${page.parentLabel}`
        : `${page.breadcrumb} | ${page.parentLabel}`,
    description: page.hero.description,
    alternates: {
      canonical: `/${locales}/about/legalitas-bisnis`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/about/legalitas-bisnis`,
        ]),
      ),
    },
  };
}

export default async function AboutBusinessLegalityPage({
  params,
}: AboutBusinessLegalityPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  return (
    <main>
      <AboutBusinessLegalityMainSection locale={locales} />
    </main>
  );
}
