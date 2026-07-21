"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { LocaleSwitcherButton } from "@/components/atoms/LocaleSwitcherButton";
import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";
import { PUBLIC_REGISTER_URL } from "@/lib/env";
import {
  getMessages,
  isSupportedLocale,
  type AppLocale,
} from "@/locales";
import {
  LocaleSwitcherDialog,
  type LocaleSwitcherOption,
} from "@/components/organisms/LocaleSwitcherDialog";

type HeaderActionsProps = {
  clientAreaProfile?: ClientAreaSessionProfile | null;
  locale: AppLocale;
  isClientAreaAuthenticated: boolean;
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
  const localeDialogId = "locale-switcher-dialog";
  const localeOptions: LocaleSwitcherOption[] = [
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
  const activeLocaleLabel = locale === "id" ? "Aktif" : "Active";
  const mobileActionButtonClass =
    "min-w-[74px] rounded-[14px] text-xs font-semibold shadow-none";

  const localeSwitcher = (
    <div className="relative">
      <LocaleSwitcherButton
        ariaControls={localeDialogId}
        ariaExpanded={isLocaleOpen}
        ariaLabel={messages.navbar.switchLocaleLabel}
        iconAlt={activeLocale.alt}
        iconSrc={activeLocale.iconSrc}
        mobilePanel={mobilePanel}
        onClick={() => setIsLocaleOpen((current) => !current)}
      />
    </div>
  );

  const localeDialog = (
    <LocaleSwitcherDialog
      activeLabel={activeLocaleLabel}
      currentLocale={locale}
      dialogId={localeDialogId}
      isOpen={isLocaleOpen}
      onClose={() => setIsLocaleOpen(false)}
      options={localeOptions}
      title={messages.navbar.switchLocaleLabel}
    />
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocaleOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isLocaleOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocaleOpen]);

  useEffect(() => {
    setIsLocaleOpen(false);
  }, [pathname]);

  if (compact) {
    return (
      <>
        <div className={className}>{localeSwitcher}</div>
        {localeDialog}
      </>
    );
  }

  if (mobilePanel) {
    return (
      <>
        <div className={`flex w-full items-center gap-3 ${className}`}>
          <div className="flex items-center gap-2.5">
            <ButtonLink
              variant="dark"
              size="sm"
              className={mobileActionButtonClass}
              href={PUBLIC_REGISTER_URL}
              target="_blank"
              rel="noreferrer"
            >
              {messages.navbar.openAccount}
            </ButtonLink>
          </div>
        </div>
        {localeDialog}
      </>
    );
  }

  return (
    <>
      <div
        className={`flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3 ${className}`}
      >
        {localeSwitcher}
      </div>
      {localeDialog}
    </>
  );
}
