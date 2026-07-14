"use client";

import type { LucideIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { ClientAreaHeroSlideshow } from "@/components/molecules/ClientAreaHeroSlideshow";
import { ClientAreaQuickActionsGrid } from "@/components/molecules/ClientAreaQuickActionsGrid";
import { ClientAreaAccountOverview } from "@/components/organisms/ClientAreaAccountOverview";
import { ClientAreaEconomicCalendarSection } from "@/components/organisms/ClientAreaEconomicCalendarSection";
import { ClientAreaMarketWatchSection } from "@/components/organisms/ClientAreaMarketWatchSection";
import { ClientAreaSentimentPanel } from "@/components/organisms/ClientAreaSentimentPanel";
import type {
  AccountMode,
  AccountSnapshot,
  ActionId,
  ClientAreaHeroSlide,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaHomePanelProps = {
  accountMode: AccountMode;
  clientArea: AppMessages["clientArea"];
  copy: DashboardCopy;
  currentAccount: AccountSnapshot;
  currentSlide: number;
  economicCalendarEvents: EconomicCalendarEvent[];
  heroSlides: ClientAreaHeroSlide[];
  isAccountMenuOpen: boolean;
  locale: AppLocale;
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
  currentSlide,
  economicCalendarEvents,
  heroSlides,
  isAccountMenuOpen,
  locale,
  onActionClick,
  onSelectAccountMode,
  quickActionIconMap,
  setCurrentSlide,
  setIsAccountMenuOpen,
}: ClientAreaHomePanelProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(200px,0.8fr)]">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="xl:hidden">
          <ClientAreaAccountOverview
            accountMode={accountMode}
            copy={copy}
            currentAccount={currentAccount}
            isAccountMenuOpen={isAccountMenuOpen}
            onSelectAccountMode={onSelectAccountMode}
            onToggleAccountMode={() => setIsAccountMenuOpen((open) => !open)}
          />
        </div>

        <ClientAreaHeroSlideshow
          slides={heroSlides}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

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
      </div>

      <div className="flex flex-col gap-4">
        <div className="hidden xl:block">
          <ClientAreaAccountOverview
            accountMode={accountMode}
            copy={copy}
            currentAccount={currentAccount}
            isAccountMenuOpen={isAccountMenuOpen}
            onSelectAccountMode={onSelectAccountMode}
            onToggleAccountMode={() => setIsAccountMenuOpen((open) => !open)}
          />
        </div>
      </div>
    </div>
  );
}
