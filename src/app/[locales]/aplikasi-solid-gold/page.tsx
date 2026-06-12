import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SolidGoldAppDownloadSection } from "@/components/organisms/SolidGoldAppDownloadSection";
import { SolidGoldAppHeroSection } from "@/components/organisms/SolidGoldAppHeroSection";
import {
  getSolidGoldAppPageContent,
  getLocaleConfig,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type SolidGoldAppPageProps = {
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
}: SolidGoldAppPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const pageContent = getSolidGoldAppPageContent(locales);

  return {
    title: pageContent.meta.title,
    description: pageContent.meta.description,
    alternates: {
      canonical: `/${locales}/aplikasi-solid-gold`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/aplikasi-solid-gold`,
        ]),
      ),
    },
  };
}

export default async function SolidGoldAppPage({
  params,
}: SolidGoldAppPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const pageContent = getSolidGoldAppPageContent(locales);

  return (
    <main>
      <SolidGoldAppHeroSection
        eyebrow={pageContent.hero.eyebrow}
        title={pageContent.hero.title}
        description={pageContent.hero.description}
        primaryCtaLabel={pageContent.hero.primaryCta}
        primaryCtaHref={pageContent.platforms.items[0]?.stores[0]?.href ?? "#"}
        secondaryCtaLabel={pageContent.hero.secondaryCta}
        secondaryCtaHref={pageContent.platforms.items[0]?.stores[1]?.href ?? "#"}
        badges={pageContent.hero.badges}
        visualSrc={pageContent.hero.visualSrc}
        visualAlt={pageContent.hero.visualAlt}
      />

      <SolidGoldAppDownloadSection
        title={pageContent.platforms.title}
        subtitle={pageContent.platforms.subtitle}
        platforms={pageContent.platforms.items}
        benefitsTitle={pageContent.benefits.title}
        benefits={pageContent.benefits.items}
      />
    </main>
  );
}
