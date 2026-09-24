import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import {
  ExchangeRatePanel,
  ExchangeRatePanelFallback,
} from "@/components/organisms/ExchangeRatePanel";
import { LiveQuoteTable } from "@/components/organisms/LiveQuoteTable";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";

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
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-100 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 space-y-6">
          <div className="rounded-2xl border border-line bg-neutral-900/80 p-5 sm:p-6">
            <ScrollReveal
              effect="fade-up"
            >
              <LiveQuoteTable locale={locales} mode="full" />
            </ScrollReveal>
          </div>

          <Suspense fallback={<ExchangeRatePanelFallback locale={locales} />}>
            <ScrollReveal>
              <ExchangeRatePanel locale={locales} />
            </ScrollReveal>
          </Suspense>
        </div>
      </SectionContainer>
    </main>
  );
}
