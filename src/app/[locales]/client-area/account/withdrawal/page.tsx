import type { Metadata } from "next";

import { ClientAreaAccountWithdrawalHistoryView } from "@/components/organisms/ClientAreaAccountWithdrawalHistoryView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { getLocaleConfig, getMessages, SUPPORTED_LOCALES } from "@/locales";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
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
  const title = `${clientArea.withdrawalHistoryPage.title} | ${clientArea.pageTitle}`;

  return {
    title,
    description: `${clientArea.withdrawalHistoryPage.description} ${clientArea.pageDescription}`,
    alternates: {
      canonical: `/${locales}/client-area/account/withdrawal`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((supportedLocale) => [
          getLocaleConfig(supportedLocale).lang,
          `/${supportedLocale}/client-area/account/withdrawal`,
        ]),
      ),
    },
  };
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
