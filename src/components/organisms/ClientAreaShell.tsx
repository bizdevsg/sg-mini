"use client";

import { useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { ClientAreaSidebarButton } from "@/components/atoms/ClientAreaSidebarButton";
import { ClientAreaActionModal } from "@/components/molecules/ClientAreaActionModal";
import { ClientAreaHeaderTicker } from "@/components/molecules/ClientAreaHeaderTicker";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import {
  TABS,
  buildClientAreaHeroSlides,
  formatClock,
  getClientAreaMarketPrices,
  getDashboardCopy,
  getQuickActionIconMap,
  getSidebarIconMap,
  resolveClientAreaTabHref,
} from "@/components/organisms/client-area.shared";
import type {
  AccountMode,
  ActionId,
  ClientAreaBannerRecord,
  ClientAreaHeroSlide,
  DashboardCopy,
  MarketPrice,
  TabId,
} from "@/components/organisms/client-area.types";
import { getMessages } from "@/locales";
import type { AppLocale, AppMessages } from "@/locales";

const CLOCK_PLACEHOLDER = "--.--.-- WIB";

export type ClientAreaShellRenderProps = {
  accountMode: AccountMode;
  clientArea: AppMessages["clientArea"];
  copy: DashboardCopy;
  currentAccount: DashboardCopy["demoAccount"];
  currentSlide: number;
  heroSlides: ClientAreaHeroSlide[];
  isAccountMenuOpen: boolean;
  onActionClick: (actionId: ActionId) => void;
  onSelectAccountMode: (mode: AccountMode) => void;
  prices: MarketPrice[];
  quickActionIconMap: ReturnType<typeof getQuickActionIconMap>;
  setCurrentSlide: Dispatch<SetStateAction<number>>;
  setIsAccountMenuOpen: Dispatch<SetStateAction<boolean>>;
};

type ClientAreaShellProps = {
  activeTab: TabId;
  children: (props: ClientAreaShellRenderProps) => ReactNode;
  initialBanners?: ClientAreaBannerRecord[];
  locale: AppLocale;
};

export function ClientAreaShell({
  activeTab,
  children,
  initialBanners = [],
  locale,
}: ClientAreaShellProps) {
  const messages = getMessages(locale);
  const clientArea = messages.clientArea;
  const copy = getDashboardCopy(locale);
  const sidebarIconMap = getSidebarIconMap();
  const quickActionIconMap = getQuickActionIconMap();
  const { quotes } = useLiveQuoteStream();
  const [accountMode, setAccountMode] = useState<AccountMode>("demo");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActionId | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [clockLabel, setClockLabel] = useState(CLOCK_PLACEHOLDER);
  const heroSlides = buildClientAreaHeroSlides(copy, initialBanners);
  const prices: MarketPrice[] = getClientAreaMarketPrices(quotes);

  useEffect(() => {
    setClockLabel(formatClock(locale));

    const clockTimer = window.setInterval(() => {
      setClockLabel(formatClock(locale));
    }, 1000);

    const tickerTimer = window.setInterval(() => {
      setTickerIndex((current) => (current + 1) % copy.breakingNews.length);
    }, 8000);

    const slideTimer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(tickerTimer);
      window.clearInterval(slideTimer);
    };
  }, [copy.breakingNews.length, heroSlides.length, locale]);

  const currentNews = copy.breakingNews[tickerIndex];
  const currentAccount =
    accountMode === "demo" ? copy.demoAccount : copy.realAccount;

  const handleSelectAccountMode = (mode: AccountMode) => {
    setAccountMode(mode);
    setIsAccountMenuOpen(false);
  };

  return (
    <section className="space-y-5">
      <ClientAreaHeaderTicker
        copy={copy}
        currentNews={currentNews}
        clockLabel={clockLabel}
      />

      <section>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <nav className="w-full shrink-0 xl:w-20">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-black p-4">
              {TABS.map((tab) => {
                const tabLabel =
                  clientArea.sidebar.navItems.find((item) => item.id === tab)
                    ?.label ?? tab;

                return (
                  <ClientAreaSidebarButton
                    key={tab}
                    href={resolveClientAreaTabHref(locale, tab)}
                    icon={sidebarIconMap[tab]}
                    label={tabLabel}
                    isActive={activeTab === tab}
                  />
                );
              })}
            </div>
          </nav>

          <div className="min-w-0 flex-1">
            {children({
              accountMode,
              clientArea,
              copy,
              currentAccount,
              currentSlide,
              heroSlides,
              isAccountMenuOpen,
              onActionClick: setActiveModal,
              onSelectAccountMode: handleSelectAccountMode,
              prices,
              quickActionIconMap,
              setCurrentSlide,
              setIsAccountMenuOpen,
            })}
          </div>
        </div>
      </section>

      {activeModal ? (
        <ClientAreaActionModal
          actionId={activeModal}
          copy={copy}
          locale={locale}
          onClose={() => setActiveModal(null)}
        />
      ) : null}
    </section>
  );
}
