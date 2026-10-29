"use client";

import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { ClientAreaTradePilotCopy } from "@/lib/client-area-trade-pilot.shared";
import { getMarketSessions, type MarketSessionState } from "@/lib/trade-pilot/market-sessions";

/** Kartu "Sesi Aktif": dihitung dari jam saat ini dan diperbarui tiap menit. */
export function ClientAreaTradePilotMarketSession({ copy }: { copy: ClientAreaTradePilotCopy }) {
  // null saat render server: jam server dan browser bisa berbeda (hindari hydration mismatch).
  const [sessions, setSessions] = useState<MarketSessionState[] | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setSessions(getMarketSessions(new Date()));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const active = sessions?.filter((session) => session.open) ?? [];
  const isOpen = active.length > 0;
  const value = sessions === null ? "—" : isOpen ? active.map((session) => session.name).join(" - ") : copy.sessionClosedValue;

  return (
    <div
      ref={containerRef}
      className={`relative flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-500/10 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-lg sm:rounded-full sm:px-5 ${open ? "z-30" : "z-0"}`}
    >
      <span className={`shrink-0 rounded-full p-1 ${isOpen ? "animate-pulse bg-yellow-500/40" : "bg-zinc-600/40"}`}>
        <span className={`block h-2.5 w-2.5 rounded-full ${isOpen ? "bg-yellow-500" : "bg-zinc-500"}`} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col" aria-live="polite">
        <span className="truncate text-sm font-semibold">{value}</span>
        <span className="text-xs text-zinc-400">{isOpen || sessions === null ? copy.sessionLabel : copy.sessionClosedLabel}</span>
      </div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={copy.sessionInfoLabel}
        title={copy.sessionInfoLabel}
        className="shrink-0 rounded-full text-yellow-500/60 transition hover:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50"
      >
        <Info className="h-5 w-5" />
      </button>

      {open && sessions ? (
        <div
          role="dialog"
          aria-label={copy.sessionHoursTitle}
          className="absolute right-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 text-left shadow-xl backdrop-blur-lg"
        >
          <p className="text-sm font-semibold text-white">{copy.sessionHoursTitle}</p>
          <ul className="mt-3 space-y-2">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-2 text-zinc-200">
                  <span className={`h-2 w-2 rounded-full ${session.open ? "bg-yellow-500" : "bg-zinc-600"}`} />
                  {session.name}
                  {session.open ? (
                    <span className="rounded-full bg-yellow-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-400">
                      {copy.sessionOpenBadge}
                    </span>
                  ) : null}
                </span>
                <span className="tabular-nums text-zinc-400">{session.displayRange} WIB</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-4 text-zinc-500">{copy.sessionHoursNote}</p>
        </div>
      ) : null}
    </div>
  );
}
