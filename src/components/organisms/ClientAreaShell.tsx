"use client";

import { useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ClientAreaDesktopSidebarNav } from "@/components/molecules/ClientAreaDesktopSidebarNav";
import { ClientAreaHeaderTicker } from "@/components/molecules/ClientAreaHeaderTicker";
import { ClientAreaLogoutModal } from "@/components/molecules/ClientAreaLogoutModal";
import { ClientAreaMobileSidebarNav } from "@/components/molecules/ClientAreaMobileSidebarNav";
import {
  type ClientAreaAdvertiseVisibilityMode,
  getDashboardCopy,
  getSidebarIconMap,
  resolveClientAreaTabHref,
} from "@/components/organisms/client-area.shared";
import type {
  BreakingNewsItem,
  TabId,
} from "@/components/organisms/client-area.types";
import { getMessages } from "@/locales";
import type { AppLocale } from "@/locales";

type ClientAreaShellProps = {
  activeTab: TabId;
  breakingNews?: BreakingNewsItem[];
  children: ReactNode;
  locale: AppLocale;
  modal?: ReactNode;
  advertiseVisibility?: ClientAreaAdvertiseVisibilityMode;
};

const ClientAreaAdvertiseSlot = dynamic(
  () =>
    import("@/components/molecules/ClientAreaAdvertiseSlot").then((module) => ({
      default: module.ClientAreaAdvertiseSlot,
    })),
  {
    ssr: false,
  },
);

export function ClientAreaShell({
  activeTab,
  advertiseVisibility = "auto",
  breakingNews,
  children,
  locale,
  modal,
}: ClientAreaShellProps) {
  const messages = useMemo(() => getMessages(locale), [locale]);
  const clientArea = messages.clientArea;
  const sidebarIconMap = useMemo(() => getSidebarIconMap(), []);
  const pathname = usePathname();
  const copy = useMemo(() => getDashboardCopy(locale), [locale]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const logoutRedirectPath =
    pathname ?? resolveClientAreaTabHref(locale, "home");
  const resolvedBreakingNews = useMemo(
    () =>
      breakingNews && breakingNews.length > 0
        ? breakingNews
        : copy.breakingNews,
    [breakingNews, copy.breakingNews],
  );

  return (
    <section
      className="relative overflow-x-clip lg:overflow-visible bg-cover bg-top bg-no-repeat bg-fixed pb-10 pt-[4.5rem] sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-28"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />

      <SectionContainer className="relative">
        <section className="space-y-4 sm:space-y-5">
          <ClientAreaHeaderTicker
            breakingLabel={copy.breakingLabel}
            breakingNews={resolvedBreakingNews}
          />

          <section>
            <div className="mb-4 lg:hidden">
              <ClientAreaMobileSidebarNav
                activeTab={activeTab}
                clientArea={clientArea}
                locale={locale}
                onLogoutClick={() => setIsLogoutModalOpen(true)}
                sidebarIconMap={sidebarIconMap}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-6">
              <aside className="hidden w-full shrink-0 lg:block lg:w-[220px] lg:self-start">
                <div className="lg:sticky lg:top-28 lg:h-fit">
                  <nav>
                    <ClientAreaDesktopSidebarNav
                      activeTab={activeTab}
                      clientArea={clientArea}
                      locale={locale}
                      onLogoutClick={() => setIsLogoutModalOpen(true)}
                      sidebarIconMap={sidebarIconMap}
                    />
                  </nav>
                </div>

                <div className="mt-4">
                  <ClientAreaAdvertiseSlot
                    key={`desktop-${pathname ?? "root"}`}
                    locale={locale}
                    pathname={pathname}
                    visibility={advertiseVisibility}
                  />
                </div>
              </aside>

              <div className="w-full min-w-0 self-start">{children}</div>
            </div>
          </section>

          {modal}
          <ClientAreaLogoutModal
            isOpen={isLogoutModalOpen}
            locale={locale}
            onClose={() => setIsLogoutModalOpen(false)}
            redirectPath={logoutRedirectPath}
          />
        </section>
      </SectionContainer>
    </section>
  );
}
