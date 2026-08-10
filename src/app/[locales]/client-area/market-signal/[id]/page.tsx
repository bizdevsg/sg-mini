import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAreaMarketSignalDetailPanel } from "@/components/organisms/ClientAreaMarketSignalDetailPanel";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { buildPrivateMetadata } from "@/lib/metadata";
import { getMarketSignalById } from "@/lib/market-signal";
import { getMessages, isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaMarketSignalDetailPageProps = {
  params: Promise<{ locales: string; id: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

function parseSignalId(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function generateMetadata({
  params,
}: ClientAreaMarketSignalDetailPageProps): Promise<Metadata> {
  const { locales, id } = await params;
  assertValidLocale(locales);

  const signalId = parseSignalId(id);
  const item = signalId ? await getMarketSignalById(signalId) : null;

  if (!item) {
    notFound();
  }

  return buildPrivateMetadata({
    title: `${item.categoryName} Signal | Market Insight`,
    description: item.title || `${item.categoryName} trading signal`,
    locale: locales,
    path: `/${locales}/client-area/market-signal/${item.id}`,
  });
}

export default async function ClientAreaMarketSignalDetailPage({
  params,
}: ClientAreaMarketSignalDetailPageProps) {
  const { locales, id } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  const signalId = parseSignalId(id);
  const item = signalId ? await getMarketSignalById(signalId) : null;

  if (!item) {
    notFound();
  }

  const backLabel = getMessages(locales).app.homeLabel;

  return (
    <ClientAreaMarketSignalDetailPanel
      backLabel={backLabel}
      item={item}
      locale={locales}
    />
  );
}
