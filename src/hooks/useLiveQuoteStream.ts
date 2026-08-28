"use client";

import { useSyncExternalStore } from "react";

import type { LiveQuotePayload } from "@/components/molecules/live-quote.shared";

export type LiveQuoteConnectionStatus =
  | "connecting"
  | "live"
  | "reconnecting"
  | "error";

type LiveQuoteStatusEvent = {
  status?: LiveQuoteConnectionStatus;
};

type UseLiveQuoteStreamResult = {
  quotes: LiveQuotePayload;
  status: LiveQuoteConnectionStatus;
  lastUpdated: string | null;
};

type LiveQuoteStreamSnapshot = UseLiveQuoteStreamResult;
type LiveQuoteListener = () => void;

const LIVE_QUOTES_STREAM_URL = "/api/live-quotes";
const BASE_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 10000;
const STALE_CONNECTION_TIMEOUT_MS = 45000;
const STALE_CONNECTION_CHECK_INTERVAL_MS = 10000;

const listeners = new Set<LiveQuoteListener>();

let snapshot: LiveQuoteStreamSnapshot = {
  quotes: {},
  status: "connecting",
  lastUpdated: null,
};
let eventSource: EventSource | null = null;
let reconnectTimer: number | null = null;
let staleTimer: number | null = null;
let reconnectAttempts = 0;
let lastActivityAt = 0;
let browserEventsBound = false;

function hasCachedQuotes() {
  return Object.keys(snapshot.quotes).length > 0;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function setSnapshot(
  updater:
    | LiveQuoteStreamSnapshot
    | ((current: LiveQuoteStreamSnapshot) => LiveQuoteStreamSnapshot),
) {
  const nextSnapshot =
    typeof updater === "function" ? updater(snapshot) : updater;

  if (
    nextSnapshot === snapshot ||
    (nextSnapshot.status === snapshot.status &&
      nextSnapshot.lastUpdated === snapshot.lastUpdated &&
      nextSnapshot.quotes === snapshot.quotes)
  ) {
    return;
  }

  snapshot = nextSnapshot;
  emitChange();
}

function setStatus(status: LiveQuoteConnectionStatus) {
  setSnapshot((current) =>
    current.status === status
      ? current
      : {
          ...current,
          status,
        },
  );
}

function updateLastActivity() {
  lastActivityAt = Date.now();
}

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function clearStaleTimer() {
  if (staleTimer) {
    clearInterval(staleTimer);
    staleTimer = null;
  }
}

function closeEventSource() {
  clearStaleTimer();

  if (eventSource) {
    const sourceToClose = eventSource;
    eventSource = null;
    sourceToClose.close();
  }
}

function getLatestTickTimestamp(payload: LiveQuotePayload) {
  return Object.values(payload)
    .map((tick) => tick?.date_time)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
}

function scheduleReconnect({
  immediate = false,
}: {
  immediate?: boolean;
} = {}) {
  if (!listeners.size) {
    closeEventSource();
    clearReconnectTimer();
    return;
  }

  closeEventSource();

  if (!immediate && reconnectTimer) {
    return;
  }

  if (immediate) {
    clearReconnectTimer();
  }

  setStatus(hasCachedQuotes() ? "reconnecting" : "connecting");

  const delay = immediate
    ? 0
    : Math.min(
        MAX_RECONNECT_DELAY_MS,
        BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempts,
      );

  reconnectAttempts += 1;

  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}

function startStaleTimer(currentSource: EventSource) {
  clearStaleTimer();

  staleTimer = window.setInterval(() => {
    if (eventSource !== currentSource) {
      clearStaleTimer();
      return;
    }

    if (Date.now() - lastActivityAt <= STALE_CONNECTION_TIMEOUT_MS) {
      return;
    }

    scheduleReconnect();
  }, STALE_CONNECTION_CHECK_INTERVAL_MS);
}

function handleVisibilityRefresh() {
  if (!listeners.size) {
    return;
  }

  if (
    typeof document !== "undefined" &&
    document.visibilityState &&
    document.visibilityState !== "visible"
  ) {
    return;
  }

  if (!eventSource || eventSource.readyState === EventSource.CLOSED) {
    scheduleReconnect({ immediate: true });
    return;
  }

  if (Date.now() - lastActivityAt > STALE_CONNECTION_TIMEOUT_MS) {
    scheduleReconnect({ immediate: true });
  }
}

function bindBrowserEvents() {
  if (browserEventsBound || typeof window === "undefined") {
    return;
  }

  browserEventsBound = true;

  window.addEventListener("online", handleVisibilityRefresh);
  window.addEventListener("focus", handleVisibilityRefresh);
  document.addEventListener("visibilitychange", handleVisibilityRefresh);
}

function unbindBrowserEvents() {
  if (!browserEventsBound || typeof window === "undefined") {
    return;
  }

  browserEventsBound = false;

  window.removeEventListener("online", handleVisibilityRefresh);
  window.removeEventListener("focus", handleVisibilityRefresh);
  document.removeEventListener("visibilitychange", handleVisibilityRefresh);
}

function connect() {
  if (!listeners.size) {
    closeEventSource();
    clearReconnectTimer();
    return;
  }

  if (
    eventSource &&
    (eventSource.readyState === EventSource.OPEN ||
      eventSource.readyState === EventSource.CONNECTING)
  ) {
    return;
  }

  clearReconnectTimer();
  closeEventSource();
  updateLastActivity();
  setStatus(hasCachedQuotes() ? "reconnecting" : "connecting");

  const source = new EventSource(LIVE_QUOTES_STREAM_URL);
  eventSource = source;
  startStaleTimer(source);

  source.onopen = () => {
    if (eventSource !== source) {
      source.close();
      return;
    }

    reconnectAttempts = 0;
    updateLastActivity();

    if (hasCachedQuotes()) {
      setStatus("live");
    }
  };

  const handleStatusEvent = (event: MessageEvent<string>) => {
    if (eventSource !== source) {
      return;
    }

    updateLastActivity();

    try {
      const payload = JSON.parse(event.data) as LiveQuoteStatusEvent;
      const nextStatus = payload.status;

      if (
        nextStatus === "connecting" ||
        nextStatus === "live" ||
        nextStatus === "reconnecting" ||
        nextStatus === "error"
      ) {
        setStatus(nextStatus);
      }
    } catch {
      setStatus("error");
    }
  };

  const handleHeartbeatEvent = () => {
    if (eventSource !== source) {
      return;
    }

    updateLastActivity();
  };

  const handleQuoteEvent = (event: MessageEvent<string>) => {
    if (eventSource !== source) {
      return;
    }

    updateLastActivity();

    try {
      const payload = JSON.parse(event.data) as LiveQuotePayload;

      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return;
      }

      const latestTick = getLatestTickTimestamp(payload);

      setSnapshot((current) => ({
        quotes: {
          ...current.quotes,
          ...payload,
        },
        status: "live",
        lastUpdated: latestTick ?? current.lastUpdated,
      }));

      reconnectAttempts = 0;
    } catch {
      setStatus("error");
    }
  };

  source.addEventListener("status", handleStatusEvent as EventListener);
  source.addEventListener("heartbeat", handleHeartbeatEvent);
  source.addEventListener("quote", handleQuoteEvent as EventListener);

  source.onerror = () => {
    if (eventSource !== source) {
      return;
    }

    setStatus(hasCachedQuotes() ? "reconnecting" : "error");
    scheduleReconnect();
  };
}

function subscribe(listener: LiveQuoteListener) {
  listeners.add(listener);

  if (listeners.size === 1) {
    bindBrowserEvents();
    connect();
  } else if (!eventSource || eventSource.readyState === EventSource.CLOSED) {
    scheduleReconnect({ immediate: true });
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size) {
      return;
    }

    unbindBrowserEvents();
    clearReconnectTimer();
    closeEventSource();
    reconnectAttempts = 0;
    snapshot = {
      ...snapshot,
      status: hasCachedQuotes() ? "reconnecting" : "connecting",
    };
  };
}

function getSnapshot() {
  return snapshot;
}

export function useLiveQuoteStream(): UseLiveQuoteStreamResult {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
