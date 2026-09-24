import type { Metadata } from "next";

import { ClientAreaApprovalDocumentsView } from "@/components/organisms/ClientAreaApprovalDocumentsView";
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

type ClientAreaApprovalDocumentsPageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaApprovalDocumentsPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const { clientArea } = getMessages(locales);
  const { title, description } = clientArea.approvalDocumentPage;

  return buildPrivateMetadata({
    title: `${title} | ${getClientAreaSeoLabel(locales)}`,
    description,
    locale: locales,
    path: `/${locales}/client-area/account/document-approval`,
  });
}

export default async function ClientAreaApprovalDocumentsPage({
  params,
}: ClientAreaApprovalDocumentsPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaApprovalDocumentsView
      breakingNews={breakingNews}
      locale={locales}
    />
  );
}
