"use client";

import { useEffect, useState } from "react";

import { ClientAreaActionModal } from "@/components/molecules/ClientAreaActionModal";
import { ClientAreaHomePanel } from "@/components/organisms/ClientAreaHomePanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  buildClientAreaHeroSlides,
  getClientAreaMarketPrices,
  getDashboardCopy,
  getQuickActionIconMap,
} from "@/components/organisms/client-area.shared";
import type {
  AccountMode,
  ActionId,
  BreakingNewsItem,
  ClientAreaBannerRecord,
} from "@/components/organisms/client-area.types";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import { getMessages } from "@/locales";
import type { AppLocale } from "@/locales";

type ClientAreaDashboardProps = {
  breakingNews?: BreakingNewsItem[];
  initialBanners?: ClientAreaBannerRecord[];
  locale: AppLocale;
};

export function ClientAreaDashboard({
  breakingNews,
  initialBanners = [],
  locale,
}: ClientAreaDashboardProps) {
  const clientArea = getMessages(locale).clientArea;
  const copy = getDashboardCopy(locale);
  const quickActionIconMap = getQuickActionIconMap();
  const heroSlides = buildClientAreaHeroSlides(copy, initialBanners);
  const { quotes } = useLiveQuoteStream();
  const prices = getClientAreaMarketPrices(quotes);
  const [accountMode, setAccountMode] = useState<AccountMode>("demo");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActionId | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => {
      window.clearInterval(slideTimer);
    };
  }, [heroSlides.length]);

  const currentAccount =
    accountMode === "demo" ? copy.demoAccount : copy.realAccount;

  const handleSelectAccountMode = (mode: AccountMode) => {
    setAccountMode(mode);
    setIsAccountMenuOpen(false);
  };

  return (
    <ClientAreaShell
      activeTab="home"
      breakingNews={breakingNews}
      locale={locale}
      modal={
        activeModal ? (
          <ClientAreaActionModal
            actionId={activeModal}
            copy={copy}
            locale={locale}
            onClose={() => setActiveModal(null)}
          />
        ) : null
      }
    >
      <ClientAreaHomePanel
        clientArea={clientArea}
        copy={copy}
        heroSlides={heroSlides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        currentAccount={currentAccount}
        accountMode={accountMode}
        isAccountMenuOpen={isAccountMenuOpen}
        setIsAccountMenuOpen={setIsAccountMenuOpen}
        onSelectAccountMode={handleSelectAccountMode}
        quickActionIconMap={quickActionIconMap}
        onActionClick={setActiveModal}
        prices={prices}
      />
    </ClientAreaShell>
  );
}
