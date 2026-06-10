"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PUBLIC_LOGIN_URL, PUBLIC_REGISTER_URL } from "@/lib/env";
import {
  getMessages,
  isSupportedLocale,
  type AppLocale,
} from "@/locales";
import Image from "next/image";
import Link from "next/link";

type HeaderActionsProps = {
  locale: AppLocale;
  compact?: boolean;
  mobilePanel?: boolean;
  className?: string;
};

function resolveLocaleSwitcherHref(targetLocale: AppLocale, pathname: string) {
  if (!pathname || pathname === "/") {
    return `/${targetLocale}`;
  }

  const segments = pathname.split("/").filter(Boolean);
  const [firstSegment, ...restSegments] = segments;

  if (firstSegment && isSupportedLocale(firstSegment)) {
    const nestedPath = restSegments.join("/");

    return nestedPath ? `/${targetLocale}/${nestedPath}` : `/${targetLocale}`;
  }

  return pathname.startsWith("/")
    ? `/${targetLocale}${pathname}`
    : `/${targetLocale}/${pathname}`;
}

export function HeaderActions({
  locale,
  compact = false,
  mobilePanel = false,
  className = "",
}: HeaderActionsProps) {
  const messages = getMessages(locale);
  const pathname = usePathname();
  const [isLocaleOpen, setIsLocaleOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement | null>(null);
  const localeOptions: Array<{
    value: AppLocale;
    href: string;
    iconSrc: string;
    alt: string;
  }> = [
    {
      value: "id",
      href: resolveLocaleSwitcherHref("id", pathname),
      iconSrc: "/assets/icon-id.png",
      alt: "Indonesia",
    },
    {
      value: "en",
      href: resolveLocaleSwitcherHref("en", pathname),
      iconSrc: "/assets/icon-us.png",
      alt: "English",
    },
  ];
  const activeLocale =
    localeOptions.find((option) => option.value === locale) ?? localeOptions[0];
  const mobileActionButtonClass =
    "h-10 min-w-[74px] rounded-[14px] px-4 py-2 text-xs font-semibold shadow-none";
  const localeButtonClass = mobilePanel
    ? "h-10 w-10 justify-center rounded-full border border-white/12 bg-[rgba(22,22,22,0.96)] p-0 text-yellow-500 shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
    : "rounded-full border border-white/10 bg-[rgba(20,20,20,0.94)] p-2 text-yellow-500 shadow-[0_10px_26px_rgba(0,0,0,0.35)]";
  const localeMenuClass = mobilePanel
    ? "absolute bottom-full right-0 z-30 mb-3 min-w-[168px] rounded-[20px] border border-white/10 bg-[rgba(12,12,12,0.96)] p-2 shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200"
    : "absolute right-0 top-full z-30 mt-3 min-w-[168px] rounded-[20px] border border-white/10 bg-[rgba(12,12,12,0.96)] p-2 shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200";

  const localeSwitcher = (
    <div ref={localeMenuRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isLocaleOpen}
        aria-label={messages.navbar.switchLocaleLabel}
        onClick={() => setIsLocaleOpen((current) => !current)}
        className={`flex items-center gap-2 text-xs transition-colors duration-300 hover:bg-[#1b1b1b] sm:text-sm ${localeButtonClass}`}
      >
        <Image
          src={activeLocale.iconSrc}
          alt={activeLocale.alt}
          width={24}
          height={24}
          className="h-5 w-5 rounded-full object-cover"
        />
      </button>

      <div
        className={`${localeMenuClass} ${
          isLocaleOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0"
        }`}
      >
        {localeOptions.map((option) => {
          const isActive = option.value === locale;

          return (
            <Link
              key={option.value}
              href={option.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={
                isActive ? option.alt : messages.navbar.switchLocaleLabel
              }
              title={option.alt}
              onClick={() => setIsLocaleOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-white/8 text-yellow-400"
                  : "text-yellow-500/80 hover:bg-white/5 hover:text-yellow-400"
              }`}
            >
              <Image
                src={option.iconSrc}
                alt={option.alt}
                width={24}
                height={24}
                className="h-5 w-5 rounded-full object-cover"
              />
              <span>{option.alt}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!localeMenuRef.current) {
        return;
      }

      if (!localeMenuRef.current.contains(event.target as Node)) {
        setIsLocaleOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocaleOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsLocaleOpen(false);
  }, [pathname]);

  if (compact) {
    return <div className={className}>{localeSwitcher}</div>;
  }

  if (mobilePanel) {
    return (
      <div className={`flex w-full items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2.5">
          <ButtonLink
            variant="ghost"
            className={mobileActionButtonClass}
            href={PUBLIC_LOGIN_URL}
            target="_blank"
            rel="noreferrer"
          >
            {messages.navbar.login}
          </ButtonLink>

          <ButtonLink
            variant="dark"
            className={mobileActionButtonClass}
            href={PUBLIC_REGISTER_URL}
            target="_blank"
            rel="noreferrer"
          >
            {messages.navbar.openAccount}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3 ${className}`}
    >
      <ButtonLink
        variant="ghost"
        className="rounded-full px-3 py-2 text-xs font-medium sm:px-3.5 sm:py-2 sm:text-sm"
        href={PUBLIC_LOGIN_URL}
        target="_blank"
        rel="noreferrer"
      >
        {messages.navbar.login}
      </ButtonLink>

      <ButtonLink
        variant="dark"
        className="rounded-full px-3 py-2 text-xs font-medium sm:px-3.5 sm:py-2 sm:text-sm"
        href={PUBLIC_REGISTER_URL}
        target="_blank"
        rel="noreferrer"
      >
        {messages.navbar.openAccount}
      </ButtonLink>

      <div className="hidden h-8 w-px rounded-full bg-yellow-500/50 sm:block" />

      {localeSwitcher}
    </div>
  );
}
