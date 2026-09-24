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
  sidebarIconMap: Record<TabId, LucideIcon>;
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
}: ClientAreaDesktopSidebarNavProps) {
  return (
    <nav className="space-y-1">
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
