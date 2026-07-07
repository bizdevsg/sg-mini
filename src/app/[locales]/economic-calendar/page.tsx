import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { EconomicCalendarBrowser } from "@/components/organisms/EconomicCalendarBrowser";
import {
  createEmptyEconomicCalendarRange,
  ECONOMIC_CALENDAR_RANGE_KEYS,
  getEconomicCalendarRange,
  type EconomicCalendarOverview,
} from "@/lib/economic-calendar";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type EconomicCalendarPageProps = {
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
}: EconomicCalendarPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);
  const copy = getMessages(locales).economicCalendarPage;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `/${locales}/economic-calendar`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/economic-calendar`,
        ]),
      ),
    },
  };
}

async function createInitialCalendarOverview() {
  const todayData = await getEconomicCalendarRange("today").catch(() =>
    createEmptyEconomicCalendarRange("today"),
  );

  return Object.fromEntries(
    ECONOMIC_CALENDAR_RANGE_KEYS.map((rangeKey) => {
      if (rangeKey === "today") {
        return [rangeKey, todayData];
      }

      return [rangeKey, createEmptyEconomicCalendarRange(rangeKey, "idle")];
    }),
  ) as EconomicCalendarOverview;
}

export default async function EconomicCalendarPage({
  params,
}: EconomicCalendarPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  const labels = getMessages(locales).economicCalendarPage;
  const overview = await createInitialCalendarOverview();

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
          <EconomicCalendarBrowser locale={locales} overview={overview} />
        </div>
      </div>
    </SectionContainer>
  );
}
