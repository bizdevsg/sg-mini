import type { Metadata } from "next";

import { ClientAreaMarketChartView } from "@/components/organisms/ClientAreaMarketChartView";
import { getClientAreaTradingViewPresetById } from "@/components/organisms/client-area.shared";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import { buildPrivateMetadata } from "@/lib/metadata";
import {
  getTradingViewApiPresets,
  getTradingViewPresets,
} from "@/lib/tradingview-symbol";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
} from "@/app/[locales]/client-area/client-area-page.shared";

type ClientAreaMarketChartPageProps = {
  params: Promise<{ locales: string; symbol: string }>;
};

export async function generateStaticParams() {
  const presets = await getTradingViewApiPresets();

  return generateClientAreaStaticParams().flatMap(({ locales }) =>
    presets.map((preset) => ({
      locales,
      symbol: preset.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: ClientAreaMarketChartPageProps): Promise<Metadata> {
  const { locales, symbol } = await params;
  assertValidLocale(locales);

  const apiPresets = await getTradingViewApiPresets();
  const preset = getClientAreaTradingViewPresetById(symbol, apiPresets);

  return buildPrivateMetadata({
    title: preset
      ? `${preset.label} Live Chart | Client Area`
      : locales === "id"
        ? "Data Tidak Ada | Client Area"
        : "Data Unavailable | Client Area",
    description: preset
      ? `Live chart for ${preset.marketCode}.`
      : locales === "id"
        ? "Data TradingView untuk kode market ini belum tersedia."
        : "TradingView data for this market code is not available yet.",
    locale: locales,
    path: `/${locales}/client-area/market/${symbol}`,
  });
}

export default async function ClientAreaMarketChartPage({
  params,
}: ClientAreaMarketChartPageProps) {
  const { locales, symbol } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  const apiPresets = await getTradingViewApiPresets();
  const allPresets = await getTradingViewPresets();
  const preset = getClientAreaTradingViewPresetById(symbol, apiPresets);
  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaMarketChartView
      breakingNews={breakingNews}
      initialPresetId={preset?.id ?? symbol}
      hasMarketData={Boolean(preset)}
      locale={locales}
      presets={allPresets}
    />
  );
}
