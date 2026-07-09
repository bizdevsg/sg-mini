import type { Metadata } from "next";

import { ClientAreaAccountDepositHistoryView } from "@/components/organisms/ClientAreaAccountDepositHistoryView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { getLocaleConfig, getMessages, SUPPORTED_LOCALES } from "@/locales";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaAccountDepositHistoryPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaAccountDepositHistoryPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const { clientArea } = getMessages(locales);
  const title = `${clientArea.depositHistoryPage.title} | ${clientArea.pageTitle}`;

  return {
    title,
    description: `${clientArea.depositHistoryPage.description} ${clientArea.pageDescription}`,
    alternates: {
      canonical: `/${locales}/client-area/account/deposit`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((supportedLocale) => [
          getLocaleConfig(supportedLocale).lang,
          `/${supportedLocale}/client-area/account/deposit`,
        ]),
      ),
    },
  };
}

export default async function ClientAreaAccountDepositHistoryPage({
  params,
}: ClientAreaAccountDepositHistoryPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaAccountDepositHistoryView
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
