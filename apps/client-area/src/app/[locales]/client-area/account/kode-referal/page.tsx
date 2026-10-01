import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ClientAreaAccountReferralView } from "@/components/organisms/ClientAreaAccountReferralView";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { CLIENT_AREA_REFERRAL_ENABLED } from "@/lib/client-area-features";
import { buildPrivateMetadata } from "@/lib/metadata";
import { getMessages } from "@/locales";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
  getClientAreaSeoLabel,
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
  const title = `${clientArea.referralPage.title} | ${getClientAreaSeoLabel(locales)}`;
  const path = `/${locales}/client-area/account/kode-referal`;

  return buildPrivateMetadata({
    title,
    description: `${clientArea.referralPage.description} ${clientArea.pageDescription}`,
    locale: locales,
    path,
  });
}

export default async function ClientAreaAccountReferralPage({
  params,
}: ClientAreaAccountReferralPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  if (!CLIENT_AREA_REFERRAL_ENABLED) {
    redirect(`/${locales}/client-area/account`);
  }

  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaAccountReferralView
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
