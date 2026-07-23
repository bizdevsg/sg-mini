import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivacyPolicyPage } from "@/components/organisms/PrivacyPolicyPage";
import { getPrivacyPolicyRecord } from "@/lib/privacy-policy";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type PrivacyPolicyRouteProps = {
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
}: PrivacyPolicyRouteProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).privacyPolicyPage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locales}/privacy-policy`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/privacy-policy`,
        ]),
      ),
    },
  };
}

export default async function PrivacyPolicyRoute({
  params,
}: PrivacyPolicyRouteProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const [messages, privacyPolicy] = await Promise.all([
    Promise.resolve(getMessages(locales)),
    getPrivacyPolicyRecord(locales),
  ]);

  return (
    <PrivacyPolicyPage
      privacyPolicy={privacyPolicy}
      locale={locales}
      messages={messages}
    />
  );
}
