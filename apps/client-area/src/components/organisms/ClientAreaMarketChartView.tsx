"use client";

import { X } from "lucide-react";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { EmptyStatePanel } from "@/components/molecules/EmptyStatePanel";
import { MiniChart } from "@/components/organisms/MiniChart";
import {
  getClientAreaTradingViewPresetById,
  resolveLocalizedHref,
  type ClientAreaTradingViewPreset,
} from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import { getLiveQuoteDisplay } from "@/lib/live-quotes";
import type { AppLocale } from "@/locales";
import Link from "next/link";
import Image from "next/image";
import { id } from "zod/locales";

type ClientAreaMarketChartViewProps = {
  breakingNews?: BreakingNewsItem[];
  initialPresetId: string;
  locale: AppLocale;
  presets: ClientAreaTradingViewPreset[];
  hasMarketData?: boolean;
};

export function ClientAreaMarketChartView({
  breakingNews,
  initialPresetId,
  locale,
  presets,
  hasMarketData = true,
}: ClientAreaMarketChartViewProps) {
  const fallbackPreset = presets[0];
  const selectedPreset = hasMarketData
    ? getClientAreaTradingViewPresetById(initialPresetId, presets) ?? fallbackPreset
    : null;
  const marketLabel = selectedPreset
    ? getLiveQuoteDisplay(selectedPreset.marketCode).label
    : locale === "id"
      ? "Data Tidak Ada"
      : "Data Unavailable";
  const marketCodeLabel = selectedPreset?.marketCode ?? initialPresetId.toUpperCase();

  return (
    <ClientAreaShell activeTab="market" breakingNews={breakingNews} locale={locale}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={resolveLocalizedHref(locale, "/client-area/market")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-yellow-500 bg-zinc-900 text-yellow-500 transition-all duration-300 hover:rotate-90 hover:bg-yellow-500 hover:text-black"
          >
            <X size={18} strokeWidth={2.5} />
          </Link>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-500/80">
              Live Chart
            </p>
            <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
              <h1 className="break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
                {marketLabel}
              </h1>

              <p className="text-xs font-semibold text-zinc-400 sm:text-sm">({marketCodeLabel})</p>
            </div>
          </div>
        </div>

        {hasMarketData && selectedPreset ? (
          <MiniChart symbol={selectedPreset.marketCode} />
        ) : (
          <EmptyStatePanel
            title={locale === "id" ? "Data Tidak Ada" : "Data Unavailable"}
            body={
              locale === "id"
                ? "Kode market ini belum tersedia untuk MiniMicro WebView."
                : "This market code is not available for the MiniMicro WebView yet."
            }
            variant="warning"
            className="py-10"
          />
        )}
      </div>

      <div className="bg-red-500/10 border border-red-500/30 mt-7 p-5 rounded-3xl">
        <div className="space-y-1">
          <Image src={"/assets/TradingView.png"} alt="Logo TradingView" height={100} width={200} />
          <div>
            {
              locale === "id" ?
                "Chart yang kami gunakan disediakan oleh TradingView, sebuah platform charting bagi para trader dan investor dari seluruh penjuru dunia. Temukan berbagai instrumen finansial seperti chart EURUSD, XAUUSD dan instrumen forex lainnya, dan juga peralatan seperti kalender ekonomi, berita finansial, dan masih banyak lagi yang tersedia secara gratis dan dapat membantu dalam aktivitas trading dan investasi Anda."
                :
                "Our chart is provided by TradingView, an international charting platform for traders and investors, providing high-performance market data such as EURUSD chart, XAUUSD and other forex instruments, as well as advanced tools for more comprehensive market analysis: detailed symbol charts, the latest financial news, economic calendar, and more – simply everything a prepared trader may need."
            }
          </div>
        </div>
      </div>
    </ClientAreaShell>
  );
}
