import type { Metadata } from "next";

import { ClientAreaNewsView } from "@/components/organisms/ClientAreaNewsView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaNewsContent } from "@/lib/client-area-news";
import {
  assertValidLocale,
  buildClientAreaSubpageMetadata,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaNewsPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaNewsPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return buildClientAreaSubpageMetadata(locales, "news");
}

export default async function ClientAreaNewsPage({
  params,
}: ClientAreaNewsPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const { articles, breakingNews } = await getClientAreaNewsContent(locales);

  return (
    <ClientAreaNewsView
      articles={articles}
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
