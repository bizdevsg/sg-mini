"use client";

import { X } from "lucide-react";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { EmptyStatePanel } from "@/components/molecules/EmptyStatePanel";
import TradingView from "@/components/organisms/TradingView";
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
          <TradingView
            defaultPresetId={selectedPreset.id}
            locale={locale}
            presets={presets}
          />
        ) : (
          <EmptyStatePanel
            title={locale === "id" ? "Data Tidak Ada" : "Data Unavailable"}
            body={
              locale === "id"
                ? "Kode market ini belum tersedia di data TradingView dari API."
                : "This market code is not available in the TradingView API data yet."
            }
            variant="warning"
            className="py-10"
          />
        )}
      </div>
    </ClientAreaShell>
  );
}
