import type { Metadata } from "next";

import { ClientAreaAccountProfileView } from "@/components/organisms/ClientAreaAccountProfileView";
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
  const title = `${clientArea.accountPage.sections.personal} | ${getClientAreaSeoLabel(locales)}`;
  const path = `/${locales}/client-area/account/profile`;

  return buildPrivateMetadata({
    title,
    description: `${clientArea.accountPage.sections.personal}. ${clientArea.pageDescription}`,
    locale: locales,
    path,
  });
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
