"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { submitClientAreaLogout } from "@/app/actions/clientAreaLogout";
import { ClientAreaSidebarButton } from "@/components/atoms/ClientAreaSidebarButton";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ClientAreaHeaderTicker } from "@/components/molecules/ClientAreaHeaderTicker";
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
  const messages = getMessages(locale);
  const clientArea = messages.clientArea;
  const sidebarIconMap = getSidebarIconMap();
  const pathname = usePathname();
  const copy = getDashboardCopy(locale);
  const activeTabLabel =
    clientArea.sidebar.navItems.find((item) => item.id === activeTab)?.label ??
    activeTab;
  const resolvedBreakingNews =
    breakingNews && breakingNews.length > 0 ? breakingNews : copy.breakingNews;

  return (
    <section className="relative pb-16 pt-24 sm:pb-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-x-6 top-12 h-36 rounded-full bg-yellow-500/10 blur-3xl sm:inset-x-16 sm:h-44" />

      <SectionContainer className="relative">
        <section className="space-y-5">
          <ClientAreaHeaderTicker breakingNews={resolvedBreakingNews} copy={copy} />

          <section>
            <div className="sm:hidden mb-5">
              <details className="overflow-hidden rounded-2xl border border-zinc-800 bg-black/90">
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
                      <a
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
                      </a>
                    );
                  })}

                  <form action={submitClientAreaLogout}>
                    <input type="hidden" name="locale" value={locale} />
                    <input
                      type="hidden"
                      name="redirectPath"
                      value={pathname ?? resolveClientAreaTabHref(locale, "home")}
                    />
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-2xl cursor-pointer border border-red-500/20 bg-red-500/10 px-3 py-3 text-left text-sm text-red-300 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "right-from-bracket"]}
                        className="w-4 text-center"
                      />
                      <span>{clientArea.topbar.logoutLabel}</span>
                    </button>
                  </form>
                </div>
              </details>
            </div>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-start">
              <nav className="hidden w-full shrink-0 sm:sticky sm:top-28 sm:block sm:self-start sm:w-fit">
                <div className="flex w-full flex-row items-center justify-between gap-2 rounded-xl bg-black/50 backdrop-blur-2xl p-4 sm:flex-col sm:justify-center">
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

                  <form action={submitClientAreaLogout} className="w-full">
                    <input type="hidden" name="locale" value={locale} />
                    <input
                      type="hidden"
                      name="redirectPath"
                      value={pathname ?? resolveClientAreaTabHref(locale, "home")}
                    />
                    <button
                      type="submit"
                      className="flex flex-col w-full sm:w-20 sm:h-17 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "power-off"]}
                        className="text-lg"
                      />

                      <span className="mt-1 text-xs font-medium leading-tight">
                        {clientArea.topbar.logoutLabel}
                      </span>
                    </button>
                  </form>
                </div>
              </nav>

              <div className="min-w-0 flex-1 self-start">{children}</div>
            </div>
          </section>

          {modal}
        </section>
      </SectionContainer>
    </section>
  );
}
