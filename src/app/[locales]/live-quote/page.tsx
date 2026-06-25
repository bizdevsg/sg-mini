import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { LiveQuoteTable } from "@/components/organisms/LiveQuoteTable";
import { SectionContainer } from "@/components/atoms/SectionContainer";
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
  const productLabel =
    messages.navbar.menuGroups.find((group) =>
      group.items?.some((item) => item.href === "/live-quote"),
    )?.label ?? messages.productPage.productsLabel;

  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={messages.app.homeLabel}
        eyebrow={labels.breadcrumb}
        title={messages.liveQuoteSection.title}
        description={messages.liveQuoteSection.subtitle}
        breadcrumbs={[
          {
            label: productLabel,
            tone: "accent",
          },
          {
            label: labels.breadcrumb,
            tone: "current",
          },
        ]}
      />

      <SectionContainer className="relative py-16 sm:py-20">
        <div className="absolute top-0 left-1/2 h-25 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent" />

        <div className="rounded-2xl border border-line bg-neutral-900/80 p-5 sm:p-6">
          <LiveQuoteTable locale={locales} mode="full" />
        </div>
      </SectionContainer>
    </main>
  );
}
