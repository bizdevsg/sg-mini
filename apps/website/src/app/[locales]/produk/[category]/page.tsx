import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCatalogBrowser } from "@/components/organisms/ProductCatalogBrowser";
import {
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

type ProductCategoryPageProps = {
  params: Promise<{ locales: string; category: string }>;
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

export function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    PRODUCT_PAGE_CATEGORIES.map((category) => ({
      locales: locale,
      category,
    })),
  );
}

export async function generateMetadata({
  params,
}: ProductCategoryPageProps): Promise<Metadata> {
  const { locales, category } = await params;
  assertValidLocale(locales);
  assertValidCategory(category);

  const page = getMessages(locales).productPage;
  const categoryCopy = page.categories[category];

  return {
    title: categoryCopy.title,
    description: categoryCopy.description,
    alternates: {
      canonical: `/${locales}/produk/${category}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/produk/${category}`,
        ]),
      ),
    },
  };
}

export default async function ProductCategoryPage({
  params,
}: ProductCategoryPageProps) {
  const { locales, category } = await params;
  assertValidLocale(locales);
  assertValidCategory(category);

  const messages = getMessages(locales);
  const copy = messages.productPage;
  const homeLabel = messages.app.homeLabel;
  const items = await getProductCatalog(category);

  return (
    <ProductCatalogBrowser
      items={items}
      locale={locales}
      homeLabel={homeLabel}
      category={category}
      copy={copy}
    />
  );
}
