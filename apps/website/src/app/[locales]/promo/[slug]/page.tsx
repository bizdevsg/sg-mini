import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PromoDetailPage } from "@/components/organisms/PromoDetailPage";
import { getBannerBySlug } from "@/lib/banner";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type BannerPromoRouteProps = {
  params: Promise<{ locales: string; slug: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: BannerPromoRouteProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const banner = await getBannerBySlug(slug);
  const labels = getMessages(locales).promoDetailPage;

  if (!banner) {
    return {
      title: labels.breadcrumb,
      description: labels.emptyContent,
    };
  }

  return {
    title: banner.title || labels.breadcrumb,
    description: banner.excerpt || labels.emptyContent,
    alternates: {
      canonical: `/${locales}/promo/${banner.slug || slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/promo/${banner.slug || slug}`,
        ]),
      ),
    },
  };
}

export default async function BannerPromoRoute({
  params,
}: BannerPromoRouteProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const banner = await getBannerBySlug(slug);

  if (!banner) {
    notFound();
  }

  return (
    <PromoDetailPage
      banner={banner}
      locale={locales}
      messages={getMessages(locales)}
    />
  );
}
