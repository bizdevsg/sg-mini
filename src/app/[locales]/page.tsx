import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppPromoSection } from "@/components/organisms/AppPromoSection";
import { BannerSlideshowSection } from "@/components/organisms/BannerSlideshowSection";
import { EbookPromoSection } from "@/components/organisms/EbookPromoSection";
import { FinalCtaSection } from "@/components/organisms/FinalCtaSection";
import { HeroSection } from "@/components/organisms/HeroSection";
import { LiveQuoteSection } from "@/components/organisms/LiveQuoteSection";
import { RegulatorMarqueeSection } from "@/components/organisms/RegulatorMarqueeSection";
import { SecuritySection } from "@/components/organisms/SecuritySection";
import { SpreadSection } from "@/components/organisms/SpreadSection";
import { TrustStatsSection } from "@/components/organisms/TrustStatsSection";
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

  const messages = getMessages(locales);

  return {
    title: {
      absolute: messages.app.title,
    },
    description: messages.app.description,
    alternates: {
      canonical: `/${locales}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}`,
        ]),
      ),
    },
  };
}

export default async function LocalizedHome({ params }: LocalizedPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  return (
    <>
      <HeroSection locale={locales} />
      <RegulatorMarqueeSection locale={locales} />
      <BannerSlideshowSection locale={locales} />
      <AppPromoSection locale={locales} />
      <LiveQuoteSection locale={locales} />
      <SecuritySection locale={locales} />
      <EbookPromoSection locale={locales} />
      <SpreadSection locale={locales} />
      <FinalCtaSection locale={locales} />
    </>
  );
}
