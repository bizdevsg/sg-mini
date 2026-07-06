"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaSidebarButton } from "@/components/atoms/ClientAreaSidebarButton";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ClientAreaHeaderTicker } from "@/components/molecules/ClientAreaHeaderTicker";
import { ClientAreaLogoutModal } from "@/components/molecules/ClientAreaLogoutModal";
import {
  TABS,
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
};

export function ClientAreaShell({
  activeTab,
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
  const activeTabLabel =
    clientArea.sidebar.navItems.find((item) => item.id === activeTab)?.label ??
    activeTab;
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
    <section className="relative bg-fixed bg-cover bg-top bg-no-repeat pb-16 pt-24 sm:pb-20 sm:pt-28"
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <div className="absolute h-full w-screen top-0 left-0 bg-black/50 backdrop-blur-xs" />

      <SectionContainer className="relative">
        <section className="space-y-5">
          <ClientAreaHeaderTicker
            breakingLabel={copy.breakingLabel}
            breakingNews={resolvedBreakingNews}
          />

          <section>
            <div className="sm:hidden mb-5">
              <details className="overflow-hidden rounded-2xl border border-zinc-800 bg-black/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-zinc-100">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/20 bg-zinc-900/80 text-yellow-500">
                      <FontAwesomeIcon icon={sidebarIconMap[activeTab]} className="text-base" />
                    </span>
                    <span>{activeTabLabel}</span>
                  </span>
                  <FontAwesomeIcon
                    icon={["fas", "chevron-down"]}
                    className="text-xs text-zinc-400"
                  />
                </summary>

                <div className="space-y-2 border-t border-zinc-800 p-3">
                  {TABS.map((tab) => {
                    const tabLabel =
                      clientArea.sidebar.navItems.find((item) => item.id === tab)
                        ?.label ?? tab;

                    return (
                      <Link
                        key={tab}
                        href={resolveClientAreaTabHref(locale, tab)}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors ${activeTab === tab
                          ? "bg-zinc-900 text-yellow-500"
                          : "text-zinc-300 hover:bg-zinc-900/80 hover:text-yellow-400"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={sidebarIconMap[tab]}
                          className="w-4 text-center"
                        />
                        <span>{tabLabel}</span>
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-left text-sm text-red-300 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "right-from-bracket"]}
                      className="w-4 text-center"
                    />
                    <span>{clientArea.topbar.logoutLabel}</span>
                  </button>
                </div>
              </details>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <nav className="hidden w-full shrink-0 sm:sticky sm:top-28 sm:block sm:self-start sm:w-fit space-y-4">
                <div className="flex w-full flex-row items-start justify-between gap-2 rounded-r-xl bg-zinc-900 backdrop-blur-2xl overflow-hidden sm:flex-col sm:justify-center">
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

                {/*  */}
                <div className="flex w-full flex-row items-start justify-between rounded-xl bg-red-500/5 gap-2 backdrop-blur-2xl overflow-hidden sm:flex-col sm:justify-center">
                  <button
                    type="button"
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex w-full py-5 pl-5 pr-10 items-center gap-2 rounded-xl border-2 border-red-500/20 bg-linear-to-r from-red-500/10 text-red-300 transition-all duration-300 hover:border-red-700 hover:from-red-500/30 hover:text-red-500 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "power-off"]}
                      className="text-lg"
                    />

                    <span className="text-xs font-medium leading-tight">
                      {clientArea.topbar.logoutLabel}
                    </span>
                  </button>
                </div>
              </nav>

              <div className="w-full min-w-0 flex-1 self-start">{children}</div>
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
