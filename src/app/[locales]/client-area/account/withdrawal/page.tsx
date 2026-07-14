import type { Metadata } from "next";

import { ClientAreaAccountWithdrawalHistoryView } from "@/components/organisms/ClientAreaAccountWithdrawalHistoryView";
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

type ClientAreaAccountWithdrawalHistoryPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaAccountWithdrawalHistoryPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const { clientArea } = getMessages(locales);
  const title = `${clientArea.withdrawalHistoryPage.title} | ${getClientAreaSeoLabel(locales)}`;

  return buildPrivateMetadata({
    title,
    description: `${clientArea.withdrawalHistoryPage.description} ${clientArea.pageDescription}`,
    locale: locales,
    path: `/${locales}/client-area/account/withdrawal`,
  });
}

export default async function ClientAreaAccountWithdrawalHistoryPage({
  params,
}: ClientAreaAccountWithdrawalHistoryPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaAccountWithdrawalHistoryView
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
