import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Power } from "lucide-react";

import { TABS, resolveClientAreaTabHref } from "@/components/organisms/client-area.shared";
import type { TabId } from "@/components/organisms/client-area.types";
import type { AppMessages, AppLocale } from "@/locales";

type ClientAreaMobileSidebarNavProps = {
  activeTab: TabId;
  clientArea: AppMessages["clientArea"];
  locale: AppLocale;
  onLogoutClick: () => void;
  sidebarIconMap: Record<TabId, LucideIcon>;
};

export function ClientAreaMobileSidebarNav({
  activeTab,
  clientArea,
  locale,
  onLogoutClick,
  sidebarIconMap,
}: ClientAreaMobileSidebarNavProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black/40 p-3">
      <div className="grid grid-cols-3 gap-2 min-[420px]:grid-cols-6">
        {TABS.map((tab) => {
          const tabLabel =
            clientArea.sidebar.navItems.find((item) => item.id === tab)?.label ??
            tab;
          const Icon = sidebarIconMap[tab];

          return (
            <Link
              key={tab}
              href={resolveClientAreaTabHref(locale, tab)}
              aria-label={tabLabel}
              title={tabLabel}
              className={`inline-flex min-h-11 w-full items-center justify-center rounded-full border px-2 py-2 text-xs transition-colors ${
                activeTab === tab
                  ? "border-yellow-500/30 bg-zinc-900 text-yellow-500"
                  : "border-zinc-800 text-zinc-300 hover:bg-zinc-900/80 hover:text-yellow-400"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onLogoutClick}
          aria-label={clientArea.topbar.logoutLabel}
          title={clientArea.topbar.logoutLabel}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 px-2 py-2 text-xs text-red-300 transition-all duration-300 hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"
        >
          <Power className="w-5" />
        </button>
      </div>
    </div>
  );
}
