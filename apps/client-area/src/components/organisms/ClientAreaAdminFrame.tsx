"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bell, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { HeaderActions } from "@/components/molecules/HeaderActions";
import {
  ClientAreaDesktopSidebarNav,
  ClientAreaSidebarLogoutButton,
} from "@/components/molecules/ClientAreaDesktopSidebarNav";
import { ClientAreaLogoutModal } from "@/components/molecules/ClientAreaLogoutModal";
import {
  getSidebarIconMap,
  resolveClientAreaTabHref,
} from "@/components/organisms/client-area.shared";
import type { TabId } from "@/components/organisms/client-area.types";
import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";
import { getMessages, type AppLocale } from "@/locales";
import { PUBLIC_WEBSITE_URL } from "@/lib/env";

type ClientAreaAdminFrameProps = {
  children: ReactNode;
  locale: AppLocale;
  profile: ClientAreaSessionProfile;
};

function resolveActiveTab(pathname: string): TabId {
  if (pathname.includes("/client-area/account")) {
    return "account";
  }

  if (pathname.includes("/client-area/transaction")) {
    return "transaction";
  }

  if (pathname.includes("/client-area/news")) {
    return "news";
  }

  if (pathname.includes("/client-area/ebook")) {
    return "ebook";
  }

  if (
    pathname.includes("/client-area/market") &&
    !pathname.includes("/client-area/market-signal")
  ) {
    return "market";
  }

  return "home";
}

export function ClientAreaAdminFrame({
  children,
  locale,
  profile,
}: ClientAreaAdminFrameProps) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const messages = getMessages(locale);
  const clientArea = messages.clientArea;
  const activeTab = resolveActiveTab(pathname);
  const sidebarIconMap = useMemo(() => getSidebarIconMap(), []);
  const activeLabel =
    clientArea.sidebar.navItems.find((item) => item.id === activeTab)?.label ??
    clientArea.pageTitle;

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileSidebarOpen]);

  const navigation = (
    <ClientAreaDesktopSidebarNav
      activeTab={activeTab}
      clientArea={clientArea}
      locale={locale}
      sidebarIconMap={sidebarIconMap}
    />
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-white/8 bg-[#09090b] lg:flex">
        <div className="flex h-20 items-center border-b border-white/8 px-5">
          <Link
            href={resolveClientAreaTabHref(locale, "home")}
            className="flex min-w-0 items-center gap-3"
          >
            <Image
              src="/assets/Logo SG-WEB111.png"
              alt={messages.app.brandName}
              width={35}
              height={35}
              className="h-7 w-7 shrink-0 object-contain"
              priority
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-wide text-white">
                {messages.app.brandName}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">
                Client Area
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Navigation
          </p>
          {navigation}
        </div>

        <div className="space-y-2 border-t border-white/8 p-3">
          <a
            href={`${PUBLIC_WEBSITE_URL}/${locale}`}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-400 transition-colors duration-200 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <ArrowLeft className="h-[18px] w-[18px] text-zinc-500" />
            <span className="text-sm font-medium leading-tight">
              {locale === "id" ? "Kembali ke Website" : "Back to Website"}
            </span>
          </a>
          <ClientAreaSidebarLogoutButton
            label={clientArea.topbar.logoutLabel}
            onClick={() => setIsLogoutModalOpen(true)}
          />
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="fixed inset-x-0 top-0 z-40 flex h-20 items-center justify-between gap-4 border-b border-white/8 bg-[#09090b]/95 px-4 shadow-[0_12px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:px-6 lg:left-64 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open dashboard menu"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-amber-500 transition hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-500">Client Area</p>
              <h1 className="truncate text-base font-bold text-white sm:text-lg">
                {activeLabel}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-zinc-400 transition hover:border-amber-500/30 hover:text-amber-400 sm:inline-flex"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-zinc-950" />
            </button>

            <HeaderActions
              clientAreaProfile={profile}
              isClientAreaAuthenticated
              isClientAreaEnabled
              locale={locale}
              compact
            />

            <div className="hidden h-9 w-px bg-white/8 sm:block" />

            <Link
              href={resolveClientAreaTabHref(locale, "account")}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-1.5 pr-2.5 transition hover:border-amber-500/30 hover:bg-white/[0.06]"
            >
              <Image
                src={profile.avatarSrc}
                alt={profile.displayName}
                width={34}
                height={34}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <div className="hidden min-w-0 text-left md:block">
                <p className="max-w-32 truncate text-xs font-semibold text-white">
                  {profile.displayName}
                </p>
                <p className="text-[10px] text-zinc-500">{profile.accountId}</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="min-w-0 pt-20">{children}</main>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        aria-hidden={!isMobileSidebarOpen}
      >
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setIsMobileSidebarOpen(false)}
          className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity ${isMobileSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(88vw,20rem)] flex-col border-r border-white/10 bg-zinc-950 shadow-2xl transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-white/8 px-5">
            <Link
              href={resolveClientAreaTabHref(locale, "home")}
              className="flex items-center gap-3"
            >
              <Image
                src="/assets/Logo SG-WEB111.png"
                alt={messages.app.brandName}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="text-sm font-bold text-white">Client Area</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-amber-500">
                  Dashboard
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label="Close dashboard menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              Navigation
            </p>
            {navigation}
          </div>

          <div className="space-y-2 border-t border-white/8 p-3">
            {/* <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <Image
                src={profile.avatarSrc}
                alt={profile.displayName}
                width={40}
                height={40}
                className="h-9 w-9 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {profile.displayName}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {profile.accountId}
                </p>
              </div>
            </div> */}
            <ClientAreaSidebarLogoutButton
              label={clientArea.topbar.logoutLabel}
              onClick={() => setIsLogoutModalOpen(true)}
            />
          </div>
        </aside>
      </div>

      <ClientAreaLogoutModal
        isOpen={isLogoutModalOpen}
        locale={locale}
        onClose={() => setIsLogoutModalOpen(false)}
        redirectPath={pathname}
      />
    </div>
  );
}
