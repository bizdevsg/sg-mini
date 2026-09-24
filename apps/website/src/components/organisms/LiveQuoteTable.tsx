"use client";

import { useEffect, useState } from "react";

import { LiveQuoteConnectionBadge } from "@/components/atoms/LiveQuoteConnectionBadge";
import { LiveQuoteCards } from "@/components/molecules/LiveQuoteCards";
import { LiveQuoteDataTable } from "@/components/molecules/LiveQuoteDataTable";
import { LiveQuoteSkeleton } from "@/components/molecules/LiveQuoteSkeleton";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import { getSortedSymbols } from "@/lib/live-quotes";
import { formatLocaleTime, getMessages, type AppLocale } from "@/locales";
import { ScrollReveal } from "../molecules/ScrollReveal";

type LiveQuoteTableProps = {
  locale: AppLocale;
  mode?: "compact" | "full";
};

const LIVE_QUOTE_INITIAL_LOADING_TIMEOUT_MS = 4000;

export function LiveQuoteTable({
  locale,
  mode = "compact",
}: LiveQuoteTableProps) {
  const messages = getMessages(locale);
  const fieldLabels = messages.liveQuoteTable.fields;
  const connectionStatusMessages = messages.liveQuoteTable.connectionStatus;
  const { quotes, status, lastUpdated } = useLiveQuoteStream();
  const [initialLoadTimedOut, setInitialLoadTimedOut] = useState(false);

  const symbols = getSortedSymbols(quotes);
  const compactSymbols = symbols.slice(0, 6);
  const isLoading = symbols.length === 0 && status !== "error";
  const showBlockingLoadingState = isLoading && !initialLoadTimedOut;

  useEffect(() => {
    if (!isLoading) {
      setInitialLoadTimedOut(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setInitialLoadTimedOut(true);
    }, LIVE_QUOTE_INITIAL_LOADING_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <div className="overflow-hidden">
      <div>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ScrollReveal effect="fade-right">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              {messages.liveQuoteTable.feedLabel}
            </div>
          </ScrollReveal>
          <ScrollReveal effect="fade-left">
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <LiveQuoteConnectionBadge locale={locale} status={status} />
            </div>
          </ScrollReveal>
        </div>

        {symbols.length === 0 && (status === "error" || initialLoadTimedOut) ? (
          <div className="rounded-xl border border-line bg-white/5 px-5 py-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-400/10 text-rose-400">
                !
              </span>

              <p className="text-sm font-semibold text-white">
                {status === "error"
                  ? connectionStatusMessages.error
                  : connectionStatusMessages.reconnecting}
              </p>
              <p className="max-w-md text-sm text-foreground/58">
                {messages.liveQuoteTable.empty}
              </p>
            </div>
          </div>
        ) : showBlockingLoadingState ? (
          <div className="space-y-4">
            <LiveQuoteSkeleton mode={mode} />

            <div className="rounded-xl border border-line bg-white/5 px-5 py-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold text-white">
                  {status === "reconnecting"
                    ? connectionStatusMessages.reconnecting
                    : connectionStatusMessages.connecting}
                </p>
                <p className="max-w-md text-sm text-foreground/58">
                  {messages.liveQuoteTable.empty}
                </p>
              </div>
            </div>
          </div>
        ) : mode === "full" ? (
          <div className="space-y-4">
            <LiveQuoteCards
              locale={locale}
              mode="full"
              quotes={quotes}
              symbols={symbols}
              fieldLabels={fieldLabels}
            />
            <LiveQuoteDataTable
              locale={locale}
              quotes={quotes}
              symbols={symbols}
              fieldLabels={fieldLabels}
            />
          </div>
        ) : (
          <LiveQuoteCards
            locale={locale}
            mode="compact"
            quotes={quotes}
            symbols={compactSymbols}
            fieldLabels={fieldLabels}
          />
        )}
      </div>

      <div className="mt-2">
        <ScrollReveal
          key={lastUpdated ? "live-quote-last-updated-ready" : "live-quote-last-updated-pending"}
          effect="fade-up"
          delay={600}
          once
        >
          <div className="px-2 text-right text-xs text-white/58 md:pr-3">
            {lastUpdated
              ? `${messages.liveQuoteTable.lastUpdated}: ${formatLocaleTime(lastUpdated, lastUpdated, locale)}`
              : messages.liveQuoteTable.firstTick}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
