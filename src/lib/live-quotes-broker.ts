import "server-only";

import { LIVE_QUOTE_SOCKET_URL } from "@/lib/env";
import type { LiveQuotePayload } from "@/lib/live-quotes";

export type LiveQuoteStreamStatus =
  | "connecting"
  | "live"
  | "reconnecting"
  | "error";

type LiveQuoteSubscriber = {
  send: (event: string, data: unknown) => void;
};

const BASE_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 15000;
const STALE_SOCKET_TIMEOUT_MS = 45000;
const STALE_SOCKET_CHECK_INTERVAL_MS = 10000;

const subscribers = new Set<LiveQuoteSubscriber>();

let upstreamSocket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let staleSocketTimer: ReturnType<typeof setInterval> | null = null;
let connectionStatus: LiveQuoteStreamStatus = "connecting";
let lastMessageAt = 0;
let reconnectAttempts = 0;
let latestQuotes: LiveQuotePayload = {};

function hasCachedQuotes() {
  return Object.keys(latestQuotes).length > 0;
}

function isLiveQuotePayload(value: unknown): value is LiveQuotePayload {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function clearStaleSocketTimer() {
  if (staleSocketTimer) {
    clearInterval(staleSocketTimer);
    staleSocketTimer = null;
  }
}

function broadcast(event: string, data: unknown) {
  for (const subscriber of subscribers) {
    subscriber.send(event, data);
  }
}

function setConnectionStatus(nextStatus: LiveQuoteStreamStatus) {
  connectionStatus = nextStatus;
  broadcast("status", { status: nextStatus });
}

function stopUpstreamSocket() {
  clearReconnectTimer();
  clearStaleSocketTimer();

  if (upstreamSocket) {
    const socketToClose = upstreamSocket;
    upstreamSocket = null;
    socketToClose.close();
  }
}

function startStaleSocketTimer(currentSocket: WebSocket) {
  clearStaleSocketTimer();

  staleSocketTimer = setInterval(() => {
    if (upstreamSocket !== currentSocket) {
      clearStaleSocketTimer();
      return;
    }

    if (Date.now() - lastMessageAt <= STALE_SOCKET_TIMEOUT_MS) {
      return;
    }

    currentSocket.close();
  }, STALE_SOCKET_CHECK_INTERVAL_MS);
}

function scheduleReconnect() {
  if (!subscribers.size) {
    stopUpstreamSocket();
    return;
  }

  if (reconnectTimer) {
    return;
  }

  const delay = Math.min(
    MAX_RECONNECT_DELAY_MS,
    BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempts,
  );
  reconnectAttempts += 1;

  setConnectionStatus(hasCachedQuotes() ? "reconnecting" : "error");

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectUpstream();
  }, delay);
}

function connectUpstream() {
  if (!subscribers.size) {
    stopUpstreamSocket();
    return;
  }

  if (
    upstreamSocket &&
    (upstreamSocket.readyState === WebSocket.OPEN ||
      upstreamSocket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  stopUpstreamSocket();
  setConnectionStatus(hasCachedQuotes() ? "reconnecting" : "connecting");

  const currentSocket = new WebSocket(LIVE_QUOTE_SOCKET_URL);
  upstreamSocket = currentSocket;
  lastMessageAt = Date.now();
  startStaleSocketTimer(currentSocket);

  currentSocket.onopen = () => {
    if (upstreamSocket !== currentSocket) {
      currentSocket.close();
      return;
    }

    reconnectAttempts = 0;
    lastMessageAt = Date.now();
    setConnectionStatus(hasCachedQuotes() ? "live" : "connecting");
  };

  currentSocket.onmessage = (event) => {
    if (upstreamSocket !== currentSocket) {
      return;
    }

    lastMessageAt = Date.now();

    try {
      const payload = JSON.parse(event.data as string) as LiveQuotePayload;

      if (!isLiveQuotePayload(payload)) {
        return;
      }

      latestQuotes = {
        ...latestQuotes,
        ...payload,
      };

      broadcast("quote", payload);
      setConnectionStatus("live");
    } catch {
      // Ignore upstream keepalive or malformed frames and rely on the stale
      // watchdog if the feed stops producing usable quote payloads.
    }
  };

  currentSocket.onerror = () => {
    if (upstreamSocket !== currentSocket) {
      return;
    }

    setConnectionStatus(hasCachedQuotes() ? "reconnecting" : "error");
  };

  currentSocket.onclose = () => {
    if (upstreamSocket !== currentSocket) {
      return;
    }

    upstreamSocket = null;
    clearStaleSocketTimer();
    scheduleReconnect();
  };
}

export function subscribeToLiveQuotes(
  send: (event: string, data: unknown) => void,
) {
  const subscriber: LiveQuoteSubscriber = { send };
  subscribers.add(subscriber);

  send("status", { status: connectionStatus });

  if (hasCachedQuotes()) {
    send("quote", latestQuotes);
  }

  connectUpstream();

  return () => {
    subscribers.delete(subscriber);

    if (!subscribers.size) {
      stopUpstreamSocket();
      connectionStatus = hasCachedQuotes() ? "reconnecting" : "connecting";
    }
  };
}
