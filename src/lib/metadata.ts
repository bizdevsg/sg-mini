import type { Metadata } from "next";

import { PUBLIC_SITE_URL } from "@/lib/env";
import {
  getLocaleConfig,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

const BRAND_NAME = "Solid Gold Berjangka";
const DEFAULT_OG_IMAGE_PATH = "/assets/BANNER-UTAMA-SOLID.png";

export const SITE_METADATA_BASE = new URL(PUBLIC_SITE_URL);
export const DEFAULT_SITE_TITLE =
  "Solid Gold Berjangka | Futures Trading, Live Quotes, and Market Insights";
export const DEFAULT_SITE_DESCRIPTION =
  "PT Solid Gold Berjangka provides trusted futures trading services, market insights, and investment education to help traders make informed decisions.";

type PublicMetadataInput = {
  title: string;
  description: string;
  locale: AppLocale;
  path: string;
  type?: "website" | "article";
  image?: string;
};

type PrivateMetadataInput = {
  title: string;
  description: string;
  locale: AppLocale;
  path: string;
};

function buildLocalizedAlternates(path: string): Metadata["alternates"] {
  return {
    canonical: path,
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        getLocaleConfig(locale).lang,
        `/${locale}${path.replace(/^\/[a-z]{2}/, "")}`,
      ]),
    ),
  };
}

function resolveMetadataImage(image?: string) {
  if (!image || image.startsWith("data:")) {
    return DEFAULT_OG_IMAGE_PATH;
  }

  return image;
}

export function buildPublicMetadata({
  title,
  description,
  locale,
  path,
  type = "website",
  image,
}: PublicMetadataInput): Metadata {
  const metadataImage = resolveMetadataImage(image);
  const language = getLocaleConfig(locale).lang;

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(path),
    openGraph: {
      type,
      url: path,
      siteName: BRAND_NAME,
      locale: language,
      title,
      description,
      images: [
        {
          url: metadataImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [metadataImage],
    },
  };
}

export function buildPrivateMetadata({
  title,
  description,
  locale,
  path,
}: PrivateMetadataInput): Metadata {
  void locale;

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(path),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}
