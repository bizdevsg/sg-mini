"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Radio, X } from "lucide-react";

import type { AppMessages } from "@/locales";
import type { ClientAreaActiveLiveSession } from "@/lib/client-area-live-schedule.shared";

const LIVE_TOAST_STORAGE_PREFIX = "client-area-live-toast:";
const LIVE_TOAST_DURATION_MS = 12_000;

type ClientAreaLiveToastCopy =
  AppMessages["clientArea"]["topbar"]["notifications"]["scheduledLive"];

type ClientAreaLiveToastProps = {
  activeSessions: ClientAreaActiveLiveSession[];
  copy: ClientAreaLiveToastCopy;
};

export function ClientAreaLiveToast({
  activeSessions,
  copy,
}: ClientAreaLiveToastProps) {
  const shownSessionIdsRef = useRef(new Set<string>());
  const [visibleSession, setVisibleSession] =
    useState<ClientAreaActiveLiveSession | null>(null);

  useEffect(() => {
    const nextSession = activeSessions.find((session) => {
      if (shownSessionIdsRef.current.has(session.occurrenceId)) {
        return false;
      }

      try {
        return !window.sessionStorage.getItem(
          `${LIVE_TOAST_STORAGE_PREFIX}${session.occurrenceId}`,
        );
      } catch {
        return true;
      }
    });

    if (!nextSession) {
      setVisibleSession((current) =>
        current &&
        activeSessions.some(
          (session) => session.occurrenceId === current.occurrenceId,
        )
          ? current
          : null,
      );
      return;
    }

    shownSessionIdsRef.current.add(nextSession.occurrenceId);

    try {
      window.sessionStorage.setItem(
        `${LIVE_TOAST_STORAGE_PREFIX}${nextSession.occurrenceId}`,
        "shown",
      );
    } catch {
      // The toast still works when browser storage is unavailable.
    }

    setVisibleSession(nextSession);
  }, [activeSessions]);

  useEffect(() => {
    if (!visibleSession) return;

    const timeoutId = window.setTimeout(
      () => setVisibleSession(null),
      LIVE_TOAST_DURATION_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [visibleSession]);

  if (!visibleSession) return null;

  const title = copy.title.replace("{channel}", visibleSession.channelName);

  return (
    <aside
      aria-atomic="true"
      aria-live="polite"
      className="fixed right-4 top-24 z-[60] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-red-500/30 bg-[#111217]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl sm:right-6"
    >
      <div className="flex items-start gap-3">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
          <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <Radio className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {copy.description}
          </p>
          <a
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            href={visibleSession.href}
            rel="noreferrer"
            target="_blank"
          >
            {copy.watchLabel}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <button
          aria-label={copy.dismissLabel}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-white"
          onClick={() => setVisibleSession(null)}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
