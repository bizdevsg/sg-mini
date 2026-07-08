import type { Metadata } from "next";

import { ClientAreaAccountReferralView } from "@/components/organisms/ClientAreaAccountReferralView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { getLocaleConfig, getMessages, SUPPORTED_LOCALES } from "@/locales";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaAccountReferralPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaAccountReferralPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const { clientArea } = getMessages(locales);
  const title = `${clientArea.referralPage.title} | ${clientArea.pageTitle}`;
  const path = `/${locales}/client-area/account/kode-referal`;

  return {
    title,
    description: `${clientArea.referralPage.description} ${clientArea.pageDescription}`,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((supportedLocale) => [
          getLocaleConfig(supportedLocale).lang,
          `/${supportedLocale}/client-area/account/kode-referal`,
        ]),
      ),
    },
  };
}

export default async function ClientAreaAccountReferralPage({
  params,
}: ClientAreaAccountReferralPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaAccountReferralView
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
