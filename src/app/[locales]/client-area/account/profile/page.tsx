import type { Metadata } from "next";

import { ClientAreaAccountProfileView } from "@/components/organisms/ClientAreaAccountProfileView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import {
  getLocaleConfig,
  getMessages,
  SUPPORTED_LOCALES,
} from "@/locales";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaAccountProfilePageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaAccountProfilePageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const { clientArea } = getMessages(locales);
  const title = `${clientArea.accountPage.sections.personal} | ${clientArea.pageTitle}`;
  const path = `/${locales}/client-area/account/profile`;

  return {
    title,
    description: `${clientArea.accountPage.sections.personal}. ${clientArea.pageDescription}`,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((supportedLocale) => [
          getLocaleConfig(supportedLocale).lang,
          `/${supportedLocale}/client-area/account/profile`,
        ]),
      ),
    },
  };
}

export default async function ClientAreaAccountProfilePage({
  params,
}: ClientAreaAccountProfilePageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaAccountProfileView
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
