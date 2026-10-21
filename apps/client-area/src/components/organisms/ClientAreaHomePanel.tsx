"use client";

import type { LucideIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { ClientAreaQuickActionsGrid } from "@/components/molecules/ClientAreaQuickActionsGrid";
import { ClientAreaAccountOverview } from "@/components/organisms/ClientAreaAccountOverview";
import { ClientAreaAdvancedChart } from "@/components/organisms/ClientAreaAdvancedChart";
import { ClientAreaEconomicCalendarSection } from "@/components/organisms/ClientAreaEconomicCalendarSection";
import { ClientAreaMarketInsightSection } from "@/components/organisms/ClientAreaMarketInsightSection";
import { ClientAreaMarketWatchSection } from "@/components/organisms/ClientAreaMarketWatchSection";
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
import type { AppLocale, AppMessages } from "@/locales";

/**
 * Beranda is the page people watch, so its official account figures are
 * re-fetched faster than the slow default; live prices move them in between.
 */
const HOME_ACCOUNT_SUMMARY_REFRESH_MS = 5000;

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
}: ClientAreaHomePanelProps) {
  // One fetch feeds both card instances (mobile and desktop layouts).
  const {
    state: summaryState,
    retry: retrySummary,
  } = useLiveAccountSummary(accountMode, {
    refreshMs: HOME_ACCOUNT_SUMMARY_REFRESH_MS,
  });

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(200px,0.8fr)]">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="xl:hidden">
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

        {/*
        <ClientAreaHeroSlideshow
          slides={heroSlides}
          currentSlide={currentSlide}
          detailLabel={detailLabel}
          setCurrentSlide={setCurrentSlide}
        />
        */}

        <ClientAreaAdvancedChart copy={clientArea.homeChart} locale={locale} />

        <ClientAreaQuickActionsGrid
          clientArea={clientArea}
          locale={locale}
          onActionClick={onActionClick}
          quickActionIconMap={quickActionIconMap}
        />

        <ClientAreaMarketWatchSection copy={copy} locale={locale} />

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

      <div className="flex flex-col gap-4">
        <div className="hidden xl:block">
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
      </div>
    </div>
  );
}
