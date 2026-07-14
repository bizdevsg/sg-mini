import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { LucideIcon } from "lucide-react";

import { ClientAreaSidebarButton } from "@/components/atoms/ClientAreaSidebarButton";
import { TABS, resolveClientAreaTabHref } from "@/components/organisms/client-area.shared";
import type { TabId } from "@/components/organisms/client-area.types";
import type { AppMessages, AppLocale } from "@/locales";

type ClientAreaDesktopSidebarNavProps = {
  activeTab: TabId;
  clientArea: AppMessages["clientArea"];
  locale: AppLocale;
  onLogoutClick: () => void;
  sidebarIconMap: Record<TabId, LucideIcon>;
};

export function ClientAreaDesktopSidebarNav({
  activeTab,
  clientArea,
  locale,
  onLogoutClick,
  sidebarIconMap,
}: ClientAreaDesktopSidebarNavProps) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-zinc-900 backdrop-blur-2xl">
        {TABS.map((tab) => {
          const tabLabel =
            clientArea.sidebar.navItems.find((item) => item.id === tab)?.label ??
            tab;

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

      <div className="overflow-hidden rounded-2xl bg-red-500/5 backdrop-blur-2xl">
        <button
          type="button"
          onClick={onLogoutClick}
          className="flex w-full items-center gap-3 rounded-2xl border border-red-500/20 bg-linear-to-r from-red-500/10 px-4 py-4 text-red-300 transition-all duration-300 hover:border-red-700 hover:from-red-500/30 hover:text-red-500"
        >
          <FontAwesomeIcon icon={["fas", "power-off"]} className="text-base" />

          <span className="text-sm font-medium leading-tight">
            {clientArea.topbar.logoutLabel}
          </span>
        </button>
      </div>
    </>
  );
}

