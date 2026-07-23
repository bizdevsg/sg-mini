import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PromoPage } from "@/components/organisms/PromoPage";
import { getBannerRecords } from "@/lib/banner";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type PromoRouteProps = {
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
}: PromoRouteProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).promoPage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locales}/promo`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/promo`,
        ]),
      ),
    },
  };
}

export default async function PromoRoute({ params }: PromoRouteProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const [messages, banners] = await Promise.all([
    Promise.resolve(getMessages(locales)),
    getBannerRecords(),
  ]);

  return (
    <PromoPage
      banners={banners}
      locale={locales}
      messages={messages}
    />
  );
}
