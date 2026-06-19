"use client";

import { useParams } from "next/navigation";

import { LoadingOverlay } from "@/components/molecules/LoadingOverlay";
import { DEFAULT_LOCALE, getMessages, isSupportedLocale } from "@/locales";

export default function Loading() {
  const params = useParams<{ locales?: string }>();
  const locale =
    params.locales && isSupportedLocale(params.locales)
      ? params.locales
      : DEFAULT_LOCALE;
  const messages = getMessages(locale).loadingOverlay;

  return (
    <LoadingOverlay
      title={messages.title}
      description={messages.description}
    />
  );
}
