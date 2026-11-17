import type { Metadata } from "next";

import { ClientAreaDailyStatementView } from "@/components/organisms/ClientAreaDailyStatementView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { buildPrivateMetadata } from "@/lib/metadata";
import { getMessages } from "@/locales";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
  getClientAreaSeoLabel,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaDailyStatementPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaDailyStatementPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const { clientArea } = getMessages(locales);
  const { title, description } = clientArea.dailyStatementPage;

  return buildPrivateMetadata({
    title: `${title} | ${getClientAreaSeoLabel(locales)}`,
    description,
    locale: locales,
    path: `/${locales}/client-area/account/daily-statement`,
  });
}

export default async function ClientAreaDailyStatementPage({
  params,
}: ClientAreaDailyStatementPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaDailyStatementView breakingNews={breakingNews} locale={locales} />
  );
}
