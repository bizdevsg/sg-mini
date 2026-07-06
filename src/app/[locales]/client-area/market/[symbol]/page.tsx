import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClientAreaMarketChartView } from "@/components/organisms/ClientAreaMarketChartView";
import {
  getClientAreaTradingViewPresetById,
  getClientAreaTradingViewPresets,
} from "@/components/organisms/client-area.shared";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { getClientAreaBreakingNews } from "@/lib/client-area-news";
import {
  assertValidLocale,
  generateClientAreaStaticParams,
} from "@/app/[locales]/client-area/client-area-page.shared";
import {
  getLocaleConfig,
  SUPPORTED_LOCALES,
} from "@/locales";

type ClientAreaMarketChartPageProps = {
  params: Promise<{ locales: string; symbol: string }>;
};

export function generateStaticParams() {
  const presets = getClientAreaTradingViewPresets();

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

  const preset = getClientAreaTradingViewPresetById(symbol);

  if (!preset) {
    notFound();
  }

  return {
    title: `${preset.label} Live Chart`,
    description: `Live chart for ${preset.marketCode}.`,
    alternates: {
      canonical: `/${locales}/client-area/market/${preset.id}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/client-area/market/${preset.id}`,
        ]),
      ),
    },
  };
}

export default async function ClientAreaMarketChartPage({
  params,
}: ClientAreaMarketChartPageProps) {
  const { locales, symbol } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  const preset = getClientAreaTradingViewPresetById(symbol);

  if (!preset) {
    notFound();
  }

  const breakingNews = await getClientAreaBreakingNews(locales);

  return (
    <ClientAreaMarketChartView
      breakingNews={breakingNews}
      initialPresetId={preset.id}
      locale={locales}
    />
  );
}
