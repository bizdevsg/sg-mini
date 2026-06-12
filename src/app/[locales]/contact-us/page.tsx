import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPageHero } from "@/components/organisms/ContactPageHero";
import { ContactComplaintLinksSection } from "@/components/organisms/ContactComplaintLinksSection";
import { ContactPageMainSection } from "@/components/organisms/ContactPageMainSection";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type ContactPageProps = {
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
}: ContactPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).contactPage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locales}/contact-us`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/contact-us`,
        ]),
      ),
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).contactPage;

  return (
    <>
      <ContactPageHero locale={locales} copy={page} />
      <ContactPageMainSection copy={page} />
      <ContactComplaintLinksSection
        items={[
          {
            href: "https://pengaduan.bappebti.go.id/",
            label: "Pengaduan Online",
          },
          {
            href: "mailto:customer.care@solidgold.co.id",
            label: "Penyampaian Keluhan Online",
          },
        ]}
      />
    </>
  );
}
