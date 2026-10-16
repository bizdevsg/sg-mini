import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutFuturesBrokerRepresentativesMainSection } from "@/components/organisms/AboutFuturesBrokerRepresentativesMainSection";
import { getFuturesBrokerRepresentatives } from "@/lib/futures-broker-representatives";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type AboutFuturesBrokerRepresentativesPageProps = {
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
}: AboutFuturesBrokerRepresentativesPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).aboutFuturesBrokerRepresentativesPage;

  return {
    title: page.breadcrumb,
    description: page.hero.description,
    alternates: {
      canonical: `/${locales}/about/wakil-pialang-berjangka`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/about/wakil-pialang-berjangka`,
        ]),
      ),
    },
  };
}

export default async function AboutFuturesBrokerRepresentativesPage({
  params,
}: AboutFuturesBrokerRepresentativesPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  const page = getMessages(locales).aboutFuturesBrokerRepresentativesPage;
  const representatives = await getFuturesBrokerRepresentatives(
    locales,
    page.representatives.names,
  );

  return (
    <main>
      <AboutFuturesBrokerRepresentativesMainSection
        locale={locales}
        representatives={representatives.data}
      />
    </main>
  );
}
