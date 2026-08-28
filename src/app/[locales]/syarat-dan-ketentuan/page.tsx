import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TermsConditionsPage } from "@/components/organisms/TermsConditionsPage";
import { getTermsConditionsRecord } from "@/lib/terms-conditions";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type TermsConditionsRouteProps = {
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
}: TermsConditionsRouteProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).termsConditionsPage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locales}/syarat-dan-ketentuan`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/syarat-dan-ketentuan`,
        ]),
      ),
    },
  };
}

export default async function TermsConditionsRoute({
  params,
}: TermsConditionsRouteProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const [messages, termsConditions] = await Promise.all([
    Promise.resolve(getMessages(locales)),
    getTermsConditionsRecord(locales),
  ]);

  return (
    <TermsConditionsPage
      termsConditions={termsConditions}
      locale={locales}
      messages={messages}
    />
  );
}
