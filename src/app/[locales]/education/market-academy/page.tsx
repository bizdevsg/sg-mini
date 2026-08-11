import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { NewsBrowser } from "@/components/organisms/NewsBrowser";
import { getMarketAcademyFeed } from "@/lib/market-academy";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

const MARKET_ACADEMY_HREF_BASE_PATH = "/education/market-academy";

type MarketAcademyPageProps = {
  params: Promise<{ locales: string }>;
};

export const revalidate = 300;

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
}: MarketAcademyPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales).marketAcademyPage;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: `/${locales}${MARKET_ACADEMY_HREF_BASE_PATH}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}${MARKET_ACADEMY_HREF_BASE_PATH}`,
        ]),
      ),
    },
  };
}

export default async function MarketAcademyPage({
  params,
}: MarketAcademyPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const { articles, source } = await getMarketAcademyFeed(locales);
  const messages = getMessages(locales);
  const labels = messages.marketAcademyPage;

  return (
    <SectionContainer className="py-16 md:py-20 mt-10">
      <NewsBrowser
        articles={articles}
        locale={locales}
        source={source === "api" ? "api" : "fallback"}
        hrefBasePath={MARKET_ACADEMY_HREF_BASE_PATH}
        browserLabels={messages.marketAcademyBrowser}
        labels={labels}
      />
    </SectionContainer>
  );
}
