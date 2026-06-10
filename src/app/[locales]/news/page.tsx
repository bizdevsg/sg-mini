import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getNewsPageContent } from "@/components/content/news-content";
import { NewsBrowser } from "@/components/organisms/NewsBrowser";
import { getNewsFeed } from "@/lib/news";
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
    <SectionContainer className="py-16 sm:py-20">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-gray-500"
      >
        <Link
          href={`/${locales}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 transition hover:bg-yellow-500/30"
        >
          <FontAwesomeIcon icon={["fas", "house"]} className="text-xs" />
        </Link>

        <span>{">"}</span>

        <span className="font-medium text-white">{labels.breadcrumb}</span>
      </nav>

      <NewsBrowser
        articles={articles}
        locale={locales}
        source={source}
        labels={labels}
      />
    </SectionContainer>
  );
}
