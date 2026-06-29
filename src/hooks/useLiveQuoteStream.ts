"use client";

import { useEffect, useRef, useState } from "react";

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

const RECONNECT_DELAY_MS = 3000;
const LIVE_QUOTES_STREAM_URL = "/api/live-quotes";

export function useLiveQuoteStream(): UseLiveQuoteStreamResult {
  const [quotes, setQuotes] = useState<LiveQuotePayload>({});
  const [status, setStatus] =
    useState<LiveQuoteConnectionStatus>("connecting");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isActive = true;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const connect = () => {
      clearReconnectTimer();
      eventSourceRef.current?.close();

      const source = new EventSource(LIVE_QUOTES_STREAM_URL);
      eventSourceRef.current = source;

      setStatus((currentStatus) =>
        currentStatus === "live" ? "reconnecting" : "connecting",
      );

      source.onopen = () => {
        if (!isActive || eventSourceRef.current !== source) {
          source.close();
        }
      };

      const handleStatusEvent = (event: MessageEvent<string>) => {
        if (!isActive || eventSourceRef.current !== source) {
          return;
        }

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

      const handleQuoteEvent = (event: MessageEvent<string>) => {
        if (!isActive || eventSourceRef.current !== source) {
          return;
        }

        try {
          const payload = JSON.parse(event.data) as LiveQuotePayload;

          if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
            return;
          }

          setQuotes((currentQuotes) => ({
            ...currentQuotes,
            ...payload,
          }));

          const latestTick = Object.values(payload)
            .map((tick) => tick.date_time)
            .filter(Boolean)
            .sort()
            .at(-1);

          if (latestTick) {
            setLastUpdated(latestTick);
          }

          setStatus("live");
        } catch {
          setStatus("error");
        }
      };

      source.addEventListener("status", handleStatusEvent as EventListener);
      source.addEventListener("quote", handleQuoteEvent as EventListener);

      source.onerror = () => {
        if (!isActive || eventSourceRef.current !== source) {
          return;
        }

        setStatus("reconnecting");
        source.close();

        reconnectTimerRef.current = setTimeout(() => {
          if (isActive) {
            connect();
          }
        }, RECONNECT_DELAY_MS);
      };
    };

    connect();

    return () => {
      isActive = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      eventSourceRef.current?.close();
    };
  }, []);

  return {
    quotes,
    status,
    lastUpdated,
  };
}
