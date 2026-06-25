import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { NewsBrowser } from "@/components/organisms/NewsBrowser";
import { NewsPageHeroSection } from "@/components/organisms/NewsPageHeroSection";
import { getNewsFeed } from "@/lib/news";
import { getNewsPageContent } from "@/locales/news-page-content";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type LocalizedPageProps = {
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
}: LocalizedPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const pageContent = getNewsPageContent(locales);

  return {
    title: pageContent.newsPage.meta.title,
    description: pageContent.newsPage.meta.description,
    alternates: {
      canonical: `/${locales}/news`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/news`,
        ]),
      ),
    },
  };
}

export default async function LocalizedNews({ params }: LocalizedPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const { articles, source } = await getNewsFeed(locales);
  const labels = getMessages(locales).newsPage;

  return (
    <SectionContainer className="py-16 md:py-20 mt-10">
      <NewsBrowser
        articles={articles}
        locale={locales}
        source={source}
        labels={labels}
      />
    </SectionContainer>
  );
}
