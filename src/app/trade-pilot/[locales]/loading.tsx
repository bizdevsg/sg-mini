"use client";

import { usePathname } from "next/navigation";

import { LoadingOverlay } from "@/components/molecules/LoadingOverlay";
import { DEFAULT_LOCALE, getMessages, isSupportedLocale } from "@/locales";

export default function TradePilotLoading() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const localeSegment = segments[1];
  const locale =
    localeSegment && isSupportedLocale(localeSegment)
      ? localeSegment
      : DEFAULT_LOCALE;
  const messages = getMessages(locale).loadingOverlay;

  return (
    <LoadingOverlay
      brandLabel={getMessages(locale).app.brandWordmark}
      logoAlt={getMessages(locale).footer.logoAlt}
      title={messages.title}
      description={messages.description}
    />
  );
}
