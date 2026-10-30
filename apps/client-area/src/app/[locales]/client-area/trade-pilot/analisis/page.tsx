import type { Metadata } from "next";

import {
  assertValidLocale,
  buildClientAreaTradePilotMetadata,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";
import { ClientAreaTradePilotPanel } from "@/components/organisms/ClientAreaTradePilotPanel";
import {
  createEmptyEconomicCalendarRange,
  getEconomicCalendarRange,
} from "@/lib/economic-calendar";
import { getMessages } from "@/locales";
import { getNewsFeed } from "@/lib/news";
import { getTradePilotBootstrap } from "@/lib/trade-pilot/trade-pilot";

type ClientAreaTradePilotAnalysisPageProps = ClientAreaSubpageProps & {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaTradePilotAnalysisPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return buildClientAreaTradePilotMetadata(locales, "analisis");
}

export default async function ClientAreaTradePilotAnalysisPage({
  params,
  searchParams,
}: ClientAreaTradePilotAnalysisPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  // Dari halaman Riwayat: ?analysisId= (lihat detail) atau ?instrument=&timeframe= (analisis ulang).
  const query = (await searchParams) ?? {};

  const { livePriceTicker, tradePilotPage } = getMessages(locales).clientArea;
  const [economicCalendarToday, bootstrap, { articles: latestNews }] =
    await Promise.all([
      getEconomicCalendarRange("today").catch(() =>
        createEmptyEconomicCalendarRange("today"),
      ),
      getTradePilotBootstrap(locales),
      getNewsFeed(locales, 5),
    ]);

  return (
    <ClientAreaTradePilotPanel
      copy={tradePilotPage.analysis}
      bootstrap={bootstrap}
      initialAnalysisId={firstParam(query.analysisId)}
      initialInstrumentId={firstParam(query.instrument)}
      initialTimeframe={firstParam(query.timeframe)}
      economicCalendarEvents={economicCalendarToday.events}
      latestNews={latestNews}
      livePriceLabel={livePriceTicker.label}
      locale={locales}
      mockDataLabel={tradePilotPage.access.mockDataLabel}
      newsLabel={livePriceTicker.newsLabel}
    />
  );
}
