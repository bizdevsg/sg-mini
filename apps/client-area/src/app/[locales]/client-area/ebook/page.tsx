import type { Metadata } from "next";

import { ClientAreaEbookView } from "@/components/organisms/ClientAreaEbookView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { getEbookCategories } from "@/lib/ebook";
import {
  assertValidLocale,
  buildClientAreaSubpageMetadata,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaEbookPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaEbookPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return buildClientAreaSubpageMetadata(locales, "ebook");
}

export default async function ClientAreaEbookPage({
  params,
}: ClientAreaEbookPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const [breakingNews, categories] = await Promise.all([
    getClientAreaBreakingNews(locales),
    getEbookCategories(),
  ]);

  return (
    <ClientAreaEbookView
      breakingNews={breakingNews}
      categories={categories}
      locale={locales}
    />
  );
}
