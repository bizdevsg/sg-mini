import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BannerDetailPage as BannerDetailPageView } from "@/components/organisms/BannerDetailPage";
import { getBannerBySlug } from "@/lib/banner";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type BannerTermsRouteProps = {
  params: Promise<{ locales: string; slug: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: BannerTermsRouteProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const banner = await getBannerBySlug(slug);
  const labels = getMessages(locales).bannerDetailPage;

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
      canonical: `/${locales}/syarat-dan-ketentuan/${banner.slug || slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/syarat-dan-ketentuan/${banner.slug || slug}`,
        ]),
      ),
    },
  };
}

export default async function BannerTermsRoute({
  params,
}: BannerTermsRouteProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const banner = await getBannerBySlug(slug);

  if (!banner) {
    notFound();
  }

  return (
    <BannerDetailPageView
      banner={banner}
      locale={locales}
      messages={getMessages(locales)}
    />
  );
}
