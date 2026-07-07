"use client";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { X } from "lucide-react";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import TradingView from "@/components/organisms/TradingView";
import {
  getClientAreaTradingViewPresetById,
  getClientAreaTradingViewPresets,
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import { getLiveQuoteDisplay } from "@/lib/live-quotes";
import type { AppLocale } from "@/locales";
import Link from "next/link";

type ClientAreaMarketChartViewProps = {
  breakingNews?: BreakingNewsItem[];
  initialPresetId: string;
  locale: AppLocale;
};

export function ClientAreaMarketChartView({
  breakingNews,
  initialPresetId,
  locale,
}: ClientAreaMarketChartViewProps) {
  const tradingViewPresets = getClientAreaTradingViewPresets();
  const fallbackPreset = tradingViewPresets[0];
  const selectedPreset =
    getClientAreaTradingViewPresetById(initialPresetId) ?? fallbackPreset;
  const marketLabel = getLiveQuoteDisplay(selectedPreset.marketCode).label;

  return (
    <ClientAreaShell activeTab="market" breakingNews={breakingNews} locale={locale}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href={resolveLocalizedHref(locale, "/client-area/market")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500 bg-zinc-900 text-yellow-500 transition-all duration-300 hover:rotate-90 hover:bg-yellow-500 hover:text-black"
          >
            <X size={18} strokeWidth={2.5} />
          </Link>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-500/80">
              Live Chart
            </p>
            <h1 className="break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
              {marketLabel}{" "}
              <span className="text-base text-zinc-400 sm:text-lg">({selectedPreset.marketCode})</span>
            </h1>
          </div>
        </div>

        <TradingView
          defaultPresetId={selectedPreset.id}
          presets={tradingViewPresets}
        />
      </div>
    </ClientAreaShell>
  );
}
