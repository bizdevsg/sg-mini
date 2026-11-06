"use client";

import { useSyncExternalStore } from "react";

import {
  LIVE_QUOTE_SOCKET_URL,
  type LiveQuotePayload,
} from "@/lib/live-quotes";

export type LiveQuoteConnectionStatus =
  | "connecting"
  | "live"
  | "reconnecting"
  | "error";

type UseLiveQuoteStreamResult = {
  quotes: LiveQuotePayload;
  status: LiveQuoteConnectionStatus;
  lastUpdated: string | null;
};

type LiveQuoteStreamSnapshot = UseLiveQuoteStreamResult;
type LiveQuoteListener = () => void;

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
let socket: WebSocket | null = null;
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

function closeSocket() {
  clearStaleTimer();

  if (socket) {
    const socketToClose = socket;
    socket = null;
    socketToClose.close();
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
    closeSocket();
    clearReconnectTimer();
    return;
  }

  closeSocket();

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

function startStaleTimer(currentSocket: WebSocket) {
  clearStaleTimer();

  staleTimer = window.setInterval(() => {
    if (socket !== currentSocket) {
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

  if (!socket || socket.readyState === WebSocket.CLOSED) {
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
    closeSocket();
    clearReconnectTimer();
    return;
  }

  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  clearReconnectTimer();
  closeSocket();
  updateLastActivity();
  setStatus(hasCachedQuotes() ? "reconnecting" : "connecting");

  let currentSocket: WebSocket;

  try {
    currentSocket = new WebSocket(LIVE_QUOTE_SOCKET_URL);
  } catch {
    setStatus("error");
    scheduleReconnect();
    return;
  }

  socket = currentSocket;
  startStaleTimer(currentSocket);

  currentSocket.onopen = () => {
    if (socket !== currentSocket) {
      currentSocket.close();
      return;
    }

    reconnectAttempts = 0;
    updateLastActivity();

    if (hasCachedQuotes()) {
      setStatus("live");
    }
  };

  currentSocket.onmessage = (event: MessageEvent<unknown>) => {
    if (socket !== currentSocket) {
      return;
    }

    updateLastActivity();

    try {
      if (typeof event.data !== "string") {
        return;
      }

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

  currentSocket.onerror = () => {
    if (socket !== currentSocket) {
      return;
    }

    setStatus(hasCachedQuotes() ? "reconnecting" : "error");
  };

  currentSocket.onclose = () => {
    if (socket !== currentSocket) {
      return;
    }

    socket = null;
    clearStaleTimer();
    scheduleReconnect();
  };
}

function subscribe(listener: LiveQuoteListener) {
  listeners.add(listener);

  if (listeners.size === 1) {
    bindBrowserEvents();
    connect();
  } else if (!socket || socket.readyState === WebSocket.CLOSED) {
    scheduleReconnect({ immediate: true });
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size) {
      return;
    }

    unbindBrowserEvents();
    clearReconnectTimer();
    closeSocket();
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
