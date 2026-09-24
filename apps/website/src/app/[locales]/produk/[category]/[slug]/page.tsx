import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailPage } from "@/components/organisms/ProductDetailPage";
import {
  getProductBySlug,
  getProductCatalog,
  isProductPageCategory,
  PRODUCT_PAGE_CATEGORIES,
  type ProductPageCategory,
} from "@/lib/products";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type ProductDetailPageProps = {
  params: Promise<{ locales: string; category: string; slug: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

function assertValidCategory(value: string): asserts value is ProductPageCategory {
  if (!isProductPageCategory(value)) {
    notFound();
  }
}

export async function generateStaticParams() {
  const categoryEntries = await Promise.all(
    PRODUCT_PAGE_CATEGORIES.map(async (category) => ({
      category,
      items: await getProductCatalog(category),
    })),
  );

  return SUPPORTED_LOCALES.flatMap((locale) =>
    categoryEntries.flatMap(({ category, items }) =>
      items.map((item) => ({
        locales: locale,
        category,
        slug: item.slug,
      })),
    ),
  );
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locales, category, slug } = await params;
  assertValidLocale(locales);
  assertValidCategory(category);

  const item = await getProductBySlug(category, slug);

  if (!item) {
    notFound();
  }

  return {
    title: item.name,
    description: item.description,
    alternates: {
      canonical: `/${locales}/produk/${category}/${item.slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/produk/${category}/${item.slug}`,
        ]),
      ),
    },
  };
}

export default async function Page({
  params,
}: ProductDetailPageProps) {
  const { locales, category, slug } = await params;
  assertValidLocale(locales);
  assertValidCategory(category);

  const messages = getMessages(locales);
  const copy = messages.productPage;
  const homeLabel = messages.app.homeLabel;
  const item = await getProductBySlug(category, slug);

  if (!item) {
    notFound();
  }

  return (
    <ProductDetailPage
      item={item}
      locale={locales}
      homeLabel={homeLabel}
      category={category}
      copy={copy}
    />
  );
}
