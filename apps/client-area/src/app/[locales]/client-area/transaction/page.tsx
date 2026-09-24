import type { Metadata } from "next";

import { ClientAreaTransactionsView } from "@/components/organisms/ClientAreaTransactionsView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import {
  assertValidLocale,
  buildClientAreaSubpageMetadata,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaTransactionPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaTransactionPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return buildClientAreaSubpageMetadata(locales, "transaction");
}

export default async function ClientAreaTransactionPage({
  params,
}: ClientAreaTransactionPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaTransactionsView breakingNews={breakingNews} locale={locales} />
  );
}
