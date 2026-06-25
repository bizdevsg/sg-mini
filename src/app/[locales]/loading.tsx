"use client";

import { usePathname } from "next/navigation";

import { LoadingOverlay } from "@/components/molecules/LoadingOverlay";
import { DEFAULT_LOCALE, getMessages, isSupportedLocale } from "@/locales";

export default function Loading() {
  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const locale =
    firstSegment && isSupportedLocale(firstSegment)
      ? firstSegment
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
