"use client";

import { useEffect, useRef, useState } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

import { getMessages, type AppLocale } from "@/locales";
import { LogoMark } from "@/components/atoms/LogoMark";
import { HeaderActions } from "@/components/molecules/HeaderActions";
import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";

type NavbarProps = {
  clientAreaProfile: ClientAreaSessionProfile | null;
  isClientAreaAuthenticated: boolean;
  locale: AppLocale;
};

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

function renderMenuLabel(label: string, href?: string) {
  if (!isTradePilotHref(href)) {
    return <span>{label}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {/* <div className="bg-yellow-500/20 rounded-full p-1">
        <Image
          src="/assets/icon-512.png"
          alt=""
          width={16}
          height={16}
          className="h-5 w-5 rounded-[4px] object-cover"
          aria-hidden="true"
        />
      </div> */}
      <span className="text-sm">{label.trim()}</span>
    </div>
  );
}

export function Navbar({
  clientAreaProfile,
  locale,
  isClientAreaAuthenticated,
}: NavbarProps) {
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
    const syncScrollState = () => {
      setIsScrolled(window.scrollY > 0);
    };

    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScrollState);
    };
  }, []);

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

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setExpandedMobileGroup(null);
    }
  }, [isMobileMenuOpen]);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedMobileGroup(null);
  };

  const showHeaderSurface = isScrolled || isMobileMenuOpen;

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

              <HeaderActions
                clientAreaProfile={clientAreaProfile}
                locale={locale}
                className="hidden nav:flex"
                isClientAreaAuthenticated={isClientAreaAuthenticated}
              />
            </div>
          </div>

          <div
            id="mobile-nav-panel"
            className={`absolute inset-x-4 top-full z-40 mt-2 transition-opacity duration-200 sm:inset-x-6 nav:hidden ${isMobileMenuOpen
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0"
              }`}
          >
            <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(12,12,12,0.96)] p-3 shadow-[0_28px_80px_rgba(0,0,0,0.72)] ring-1 ring-[rgba(205,161,58,0.08)] backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                {messages.navbar.menuGroups.map((group, index) => {
                  const hasItems = Boolean(group.items?.length);
                  const isExpanded = expandedMobileGroup === index;

                  if (!hasItems) {
                    return (
                      <Link
                        key={`${group.label}-${index}`}
                        href={resolveLocalizedHref(locale, group.href)}
                        onClick={closeMobileMenu}
                        className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,18,0.92)] px-4 py-4 text-sm font-medium text-yellow-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors duration-300 hover:text-yellow-200"
                      >
                        {renderMenuLabel(group.label, group.href)}
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={`${group.label}-${index}`}
                      className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,18,0.92)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
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

                <div className="mt-5 border-t border-[rgba(255,255,255,0.08)] pt-4">
                  <HeaderActions
                    clientAreaProfile={clientAreaProfile}
                    locale={locale}
                    mobilePanel
                    className="w-full"
                    isClientAreaAuthenticated={isClientAreaAuthenticated}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
