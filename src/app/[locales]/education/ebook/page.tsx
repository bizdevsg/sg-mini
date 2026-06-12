import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EbookHeroSection } from "@/components/organisms/EbookHeroSection";
import { EbookLibrarySection } from "@/components/organisms/EbookLibrarySection";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type EbookPageProps = {
  params: Promise<{ locales: string }>;
};

const EBOOK_LOGIN_URL = "https://ebook.newsmaker.id/login";
const EBOOK_REGISTER_URL = "https://ebook.newsmaker.id/register";

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
}: EbookPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales).ebookPage;

  return {
    title: messages.title,
    description: messages.description,
    alternates: {
      canonical: `/${locales}/education/ebook`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/education/ebook`,
        ]),
      ),
    },
  };
}

export default async function EbookPage({ params }: EbookPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales).ebookPage;

  return (
    <main>
      <EbookHeroSection
        eyebrow={messages.hero.eyebrow}
        title={messages.hero.title}
        description={messages.hero.description}
        primaryCtaLabel={messages.hero.primaryCta}
        primaryCtaHref={EBOOK_REGISTER_URL}
        secondaryCtaLabel={messages.hero.secondaryCta}
        secondaryCtaHref={EBOOK_LOGIN_URL}
      />

      <EbookLibrarySection
        title={messages.libraryTitle}
        subtitle={messages.librarySubtitle}
        items={messages.items}
        benefitsTitle={messages.benefitsTitle}
        benefits={messages.benefits}
      />
    </main>
  );
}
