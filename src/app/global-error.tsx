"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { FallbackPanel } from "@/components/organisms/FallbackPanel";
import {
  getRouteFallbackCopy,
  resolveFallbackLocaleFromPathname,
} from "@/lib/route-fallback";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const pathname = usePathname();
  const locale = resolveFallbackLocaleFromPathname(pathname);
  const fallbackCopy = getRouteFallbackCopy(locale);
  const copy = fallbackCopy.globalError;
  const referenceLabel = fallbackCopy.labels.reference;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale === "en" ? "en-US" : "id-ID"} suppressHydrationWarning>
      <body className="min-h-screen">
        <title>{copy.badge}</title>

        <main className="flex min-h-screen items-center justify-center px-5 py-16 sm:px-8">
          <div className="w-full max-w-5xl">
            <FallbackPanel
              badge={copy.badge}
              title={copy.title}
              description={copy.description}
              details={
                error.digest
                  ? `${referenceLabel}: ${error.digest}`
                  : undefined
              }
              primaryAction={
                <button
                  type="button"
                  onClick={() => unstable_retry()}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#f4cf73]/70 bg-linear-to-b from-[#FF9600] to-[#FFDE00] px-7 text-sm font-semibold tracking-[-0.01em] text-[#1b1307] shadow-[0_18px_40px_rgba(205,161,58,0.28)] ring-1 ring-[rgba(255,240,196,0.18)] transition-all duration-300 hover:border-[#ffe39d] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                >
                  {copy.primaryLabel}
                </button>
              }
              secondaryAction={
                <ButtonLink href={`/${locale}`} variant="dark">
                  {copy.secondaryLabel}
                </ButtonLink>
              }
            />
          </div>
        </main>
      </body>
    </html>
  );
}
