"use client";

import { useState } from "react";

import {
  resolveLocalizedHref,
  type ClientAreaAdvertiseVisibilityMode,
} from "@/components/organisms/client-area.shared";
import { ClientAreaAdvertiseCard } from "@/components/molecules/ClientAreaAdvertiseCard";
import type { AppLocale } from "@/locales";

type ClientAreaAdvertiseSlotProps = {
  locale: AppLocale;
  pathname: string | null;
  visibility?: ClientAreaAdvertiseVisibilityMode;
};

const CLIENT_AREA_ADVERTISE_SESSION_PREFIX = "client-area-advertise";
const DEFAULT_ADVERTISE_SHOW_RATE = 0.5;

function buildAdvertiseStorageKey(pathname: string | null) {
  const normalizedPathname = pathname?.replace(/\/+$/, "") || "root";

  return `${CLIENT_AREA_ADVERTISE_SESSION_PREFIX}:${normalizedPathname}`;
}

function isClientAreaHomepage(locale: AppLocale, pathname: string | null) {
  const normalizedPathname = pathname?.replace(/\/+$/, "") || "";

  return normalizedPathname === resolveLocalizedHref(locale, "/client-area");
}

function resolveAdvertiseVisibility(locale: AppLocale, pathname: string | null) {
  if (isClientAreaHomepage(locale, pathname)) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const storageKey = buildAdvertiseStorageKey(pathname);
  const cachedValue = window.sessionStorage.getItem(storageKey);

  if (cachedValue === "show") {
    return true;
  }

  if (cachedValue === "hide") {
    return false;
  }

  const shouldShow = Math.random() < DEFAULT_ADVERTISE_SHOW_RATE;

  window.sessionStorage.setItem(storageKey, shouldShow ? "show" : "hide");

  return shouldShow;
}

export function ClientAreaAdvertiseSlot({
  locale,
  pathname,
  visibility = "auto",
}: ClientAreaAdvertiseSlotProps) {
  const [shouldShowAdvertise] = useState(() => {
    if (visibility === "show") {
      return true;
    }

    if (visibility === "hide") {
      return false;
    }

    return resolveAdvertiseVisibility(locale, pathname);
  });

  if (!shouldShowAdvertise) {
    return null;
  }

  return <ClientAreaAdvertiseCard />;
}
