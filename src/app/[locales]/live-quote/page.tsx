import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { LiveQuoteTable } from "@/components/molecules/LiveQuoteTable";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type LiveQuotePageProps = {
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
}: LiveQuotePageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);

  return {
    title: messages.liveQuoteSection.title,
    description: messages.liveQuoteSection.subtitle,
    alternates: {
      canonical: `/${locales}/live-quote`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/live-quote`,
        ]),
      ),
    },
  };
}

export default async function LiveQuotePage({ params }: LiveQuotePageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);
  const labels = messages.liveQuotePage;

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
        <div>
          <SectionTitle
            title={messages.liveQuoteSection.title}
            subtitle={messages.liveQuoteSection.subtitle}
          />

          <div className="mt-6 rounded-2xl border border-line bg-neutral-900/80 p-5 sm:p-6">
            <LiveQuoteTable locale={locales} mode="full" />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
