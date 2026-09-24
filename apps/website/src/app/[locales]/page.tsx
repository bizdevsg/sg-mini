import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AppPromoSection } from "@/components/organisms/AppPromoSection";
import { BannerSlideshowSection } from "@/components/organisms/BannerSlideshowSection";
import { HeroSection } from "@/components/organisms/HeroSection";
import { HomeWhyChooseSection } from "@/components/organisms/HomeWhyChooseSection";
import { LiveQuoteSection } from "@/components/organisms/LiveQuoteSection";
import { RegulatorMarqueeSection } from "@/components/organisms/RegulatorMarqueeSection";
import { SpreadSection } from "@/components/organisms/SpreadSection";
import {
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";
import { BenefitSection } from "@/components/organisms/BenefitSection";
import { buildPublicMetadata } from "@/lib/metadata";

type LocalizedPageProps = {
  params: Promise<{ locales: string }>;
};

export const dynamic = "force-dynamic";

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
  const title =
    locales === "id"
      ? "Home"
      : "Home";

  return buildPublicMetadata({
    title,
    description: messages.app.description,
    locale: locales,
    path: `/${locales}`,
  });
}

export default async function LocalizedHome({ params }: LocalizedPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);


  return (
    <>
      <HeroSection locale={locales} />
      <RegulatorMarqueeSection locale={locales} />
      <Suspense fallback={null}>
        <BannerSlideshowSection locale={locales} />
      </Suspense>
      <LiveQuoteSection locale={locales} />
      <BenefitSection locale={locales} />
      <SpreadSection locale={locales} />
      <HomeWhyChooseSection locale={locales} />
      <AppPromoSection locale={locales} />
    </>
  );
}
