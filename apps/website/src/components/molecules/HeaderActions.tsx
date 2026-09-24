"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LocaleSwitcherButton } from "@/components/atoms/LocaleSwitcherButton";
import { PUBLIC_CLIENT_SITE_URL } from "@/lib/env";
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
  isClientAreaEnabled: boolean;
  locale: AppLocale;
  compact?: boolean;
  mobilePanel?: boolean;
  className?: string;
};

type ClientAreaSessionStatus = {
  authenticated: boolean;
  displayName?: string;
  avatarSrc?: string;
};

function useClientAreaSessionStatus(isClientAreaEnabled: boolean) {
  const [status, setStatus] = useState<ClientAreaSessionStatus>({
    authenticated: false,
  });

  useEffect(() => {
    if (!isClientAreaEnabled) {
      return;
    }

    const abortController = new AbortController();

    fetch(`${PUBLIC_CLIENT_SITE_URL}/api/session/status`, {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: ClientAreaSessionStatus | null) => {
        if (data?.authenticated) {
          setStatus(data);
        }
      })
      .catch(() => {
        // Session check is best-effort; keep the logged-out button on failure.
      });

    return () => abortController.abort();
  }, [isClientAreaEnabled]);

  return status;
}

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
  isClientAreaEnabled,
  locale,
  compact = false,
  mobilePanel = false,
  className = "",
}: HeaderActionsProps) {
  const messages = getMessages(locale);
  const pathname = usePathname();
  const clientAreaSession = useClientAreaSessionStatus(isClientAreaEnabled);
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
  const authenticatedActionButtonClass =
    "h-10 w-10 min-h-10 min-w-10 overflow-hidden p-0 rounded-full shadow-none";
  const clientAreaButtonClass = `inline-flex items-center justify-center gap-2 text-center font-semibold tracking-[-0.01em] border border-[#f4cf73]/70 bg-linear-to-b from-[#FF9600] to-[#FFDE00] text-[#1b1307] shadow-[0_18px_40px_rgba(205,161,58,0.28)] ring-1 ring-[rgba(255,240,196,0.18)] transition-all duration-300 hover:border-[#ffe39d] hover:shadow-[0_22px_48px_rgba(205,161,58,0.38)] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${clientAreaSession.authenticated
    ? authenticatedActionButtonClass
    : `min-h-10 rounded-full px-8 text-sm ${mobilePanel ? mobileActionButtonClass : ""}`
    }`;
  const clientAreaHref = clientAreaSession.authenticated
    ? `${PUBLIC_CLIENT_SITE_URL}/${locale}/client-area`
    : `${PUBLIC_CLIENT_SITE_URL}/${locale}/client-area/login`;
  const clientAreaTitle = clientAreaSession.displayName
    ? `${messages.clientArea.pageTitle} - ${clientAreaSession.displayName}`
    : messages.clientArea.pageTitle;
  const clientAreaAction = isClientAreaEnabled ? (
    <Link
      aria-label={clientAreaTitle}
      className={clientAreaButtonClass}
      href={clientAreaHref}
      title={clientAreaTitle}
    >
      {clientAreaSession.authenticated && clientAreaSession.avatarSrc ? (
        <Image
          src={clientAreaSession.avatarSrc}
          alt={clientAreaSession.displayName ?? messages.clientArea.pageTitle}
          width={40}
          height={40}
          sizes="40px"
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="leading-none text-[#1b1307]">Client Area</span>
      )}
    </Link>
  ) : null;

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
            {clientAreaAction}
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
        {clientAreaAction}

        <div className="hidden md:block border border-yellow-500/50 h-7 rounded-full" />

        {localeSwitcher}
      </div>
      {localeDialog}
    </>
  );
}
