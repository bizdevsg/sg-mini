"use client";

import type { LucideIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { ClientAreaQuickActionsGrid } from "@/components/molecules/ClientAreaQuickActionsGrid";
import { ClientAreaTikTokEmbed } from "@/components/molecules/ClientAreaTikTokEmbed";
import { ClientAreaAccountOverview } from "@/components/organisms/ClientAreaAccountOverview";
import { ClientAreaAdvancedChart } from "@/components/organisms/ClientAreaAdvancedChart";
import { ClientAreaEconomicCalendarSection } from "@/components/organisms/ClientAreaEconomicCalendarSection";
import { ClientAreaMarketInsightSection } from "@/components/organisms/ClientAreaMarketInsightSection";
import type {
  AccountMode,
  AccountSnapshot,
  ActionId,
  ClientAreaHeroSlide,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import { useLiveAccountSummary } from "@/hooks/useLiveAccountSummary";
import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";
import type { MarketSignalRecord } from "@/lib/market-signal";
import type { TikTokVideo } from "@/lib/tiktok-video.shared";
import type { AppLocale, AppMessages } from "@/locales";

/**
 * Beranda is the page people watch, so its official account figures are
 * re-fetched faster than the slow default; live prices move them in between.
 */
const HOME_ACCOUNT_SUMMARY_REFRESH_MS = 15000;

type ClientAreaHomePanelProps = {
  accountMode: AccountMode;
  clientArea: AppMessages["clientArea"];
  copy: DashboardCopy;
  currentAccount: AccountSnapshot;
  currentSlide: number;
  detailLabel: string;
  economicCalendarEvents: EconomicCalendarEvent[];
  heroSlides: ClientAreaHeroSlide[];
  isAccountMenuOpen: boolean;
  locale: AppLocale;
  marketSignals: MarketSignalRecord[];
  onActionClick: (actionId: ActionId) => void;
  onSelectAccountMode: (mode: AccountMode) => void;
  quickActionIconMap: Record<ActionId, LucideIcon>;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
  setIsAccountMenuOpen: Dispatch<SetStateAction<boolean>>;
  tikTokVideo: TikTokVideo;
};

export function ClientAreaHomePanel({
  accountMode,
  clientArea,
  copy,
  currentAccount,
  economicCalendarEvents,
  isAccountMenuOpen,
  locale,
  marketSignals,
  onActionClick,
  onSelectAccountMode,
  quickActionIconMap,
  setIsAccountMenuOpen,
  tikTokVideo,
}: ClientAreaHomePanelProps) {
  // One fetch feeds both card instances (mobile and desktop layouts).
  const {
    state: summaryState,
    retry: retrySummary,
  } = useLiveAccountSummary(accountMode, {
    refreshMs: HOME_ACCOUNT_SUMMARY_REFRESH_MS,
  });

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(288px,0.8fr)] xl:items-start xl:gap-y-4">
      <div className="min-w-0 xl:col-start-2 xl:row-start-1">
        <ClientAreaAccountOverview
          accountMode={accountMode}
          copy={copy}
          currentAccount={currentAccount}
          isAccountMenuOpen={isAccountMenuOpen}
          locale={locale}
          onRetry={retrySummary}
          summaryState={summaryState}
          onSelectAccountMode={onSelectAccountMode}
          onToggleAccountMode={() => setIsAccountMenuOpen((open) => !open)}
        />
      </div>

      <div className="min-w-0 xl:col-start-2 xl:row-start-2">
        <ClientAreaTikTokEmbed copy={clientArea.homeTikTok} video={tikTokVideo} />
      </div>

      <div className="flex min-w-0 flex-col gap-6 xl:col-start-1 xl:row-span-2 xl:row-start-1">

        {/*
        <ClientAreaHeroSlideshow
          slides={heroSlides}
          currentSlide={currentSlide}
          detailLabel={detailLabel}
          setCurrentSlide={setCurrentSlide}
        />
        */}

        <ClientAreaAdvancedChart
          copy={clientArea.homeChart}
          locale={locale}
          marketWatchCopy={copy}
          // The chart iframe consumes the same upstream token as the account
          // BFF. Let the initial summary request finish (and persist any csrf
          // rotation) before handing that token to MiniMicro.
          miniChartEnabled={summaryState.status !== "loading"}
        />

        <ClientAreaQuickActionsGrid
          clientArea={clientArea}
          locale={locale}
          onActionClick={onActionClick}
          quickActionIconMap={quickActionIconMap}
        />

        <ClientAreaEconomicCalendarSection
          copy={copy}
          events={economicCalendarEvents}
          locale={locale}
        />

        <ClientAreaMarketInsightSection
          copy={copy}
          items={marketSignals}
          locale={locale}
        />
      </div>
    </div>
  );
}
