"use client";

import { useEffect, useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BookOpenText,
  ChartNoAxesCombined,
  ChevronDown,
  History,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ClientAreaSidebarButton } from "@/components/atoms/ClientAreaSidebarButton";
import { TABS, resolveClientAreaTabHref } from "@/components/organisms/client-area.shared";
import type { TabId } from "@/components/organisms/client-area.types";
import type { AppMessages, AppLocale } from "@/locales";

type ClientAreaDesktopSidebarNavProps = {
  activeTab: TabId;
  clientArea: AppMessages["clientArea"];
  locale: AppLocale;
  sidebarIconMap: Record<TabId, LucideIcon>;
  tradePilotEnabled: boolean;
};

type ClientAreaSidebarLogoutButtonProps = {
  label: string;
  onClick: () => void;
};

export function ClientAreaDesktopSidebarNav({
  activeTab,
  clientArea,
  locale,
  sidebarIconMap,
  tradePilotEnabled,
}: ClientAreaDesktopSidebarNavProps) {
  const pathname = usePathname();
  const tradePilotSubmenuId = useId();
  const [isTradePilotOpen, setIsTradePilotOpen] = useState(
    activeTab === "trade-pilot",
  );

  useEffect(() => {
    if (activeTab === "trade-pilot") {
      setIsTradePilotOpen(true);
    }
  }, [activeTab]);

  const tradePilotRoutes = [
    {
      href: `/${locale}/client-area/trade-pilot/analisis`,
      icon: ChartNoAxesCombined,
      label: clientArea.tradePilotPage.navigation.items.analysis,
    },
    {
      href: `/${locale}/client-area/trade-pilot/riwayat-performa`,
      icon: History,
      label: clientArea.tradePilotPage.navigation.items.performanceHistory,
    },
    {
      href: `/${locale}/client-area/trade-pilot/panduan`,
      icon: BookOpenText,
      label: clientArea.tradePilotPage.navigation.items.guide,
    },
  ];

  return (
    <nav className="space-y-1">
      {TABS.map((tab) => {
        const tabLabel =
          clientArea.sidebar.navItems.find((item) => item.id === tab)?.label ??
          tab;

        if (tab === "trade-pilot" && !tradePilotEnabled) {
          return (
            <ClientAreaSidebarButton
              key={tab}
              href={resolveClientAreaTabHref(locale, tab)}
              icon={sidebarIconMap[tab]}
              label={tabLabel}
              isActive={activeTab === tab}
            />
          );
        }

        if (tab === "trade-pilot") {
          const Icon = sidebarIconMap[tab];
          const isActive = activeTab === tab;

          return (
            <div key={tab}>
              <button
                type="button"
                onClick={() => setIsTradePilotOpen((isOpen) => !isOpen)}
                aria-expanded={isTradePilotOpen}
                aria-controls={tradePilotSubmenuId}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 ${isActive
                  ? "bg-amber-500/12 text-amber-400"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
                  }`}
              >
                <span
                  className={`absolute inset-y-2 left-0 w-0.5 rounded-full bg-amber-400 transition-opacity ${isActive ? "opacity-100" : "opacity-0"
                    }`}
                />
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive
                    ? "text-amber-400"
                    : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                />
                <span className="min-w-0 flex-1 text-sm font-medium leading-tight">
                  {tabLabel}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${isTradePilotOpen ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>

              <div
                id={tradePilotSubmenuId}
                role="group"
                aria-label={clientArea.tradePilotPage.navigation.label}
                aria-hidden={!isTradePilotOpen}
                inert={!isTradePilotOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${isTradePilotOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-5 space-y-1 border-l border-white/10 py-1 pl-3">
                    {tradePilotRoutes.map((route) => {
                      const RouteIcon = route.icon;
                      const isRouteActive =
                        pathname === route.href ||
                        pathname.startsWith(`${route.href}/`);

                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          aria-current={isRouteActive ? "page" : undefined}
                          className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${isRouteActive
                            ? "bg-trade-pilot/15 text-amber-400"
                            : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <RouteIcon
                              aria-hidden="true"
                              className={`h-4 w-4 shrink-0 ${isRouteActive ? "text-amber-400" : "text-zinc-600"}`}
                            />
                            <span>{route.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }

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
    </nav>
  );
}

export function ClientAreaSidebarLogoutButton({
  label,
  onClick,
}: ClientAreaSidebarLogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300"
    >
      <FontAwesomeIcon
        icon={["fas", "power-off"]}
        className="h-[18px] w-[18px] text-zinc-500"
      />

      <span className="text-sm font-medium leading-tight">{label}</span>
    </button>
  );
}
