"use client";

import { usePathname } from "next/navigation";

import { getMessages, isSupportedLocale } from "@/locales";

export default function ClientAreaTradePilotLoading() {
  const pathname = usePathname();
  const localeSegment = pathname.split("/").filter(Boolean)[0];
  const locale = isSupportedLocale(localeSegment) ? localeSegment : "id";
  const copy = getMessages(locale).clientArea.tradePilotPage;

  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <p className="text-sm font-semibold text-amber-400">{copy.loadingLabel}</p>
      <div className="h-20 animate-pulse rounded-2xl bg-zinc-900" />
      <div className="h-80 animate-pulse rounded-3xl bg-zinc-900" />
    </div>
  );
}
