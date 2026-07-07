"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { FallbackPanel } from "@/components/organisms/FallbackPanel";
import {
  getRouteFallbackCopy,
  resolveFallbackLocaleFromPathname,
} from "@/lib/route-fallback";

export default function LocalizedError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const pathname = usePathname();
  const locale = resolveFallbackLocaleFromPathname(pathname);
  const copy = getRouteFallbackCopy(locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <FallbackPanel
        badge={copy.siteError.badge}
        title={copy.siteError.title}
        description={copy.siteError.description}
        details={
          error.digest
            ? `${copy.labels.reference}: ${error.digest}`
            : undefined
        }
        primaryAction={
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#f4cf73]/70 bg-linear-to-b from-[#FF9600] to-[#FFDE00] px-7 text-sm font-semibold tracking-[-0.01em] text-[#1b1307] shadow-[0_18px_40px_rgba(205,161,58,0.28)] ring-1 ring-[rgba(255,240,196,0.18)] transition-all duration-300 hover:border-[#ffe39d] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            {copy.siteError.primaryLabel}
          </button>
        }
        secondaryAction={
          <ButtonLink href={`/${locale}`} variant="dark">
            {copy.siteError.secondaryLabel}
          </ButtonLink>
        }
      />
    </main>
  );
}
