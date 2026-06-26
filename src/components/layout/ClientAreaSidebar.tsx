import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getMessages, type AppLocale } from "@/locales";

type ClientAreaSidebarProps = {
  locale: AppLocale;
  className?: string;
};

function resolveLocalizedHref(locale: AppLocale, href = "/") {
  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith(`/${locale}`)) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

export function ClientAreaSidebar({
  locale,
  className = "",
}: ClientAreaSidebarProps) {
  const { clientArea } = getMessages(locale);
  const iconMap: Record<string, IconProp> = {
    home: ["fas", "house"],
    market: ["fas", "chart-simple"],
    services: ["fas", "ellipsis"],
  };

  return (
    <aside className={`shrink-0 ${className}`}>
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-5">
        <div className="rounded-[28px] bg-white p-3 shadow-[0_12px_36px_rgba(15,23,42,0.08)]">
          <nav className="flex flex-col gap-3">
            {clientArea.sidebar.navItems.map((item, index) => {
              const isActive = index === 0;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex w-[74px] flex-col items-center gap-3 rounded-[22px] px-3 py-4 text-center transition ${
                    isActive
                      ? "bg-[#f1fbf6] text-[#0ea866]"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                      isActive ? "bg-[#0ea866] text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={iconMap[item.id] ?? ["fas", "circle"]}
                      className="h-4 w-4"
                    />
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <a
          href="#services"
          className="flex w-[74px] flex-col items-center gap-3 rounded-[22px] bg-[#10b567] px-3 py-5 text-center text-white shadow-[0_16px_30px_rgba(16,181,103,0.35)] transition hover:brightness-105"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <FontAwesomeIcon icon={["fas", "plus"]} className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">{clientArea.sidebar.tradeCta}</span>
        </a>
      </div>

      <div className="rounded-[22px] bg-white p-3 shadow-[0_12px_36px_rgba(15,23,42,0.08)] lg:hidden">
        <div className="flex items-center gap-3 overflow-x-auto">
          {clientArea.sidebar.navItems.map((item, index) => {
            const isActive = index === 0;

            return (
              <a
                key={item.id}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#0ea866] text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <FontAwesomeIcon
                  icon={iconMap[item.id] ?? ["fas", "circle"]}
                  className="h-4 w-4"
                />
                {item.label}
              </a>
            );
          })}

          <a
            href="#services"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#10b567] px-4 py-3 text-sm font-semibold text-white"
          >
            <FontAwesomeIcon icon={["fas", "plus"]} className="h-4 w-4" />
            {clientArea.sidebar.tradeCta}
          </a>
        </div>

        <a
          href={resolveLocalizedHref(locale, "/")}
          className="mt-3 inline-flex text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          {clientArea.sidebar.backToWebsite}
        </a>
      </div>
    </aside>
  );
}
