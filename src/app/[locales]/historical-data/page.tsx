import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { HistoricalDataBrowser } from "@/components/organisms/HistoricalDataBrowser";
import {
  getHistoricalData,
  type HistoricalDataRecord,
} from "@/lib/historical-data";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type HistoricalDataPageProps = {
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
}: HistoricalDataPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);
  const copy = getMessages(locales).historicalDataPage;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locales}/historical-data`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/historical-data`,
        ]),
      ),
    },
  };
}

export default async function HistoricalDataPage({
  params,
}: HistoricalDataPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  let records: HistoricalDataRecord[] = [];

  try {
    records = await getHistoricalData();
  } catch {
    records = [];
  }

  const labels = getMessages(locales).historicalDataPage;

  return (
    <SectionContainer className="py-16 sm:py-20">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-gray-500"
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

      <div className="mt-8">
        <SectionTitle title={labels.title} />

        <div className="mt-6 rounded-2xl border border-line bg-neutral-900/80 p-5 sm:p-6">
          <HistoricalDataBrowser locale={locales} records={records} />
        </div>
      </div>
    </SectionContainer>
  );
}
