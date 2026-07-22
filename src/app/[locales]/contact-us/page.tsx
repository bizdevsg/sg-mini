import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactPageHero } from "@/components/organisms/ContactPageHero";
import { ContactComplaintLinksSection } from "@/components/organisms/ContactComplaintLinksSection";
import { ContactPageMainSection } from "@/components/organisms/ContactPageMainSection";
import { getCompanyProfile } from "@/lib/company-profile";
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
  const companyProfile = await getCompanyProfile(locales);
  const complaintLinks = [
    {
      href: companyProfile.complaintLink,
      label: page.complaintLinks.onlineComplaint,
    },
    {
      href: `mailto:${companyProfile.email}`,
      label: page.complaintLinks.emailComplaint,
    },
  ];

  return (
    <>
      <ContactPageHero locale={locales} copy={page} />
      <ContactPageMainSection
        locale={locales}
        copy={page}
        companyProfile={companyProfile}
      />
      <ContactComplaintLinksSection items={complaintLinks} />
    </>
  );
}
