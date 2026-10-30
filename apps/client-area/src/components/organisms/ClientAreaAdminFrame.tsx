"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { HeaderActions } from "@/components/molecules/HeaderActions";
import { ClientAreaDesktopSidebarNav } from "@/components/molecules/ClientAreaDesktopSidebarNav";
import { ClientAreaDateTime } from "@/components/molecules/ClientAreaDateTime";
import { ClientAreaLiveToast } from "@/components/molecules/ClientAreaLiveToast";
import { ClientAreaLogoutModal } from "@/components/molecules/ClientAreaLogoutModal";
import { ClientAreaNotificationMenu } from "@/components/molecules/ClientAreaNotificationMenu";
import { ClientAreaProfileMenu } from "@/components/molecules/ClientAreaProfileMenu";
import { useClientAreaProfile } from "@/components/providers/ClientAreaProfileProvider";
import { getSidebarIconMap } from "@/components/organisms/client-area.shared";
import type { TabId } from "@/components/organisms/client-area.types";
import { useClientAreaLiveSchedule } from "@/hooks/useClientAreaLiveSchedule";
import { getMessages, type AppLocale } from "@/locales";
import { PUBLIC_WEBSITE_URL } from "@/lib/env";

type ClientAreaAdminFrameProps = {
  children: ReactNode;
  locale: AppLocale;
  tradePilotEnabled: boolean;
};

function resolveActiveTab(pathname: string): TabId {
  if (pathname.includes("/client-area/account")) {
    return "account";
  }

  if (pathname.includes("/client-area/trade-pilot")) {
    return "trade-pilot";
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
  tradePilotEnabled,
}: ClientAreaAdminFrameProps) {
  const profile = useClientAreaProfile();
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const activeLiveSessions = useClientAreaLiveSchedule();
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
      tradePilotEnabled={tradePilotEnabled}
    />
  );
  const sidebarFooter = (
    <div className="border-t border-gray-600 p-3">
      <a
        href={`${PUBLIC_WEBSITE_URL}/${locale}`}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-zinc-400 transition-colors duration-200 hover:bg-amber-500/10 hover:text-amber-300"
      >
        <ArrowLeft className="h-[18px] w-[18px]" />
        <span className="text-sm font-medium leading-tight">
          {clientArea.sidebar.backToWebsite}
        </span>
      </a>
    </div>
  );

  return (
    <div className="min-h-screen min-w-0 max-w-full overflow-x-clip bg-black text-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-white/8 bg-[#09090b] lg:flex">
        <div className="flex h-20 items-center border-b border-white/8 px-5">
          <a
            href={`${PUBLIC_WEBSITE_URL}/${locale}`}
            className="flex min-w-0 items-center gap-3 mx-auto"
          >
            <Image
              src="/assets/logo-utama-new.webp"
              alt={messages.app.brandName}
              width={150}
              height={35}
              className="h-7 w-full shrink-0 object-contain"
              priority
            />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            {clientArea.sidebar.navigationLabel}
          </p>
          {navigation}
        </div>

        {sidebarFooter}

        {/* <div className="space-y-2 border-t border-white/8 p-3">
          <ClientAreaSidebarLogoutButton
            label={clientArea.topbar.logoutLabel}
            onClick={() => setIsLogoutModalOpen(true)}
          />
        </div> */}
      </aside>

      <div className="min-h-screen min-w-0 max-w-full lg:pl-64">
        <header className="fixed inset-x-0 top-0 z-40 flex h-20 min-w-0 items-center justify-between gap-2 border-b border-white/8 bg-[#09090b]/95 px-3 shadow-[0_12px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl min-[380px]:px-4 sm:gap-4 sm:px-6 lg:left-64 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label={messages.navbar.openMenuLabel}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-amber-500 transition hover:bg-white/10 min-[380px]:h-11 min-[380px]:w-11 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 hidden lg:block">
              <p className="text-xs font-medium text-zinc-500">
                {clientArea.pageTitle}
              </p>
              <h1 className="truncate text-base font-bold text-white sm:text-lg">
                {activeLabel}
              </h1>
            </div>
          </div>

          <div className="flex min-w-0 shrink-0 items-center gap-1.5 min-[380px]:gap-2 sm:gap-3">
            <ClientAreaDateTime locale={locale} />

            <ClientAreaNotificationMenu
              activeLiveSessions={activeLiveSessions}
              copy={clientArea.topbar.notifications}
              locale={locale}
            />

            <HeaderActions
              clientAreaProfile={profile}
              isClientAreaAuthenticated
              isClientAreaEnabled
              locale={locale}
              compact
            />

            <div className="hidden h-9 w-px bg-white/8 sm:block" />

            <ClientAreaProfileMenu
              accountModeLabel={clientArea.topbar.accountModeLabel}
              demoModeLabel={clientArea.topbar.demoModeLabel}
              logoutLabel={clientArea.topbar.logoutLabel}
              onLogout={() => setIsLogoutModalOpen(true)}
              profile={profile}
              realModeLabel={clientArea.topbar.realModeLabel}
            />
          </div>
        </header>

        <main className="w-full min-w-0 max-w-full overflow-x-clip pt-20">
          {children}
        </main>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        aria-hidden={!isMobileSidebarOpen}
      >
        <button
          type="button"
          aria-label={messages.navbar.closeMenuLabel}
          onClick={() => setIsMobileSidebarOpen(false)}
          className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity ${isMobileSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(88vw,20rem)] flex-col border-r border-white/10 bg-zinc-950 shadow-2xl transition-transform duration-300 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-white/8 px-5">
            <a
              href={`${PUBLIC_WEBSITE_URL}/${locale}`}
              className="flex min-w-0 items-center gap-3"
            >
              <Image
                src="/assets/logo-utama-new.webp"
                alt={messages.app.brandName}
                width={130}
                height={15}
                className="h-3 w-full shrink-0 object-contain"
                priority
              />
            </a>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-label={messages.navbar.closeMenuLabel}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              {clientArea.sidebar.navigationLabel}
            </p>
            {navigation}
          </div>

          {sidebarFooter}
        </aside>
      </div>

      <ClientAreaLogoutModal
        isOpen={isLogoutModalOpen}
        locale={locale}
        onClose={() => setIsLogoutModalOpen(false)}
        redirectPath={pathname}
      />

      <ClientAreaLiveToast
        activeSessions={activeLiveSessions}
        copy={clientArea.topbar.notifications.scheduledLive}
      />
    </div>
  );
}
