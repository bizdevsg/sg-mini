import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAreaDashboard } from "@/components/organisms/ClientAreaDashboard";
import { getBannerRecords } from "@/lib/banner";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import {
  createEmptyEconomicCalendarRange,
  getEconomicCalendarRange,
} from "@/lib/economic-calendar";
import { getMarketSignalFeedByCategory } from "@/lib/market-signal";
import { getTikTokVideo } from "@/lib/tiktok-video";
import {
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
} from "@/locales";
import type { AppLocale } from "@/locales";
import { buildPrivateMetadata } from "@/lib/metadata";

type ClientAreaPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locales: locale,
  }));
}

export async function generateMetadata({
  params,
}: ClientAreaPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);

  return buildPrivateMetadata({
    title: messages.clientArea.metadataTitle,
    description: messages.clientArea.pageDescription,
    locale: locales,
    path: `/${locales}/client-area`,
  });
}

export default async function ClientAreaPage({
  params,
}: ClientAreaPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);
  const [
    initialBanners,
    breakingNews,
    economicCalendarToday,
    marketSignalFeed,
    tikTokVideo,
  ] = await Promise.all([
      getBannerRecords(),
      getClientAreaBreakingNews(locales),
      getEconomicCalendarRange("today").catch(() =>
        createEmptyEconomicCalendarRange("today"),
      ),
      getMarketSignalFeedByCategory(),
      getTikTokVideo(),
    ]);

  return (
    <ClientAreaDashboard
      breakingNews={breakingNews}
      economicCalendarEvents={economicCalendarToday.events}
      initialBanners={initialBanners}
      locale={locales}
      marketSignals={marketSignalFeed.items}
      tikTokVideo={tikTokVideo.data}
    />
  );
}
