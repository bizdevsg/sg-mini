"use client";

import { useEffect, useState } from "react";

import { ClientAreaActionModal } from "@/components/molecules/ClientAreaActionModal";
import { ClientAreaFundTransferUnavailableModal } from "@/components/molecules/ClientAreaFundTransferUnavailableModal";
import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaHomePanel } from "@/components/organisms/ClientAreaHomePanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  buildClientAreaHeroSlides,
  getClientAreaAccountModeData,
  getDashboardCopy,
  getQuickActionIconMap,
} from "@/components/organisms/client-area.shared";
import type {
  AccountMode,
  ActionId,
  BreakingNewsItem,
  ClientAreaBannerRecord,
} from "@/components/organisms/client-area.types";
import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";
import { getMessages } from "@/locales";
import type { AppLocale } from "@/locales";

type ClientAreaDashboardProps = {
  breakingNews?: BreakingNewsItem[];
  economicCalendarEvents?: EconomicCalendarEvent[];
  initialBanners?: ClientAreaBannerRecord[];
  locale: AppLocale;
};

export function ClientAreaDashboard({
  breakingNews,
  economicCalendarEvents = [],
  initialBanners = [],
  locale,
}: ClientAreaDashboardProps) {
  const messages = getMessages(locale);
  const clientArea = messages.clientArea;
  const bannerDetailLabel = messages.promoDetailPage.breadcrumb;
  const copy = getDashboardCopy(locale);
  const quickActionIconMap = getQuickActionIconMap();
  const heroSlides = buildClientAreaHeroSlides(copy, initialBanners, locale);
  const { accountMode, setAccountMode } = useClientAreaAccountMode();
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

  const { currentAccount } = getClientAreaAccountModeData(copy, accountMode);

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
          activeModal === "deposit" || activeModal === "withdraw" ? (
            <ClientAreaFundTransferUnavailableModal
              action={activeModal === "deposit" ? "deposit" : "withdrawal"}
              isOpen
              locale={locale}
              onClose={() => setActiveModal(null)}
            />
          ) : (
            <ClientAreaActionModal
              actionId={activeModal}
              copy={copy}
              locale={locale}
              onClose={() => setActiveModal(null)}
            />
          )
        ) : null
      }
    >
      <ClientAreaHomePanel
        clientArea={clientArea}
        copy={copy}
        heroSlides={heroSlides}
        currentSlide={currentSlide}
        detailLabel={bannerDetailLabel}
        setCurrentSlide={setCurrentSlide}
        currentAccount={currentAccount}
        accountMode={accountMode}
        isAccountMenuOpen={isAccountMenuOpen}
        setIsAccountMenuOpen={setIsAccountMenuOpen}
        onSelectAccountMode={handleSelectAccountMode}
        quickActionIconMap={quickActionIconMap}
        onActionClick={setActiveModal}
        economicCalendarEvents={economicCalendarEvents}
        locale={locale}
      />
    </ClientAreaShell>
  );
}
