"use client";

import { usePathname } from "next/navigation";

import { LoadingOverlay } from "@/components/molecules/LoadingOverlay";
import {
  DEFAULT_LOCALE,
  getMessages,
  isSupportedLocale,
} from "@/locales";

type RouteLoadingOverlayProps = {
  localeSegmentIndex?: number;
};

export function RouteLoadingOverlay({
  localeSegmentIndex = 0,
}: RouteLoadingOverlayProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const localeSegment = segments[localeSegmentIndex];
  const locale =
    localeSegment && isSupportedLocale(localeSegment)
      ? localeSegment
      : DEFAULT_LOCALE;
  const messages = getMessages(locale);

  return (
    <LoadingOverlay
      brandLabel={messages.app.brandWordmark}
      logoAlt={messages.footer.logoAlt}
      title={messages.loadingOverlay.title}
      description={messages.loadingOverlay.description}
    />
  );
}
