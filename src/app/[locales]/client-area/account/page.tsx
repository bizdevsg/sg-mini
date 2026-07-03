import type { Metadata } from "next";

import { ClientAreaAccountView } from "@/components/organisms/ClientAreaAccountView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import {
  assertValidLocale,
  buildClientAreaSubpageMetadata,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaAccountPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaAccountPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return buildClientAreaSubpageMetadata(locales, "account");
}

export default async function ClientAreaAccountPage({
  params,
}: ClientAreaAccountPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return <ClientAreaAccountView breakingNews={breakingNews} locale={locales} />;
}
