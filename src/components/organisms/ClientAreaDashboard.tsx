"use client";

import { ClientAreaHomePanel } from "@/components/organisms/ClientAreaHomePanel";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import type { ClientAreaBannerRecord } from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

type ClientAreaDashboardProps = {
  initialBanners?: ClientAreaBannerRecord[];
  locale: AppLocale;
};

export function ClientAreaDashboard({
  initialBanners = [],
  locale,
}: ClientAreaDashboardProps) {
  return (
    <ClientAreaShell
      activeTab="home"
      initialBanners={initialBanners}
      locale={locale}
    >
      {({
        accountMode,
        clientArea,
        copy,
        currentAccount,
        currentSlide,
        heroSlides,
        isAccountMenuOpen,
        onActionClick,
        onSelectAccountMode,
        prices,
        quickActionIconMap,
        setCurrentSlide,
        setIsAccountMenuOpen,
      }) => (
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
          onSelectAccountMode={onSelectAccountMode}
          quickActionIconMap={quickActionIconMap}
          onActionClick={onActionClick}
          prices={prices}
        />
      )}
    </ClientAreaShell>
  );
}
