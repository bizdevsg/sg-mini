"use client";

import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { FallbackPanel } from "@/components/organisms/FallbackPanel";
import {
  getRouteFallbackCopy,
  resolveFallbackLocaleFromPathname,
} from "@/lib/route-fallback";

export default function LocalizedNotFound() {
  const pathname = usePathname();
  const locale = resolveFallbackLocaleFromPathname(pathname);
  const copy = getRouteFallbackCopy(locale).siteNotFound;

  return (
    <main className="mx-auto w-full max-w-8xl px-5 py-12 sm:px-8 sm:py-16 mt-5">
      <FallbackPanel
        badge={copy.badge}
        code="404"
        title={copy.title}
        description={copy.description}
        primaryAction={
          <ButtonLink href={`/${locale}`}>{copy.primaryLabel}</ButtonLink>
        }
        secondaryAction={
          <ButtonLink href={`/${locale}/news`} variant="dark">
            {copy.secondaryLabel}
          </ButtonLink>
        }
      />
    </main>
  );
}
