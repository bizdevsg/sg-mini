"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import { redirectToExpiredSessionLogin } from "@/lib/client-area-fetch";
import type { LiveQuotePayload } from "@/lib/live-quotes";
import type { AccountSummaryCard } from "@/types/account-summary";

type SaiSnapshot = {
  status: "connecting" | "live" | "reconnecting" | "error";
  account: AccountSummaryCard | null;
  quotes: LiveQuotePayload;
  lastUpdated: string | null;
};

const emptySnapshot: SaiSnapshot = { status: "connecting", account: null, quotes: {}, lastUpdated: null };
type Store = {
  snapshot: SaiSnapshot;
  listeners: Set<() => void>;
  source: EventSource | null;
  timer: number | null;
  delay: number;
  expired: boolean;
};
const stores: Record<AccountMode, Store> = {
  real: { snapshot: emptySnapshot, listeners: new Set(), source: null, timer: null, delay: 1000, expired: false },
  demo: { snapshot: emptySnapshot, listeners: new Set(), source: null, timer: null, delay: 1000, expired: false },
};

function update(store: Store, patch: Partial<SaiSnapshot>) {
  store.snapshot = { ...store.snapshot, ...patch };
  store.listeners.forEach((listener) => listener());
}

function connect(mode: AccountMode) {
  const store = stores[mode];
  if (!store.listeners.size || store.source || store.expired) return;
  const source = new EventSource(`/api/client-area/account-summary/stream?mode=${mode}`);
  store.source = source;
  source.addEventListener("account", (event) => {
    try {
      const account = JSON.parse((event as MessageEvent<string>).data) as AccountSummaryCard;
      if (typeof account.accountId !== "string") return;
      store.delay = 1000;
      update(store, { account, status: "live" });
    } catch { /* Ignore malformed relay messages. */ }
  });
  source.addEventListener("prices", (event) => {
    try {
      const quotes = JSON.parse((event as MessageEvent<string>).data) as LiveQuotePayload;
      if (!quotes || typeof quotes !== "object" || Array.isArray(quotes)) return;
      const lastUpdated = Object.values(quotes).map((tick) => tick.date_time).filter(Boolean).sort().at(-1) ?? null;
      store.delay = 1000;
      update(store, { quotes, lastUpdated, status: "live" });
    } catch { /* Ignore malformed relay messages. */ }
  });
  source.addEventListener("upstream-expired", () => {
    store.expired = true;
    source.close();
    store.source = null;
    update(store, { account: null, quotes: {}, status: "error" });
    redirectToExpiredSessionLogin();
  });
  source.onerror = () => {
    source.close();
    if (store.source !== source) return;
    store.source = null;
    update(store, { account: null, status: "reconnecting" });
    if (store.listeners.size && !store.expired) {
      store.timer = window.setTimeout(() => { store.timer = null; connect(mode); }, store.delay);
      store.delay = Math.min(store.delay * 2, 30000);
    }
  };
}

function subscribe(mode: AccountMode, listener: () => void) {
  const store = stores[mode];
  store.listeners.add(listener);
  if (store.listeners.size === 1) connect(mode);
  return () => {
    store.listeners.delete(listener);
    if (store.listeners.size) return;
    if (store.timer !== null) window.clearTimeout(store.timer);
    store.timer = null;
    store.source?.close();
    store.source = null;
    store.snapshot = emptySnapshot;
    store.delay = 1000;
  };
}

export function retrySaiStream(mode: AccountMode) {
  const store = stores[mode];
  if (store.expired) return;
  if (store.timer !== null) window.clearTimeout(store.timer);
  store.timer = null;
  store.source?.close();
  store.source = null;
  update(store, { account: null, status: "connecting" });
  connect(mode);
}

export function useSaiStream(mode: AccountMode) {
  const onSubscribe = useCallback((listener: () => void) => subscribe(mode, listener), [mode]);
  const getSnapshot = useCallback(() => stores[mode].snapshot, [mode]);
  return useSyncExternalStore(onSubscribe, getSnapshot, () => emptySnapshot);
}
