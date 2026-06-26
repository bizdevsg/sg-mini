import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LogoMark } from "@/components/atoms/LogoMark";
import { PUBLIC_REGISTER_URL } from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaTopbarProps = {
  locale: AppLocale;
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

export function ClientAreaTopbar({ locale }: ClientAreaTopbarProps) {
  const { clientArea } = getMessages(locale);

  return (
    <header className="border-b border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="bg-[#10b567] text-white">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs font-semibold sm:px-6 lg:px-8">
          <span>{clientArea.topbar.supportLabel}</span>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span>{clientArea.topbar.supportPhone}</span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" />
            <span>{clientArea.user.name}</span>
            <Link
              href={resolveLocalizedHref(locale, "/")}
              className="transition hover:text-white/85"
            >
              {clientArea.topbar.logoutLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#122c3e] text-white">
        <div className="mx-auto flex max-w-[1480px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="shrink-0">
            <LogoMark locale={locale} />
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex">
            {clientArea.topbar.navItems.map((item) => (
              <Link
                key={item.label}
                href={resolveLocalizedHref(locale, item.href)}
                className="text-sm font-semibold tracking-[0.01em] text-white/90 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <a
              href={PUBLIC_REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-xl border border-[#10b567] px-4 py-2 text-sm font-semibold text-[#10b567] transition hover:bg-[#10b567] hover:text-white md:inline-flex"
            >
              {clientArea.topbar.primaryCta}
            </a>

            <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 md:flex">
              <span className="text-lg font-semibold">{clientArea.user.accountId}</span>
              <span className="rounded-md bg-[#10b567] px-2 py-1 text-xs font-bold text-white">
                {clientArea.topbar.accountMode}
              </span>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
            >
              <FontAwesomeIcon icon={["fas", "bell"]} className="h-5 w-5" />
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">
                {clientArea.topbar.notificationCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-4 py-4 text-sm text-slate-500 sm:px-6 lg:px-8">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <FontAwesomeIcon icon={["fas", "chevron-right"]} className="h-3 w-3" />
        </span>
        <span className="font-medium text-slate-600">{clientArea.topbar.breadcrumb}</span>
      </div>
    </header>
  );
}
