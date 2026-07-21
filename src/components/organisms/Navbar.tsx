"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

import { getMessages, type AppLocale } from "@/locales";
import { LogoMark } from "@/components/atoms/LogoMark";
import { HeaderActions } from "@/components/molecules/HeaderActions";
import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";

import logoMark from "../../../public/assets/logo-utama.png";

type NavbarProps = {
  clientAreaProfile: ClientAreaSessionProfile | null;
  isClientAreaAuthenticated: boolean;
  locale: AppLocale;
};

// Maps shared menu href values to the active locale namespace.
function resolveLocalizedHref(locale: AppLocale, href = "/") {
  if (/^(https?:)?\/\//.test(href)) {
    return href;
  }

  if (href === "/trade-pilot") {
    return `/trade-pilot/${locale}`;
  }

  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith(`/${locale}`)) {
    return href;
  }

  if (href.startsWith("/")) {
    return `/${locale}${href}`;
  }

  return href;
}

function isTradePilotHref(href?: string) {
  return (
    href === "/trade-pilot" ||
    href === `/trade-pilot` ||
    href === "https://tradepilot.id/"
  );
}

// Swaps the TradePilot text label with its brand mark in the nav.
function renderMenuLabel(label: string, href?: string) {
  if (!isTradePilotHref(href)) {
    return <span>{label}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Image
        src="/assets/logo-tp.png"
        alt=""
        width={16}
        height={16}
        className="h-7 w-7 rounded-[4px] object-cover"
        aria-hidden="true"
      />

      <p className="block md:hidden">Trade Pilot</p>
    </div>
  );
}

export function Navbar({
  clientAreaProfile,
  locale,
  isClientAreaAuthenticated,
}: NavbarProps) {
  // Navbar interaction state.
  const [isPortalReady, setIsPortalReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<number | null>(null);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<number | null>(
    null,
  );
  const messages = getMessages(locale);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const menuIcon = isMobileMenuOpen
    ? (["fas", "xmark"] as IconProp)
    : (["fas", "bars"] as IconProp);

  useEffect(() => {
    setIsPortalReady(true);
  }, []);

  // Enables the glass header treatment after the page leaves the top.
  useEffect(() => {
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 0);
    };

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScrollState);
    };
  }, []);

  // Lets Escape close any open navbar surface.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setExpandedMobileGroup(null);
        setOpenDesktopGroup(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Closes desktop flyouts when clicking outside the desktop nav cluster.
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!desktopMenuRef.current) {
        return;
      }

      if (!desktopMenuRef.current.contains(event.target as Node)) {
        setOpenDesktopGroup(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  // Clears expanded mobile groups whenever the mobile panel closes.
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setExpandedMobileGroup(null);
    }
  }, [isMobileMenuOpen]);

  // Resets mobile-only state once the layout crosses back to desktop.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 56rem)");

    const syncNavbarMode = (event: MediaQueryList | MediaQueryListEvent) => {
      if (!event.matches) {
        return;
      }

      setIsMobileMenuOpen(false);
      setExpandedMobileGroup(null);
    };

    syncNavbarMode(mediaQuery);
    mediaQuery.addEventListener("change", syncNavbarMode);

    return () => {
      mediaQuery.removeEventListener("change", syncNavbarMode);
    };
  }, []);

  // Locks document scroll while the mobile sidebar is open.
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileGroup(null);
  };

  const showHeaderSurface = isScrolled || isMobileMenuOpen;
  const mobileSidebar = isPortalReady
    ? createPortal(
      <div
        id="mobile-nav-panel"
        className={`fixed inset-0 z-[70] nav:hidden ${isMobileMenuOpen
          ? "pointer-events-auto"
          : "pointer-events-none"
          }`}
      >
        <button
          type="button"
          aria-label={messages.navbar.closeMenuLabel}
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen
            ? "opacity-100"
            : "opacity-0"
            }`}
        />

        <aside
          className={`absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col border-l border-[rgba(255,255,255,0.08)] shadow-[-24px_0_80px_rgba(0,0,0,0.48)] ring-1 ring-[rgba(205,161,58,0.08)] backdrop-blur-xl transition-transform duration-300 ${isMobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.08)] px-5 py-5">
            <div>
              <Image
                src={logoMark}
                alt={messages.app.brandName}
                priority
                sizes="(min-width: 1280px) 300px, (min-width: 1024px) 260px, (min-width: 640px) 220px, 0px"
                className="h-12 w-auto object-contain lg:h-13 xl:h-14"
              />
            </div>

            <button
              type="button"
              aria-label={messages.navbar.closeMenuLabel}
              onClick={closeMobileMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-yellow-400 transition-colors duration-300 hover:bg-white/10"
            >
              <FontAwesomeIcon
                icon={["fas", "xmark"]}
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex flex-col gap-3">
              {/* Mobile accordion menu. */}
              {messages.navbar.menuGroups.map((group, index) => {
                const hasItems = Boolean(group.items?.length);
                const isExpanded = expandedMobileGroup === index;

                if (!hasItems) {
                  return (
                    <Link
                      key={`${group.label}-${index}`}
                      href={resolveLocalizedHref(locale, group.href)}
                      onClick={closeMobileMenu}
                      className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-black/20 hover:bg-black/50 px-4 py-4 text-sm font-medium text-yellow-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors duration-300 hover:text-yellow-200"
                    >
                      {renderMenuLabel(group.label, group.href)}
                    </Link>
                  );
                }

                return (
                  <div
                    key={`${group.label}-${index}`}
                    className={`rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-black/20 hover:bg-black/50 ${isExpanded ? "bg-black/50" : ""} shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]`}
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-nav-group-${index}`}
                      onClick={() =>
                        setExpandedMobileGroup((current) =>
                          current === index ? null : index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-medium text-yellow-300 transition-colors duration-300 hover:text-yellow-200"
                    >
                      <span>{group.label}</span>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                          }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.514a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <div
                      id={`mobile-nav-group-${index}`}
                      className={`grid transition-all duration-300 ${isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-col gap-1 px-2 pb-2">
                          {group.items?.map((item) =>
                            item.href ? (
                              <Link
                                key={item.label}
                                href={resolveLocalizedHref(locale, item.href)}
                                onClick={closeMobileMenu}
                                className="rounded-2xl px-3 py-3 text-left text-sm text-yellow-200/90 transition-colors duration-200 hover:bg-white/5 hover:text-yellow-100"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <button
                                key={item.label}
                                type="button"
                                className="rounded-2xl px-3 py-3 text-left text-sm text-yellow-200/90 transition-colors duration-200 hover:bg-white/5 hover:text-yellow-100"
                              >
                                {item.label}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div className="border-t border-[rgba(255,255,255,0.08)] p-4">
            Mobile panel footer actions.
            <HeaderActions
              clientAreaProfile={clientAreaProfile}
              locale={locale}
              mobilePanel
              className="w-full"
              isClientAreaAuthenticated={isClientAreaAuthenticated}
            />
          </div> */}
        </aside>
      </div>,
      document.body,
    )
    : null;

  return (
    <nav className="fixed top-0 z-50 w-full pointer-events-none">
      <div
        className={`transition-all duration-300 ${showHeaderSurface
          ? "bg-[rgba(12,12,12,0.5)] backdrop-blur-xl shadow-xl shadow-black/50"
          : ""
          }`}
      >
        <div className="relative mx-auto max-w-8xl px-4 sm:px-6 nav:px-10">
          <div className="pointer-events-auto flex items-center justify-between gap-3 py-3 sm:py-4">
            <LogoMark locale={locale} />

            <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
              {/* Mobile header locale trigger. */}
              <HeaderActions
                clientAreaProfile={clientAreaProfile}
                locale={locale}
                compact
                className="nav:hidden"
                isClientAreaAuthenticated={isClientAreaAuthenticated}
              />

              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
                aria-label={
                  isMobileMenuOpen
                    ? messages.navbar.closeMenuLabel
                    : messages.navbar.openMenuLabel
                }
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[rgba(20,20,20,0.94)] text-yellow-500 shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:bg-[#1b1b1b] nav:hidden"
              >
                <FontAwesomeIcon
                  icon={menuIcon}
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </button>

              <div
                ref={desktopMenuRef}
                className="hidden nav:flex nav:items-center nav:gap-1 xl:gap-2"
              >
                {/* Desktop menu links and flyout groups. */}
                {messages.navbar.menuGroups.map((group, index) => {
                  if (!group.items?.length) {
                    return (
                      <Link
                        key={`${group.label}-${index}`}
                        href={resolveLocalizedHref(locale, group.href)}
                        className="rounded-full px-3 py-2 text-sm font-medium text-yellow-500 transition-colors duration-300 hover:bg-white/10 hover:text-yellow-200"
                      >
                        {renderMenuLabel(group.label, group.href)}
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={`${group.label}-${index}`}
                      className="relative shrink-0"
                    >
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={openDesktopGroup === index}
                        aria-controls={`desktop-nav-group-${index}`}
                        onClick={() =>
                          setOpenDesktopGroup((current) =>
                            current === index ? null : index,
                          )
                        }
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-yellow-500 transition-colors duration-300 hover:bg-white/10 hover:text-yellow-200"
                      >
                        <span>{group.label}</span>
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className={`h-4 w-4 transition-transform duration-300 ${openDesktopGroup === index ? "rotate-180" : ""
                            }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.514a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <div
                        id={`desktop-nav-group-${index}`}
                        className={`absolute left-0 top-full z-50 mt-3 w-max transition-all duration-200 ${openDesktopGroup === index
                          ? "visible translate-y-0 opacity-100"
                          : "pointer-events-none invisible -translate-y-1 opacity-0"
                          }`}
                      >
                        <div className="min-w-[250px] rounded-[24px] border border-white/10 bg-[rgba(12,12,12,0.96)] p-3 shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                          {group.items.map((item) =>
                            item.href ? (
                              <Link
                                key={item.label}
                                href={resolveLocalizedHref(locale, item.href)}
                                onClick={() => setOpenDesktopGroup(null)}
                                className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm text-yellow-200/90 transition-colors duration-200 hover:bg-white/5 hover:text-yellow-500"
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => setOpenDesktopGroup(null)}
                                className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm text-yellow-200/90 transition-colors duration-200 hover:bg-white/5 hover:text-yellow-500"
                              >
                                {item.label}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden md:block border border-yellow-500/50 h-7 rounded-full" />

              {/* Desktop right-side actions. */}
              <HeaderActions
                clientAreaProfile={clientAreaProfile}
                locale={locale}
                className="hidden nav:flex"
                isClientAreaAuthenticated={isClientAreaAuthenticated}
              />
            </div>
          </div>

        </div>
      </div>
      {mobileSidebar}
    </nav>
  );
}
