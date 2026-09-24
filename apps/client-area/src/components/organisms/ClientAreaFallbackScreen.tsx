"use client";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { FallbackPanel } from "@/components/organisms/FallbackPanel";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
import { getRouteFallbackCopy } from "@/lib/route-fallback";
import type { AppLocale } from "@/locales";

type ClientAreaFallbackScreenProps = {
  locale: AppLocale;
  mode: "not-found" | "error";
  errorDigest?: string;
  onRetry?: () => void;
};

export function ClientAreaFallbackScreen({
  locale,
  mode,
  errorDigest,
  onRetry,
}: ClientAreaFallbackScreenProps) {
  const copy = getRouteFallbackCopy(locale);
  const content =
    mode === "error" ? copy.clientAreaError : copy.clientAreaNotFound;

  return (
    <ClientAreaShell activeTab="home" locale={locale}>
      <FallbackPanel
        badge={content.badge}
        code={mode === "error" ? undefined : "404"}
        title={content.title}
        description={content.description}
        details={
          errorDigest
            ? `${copy.labels.reference}: ${errorDigest}`
            : undefined
        }
        primaryAction={
          mode === "error" && onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#f4cf73]/70 bg-linear-to-b from-[#FF9600] to-[#FFDE00] px-7 text-sm font-semibold tracking-[-0.01em] text-[#1b1307] shadow-[0_18px_40px_rgba(205,161,58,0.28)] ring-1 ring-[rgba(255,240,196,0.18)] transition-all duration-300 hover:border-[#ffe39d] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              {content.primaryLabel}
            </button>
          ) : (
            <ButtonLink href={resolveLocalizedHref(locale, "/client-area")}>
              {content.primaryLabel}
            </ButtonLink>
          )
        }
        secondaryAction={
          <ButtonLink
            href={
              mode === "error"
                ? resolveLocalizedHref(locale, "/client-area")
                : resolveLocalizedHref(locale, "/client-area/market")
            }
            variant="dark"
          >
            {content.secondaryLabel}
          </ButtonLink>
        }
      />
    </ClientAreaShell>
  );
}
