import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAreaEbookCategoryDetailView } from "@/components/organisms/ClientAreaEbookCategoryDetailView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { getEbookCategoryDetail } from "@/lib/ebook";
import { buildEbookCategoryPageDescription } from "@/lib/ebook.shared";
import { buildPrivateMetadata } from "@/lib/metadata";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaEbookCategoryPageProps = {
  params: Promise<{ locales: string; slug: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: ClientAreaEbookCategoryPageProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const detail = await getEbookCategoryDetail(slug);

  if (!detail) {
    notFound();
  }

  return buildPrivateMetadata({
    title: `${detail.category.name} | Client Area`,
    description: buildEbookCategoryPageDescription(
      detail.category.name,
      detail.category.ebooksCount,
      locales,
    ),
    locale: locales,
    path: `/${locales}/client-area/ebook/${detail.category.slug}`,
  });
}

export default async function ClientAreaEbookCategoryPage({
  params,
}: ClientAreaEbookCategoryPageProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  const [detail, breakingNews] = await Promise.all([
    getEbookCategoryDetail(slug),
    getClientAreaBreakingNews(locales),
  ]);

  if (!detail) {
    notFound();
  }

  return (
    <ClientAreaEbookCategoryDetailView
      breakingNews={breakingNews}
      categoryDetail={detail}
      locale={locales}
    />
  );
}
