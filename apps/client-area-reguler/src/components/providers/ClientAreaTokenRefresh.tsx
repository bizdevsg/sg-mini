"use client";

import { useEffect } from "react";

import { clientAreaFetch } from "@/lib/client-area-fetch";
import {
  CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS,
  CLIENT_AREA_TOKEN_REFRESH_RETRY_MS,
  CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY,
  parseClientAreaLastActivity,
} from "@/lib/client-area-session";

type ClientAreaTokenRefreshProps = {
  sessionIssuedAtMs: number;
};

function parseStoredRefresh(value: string | null, sessionIssuedAtMs: number) {
  if (!value) return null;

  const [storedSession, storedTimestamp] = value.split(":");
  if (Number(storedSession) !== sessionIssuedAtMs) return null;

  return parseClientAreaLastActivity(storedTimestamp);
}

function readLastRefresh(sessionIssuedAtMs: number) {
  try {
    return parseStoredRefresh(
      window.localStorage.getItem(CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY),
      sessionIssuedAtMs,
    );
  } catch {
    return null;
  }
}

function persistLastRefresh(timestamp: number, sessionIssuedAtMs: number) {
  try {
    window.localStorage.setItem(
      CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY,
      `${sessionIssuedAtMs}:${timestamp}`,
    );
  } catch {
    // A restricted browser can still refresh its own tab without cross-tab
    // coordination.
  }
}

function clearLastRefresh(timestamp: number, sessionIssuedAtMs: number) {
  try {
    if (readLastRefresh(sessionIssuedAtMs) === timestamp) {
      window.localStorage.removeItem(CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage cleanup failures in restricted browsers.
  }
}

/**
 * Refreshes the encrypted server-side SGB session before the upstream token's
 * five-minute boundary. Refresh timestamps are scoped to the current login so
 * a previous session cannot delay the first keep-alive of a newly issued token.
 * Only a non-sensitive timestamp is stored in localStorage; the bearer token
 * remains in an httpOnly cookie.
 */
export function ClientAreaTokenRefresh({
  sessionIssuedAtMs,
}: ClientAreaTokenRefreshProps) {
  useEffect(() => {
    const controller = new AbortController();
    let timer: number | null = null;
    let requestInFlight = false;
    let localLastRefresh =
      readLastRefresh(sessionIssuedAtMs) || sessionIssuedAtMs || Date.now();

    function schedule(delay: number) {
      if (timer !== null) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        void refreshSession();
      }, Math.max(0, delay));
    }

    async function refreshSession(force = false) {
      if (controller.signal.aborted || requestInFlight) {
        return;
      }

      if (document.hidden || !navigator.onLine) {
        schedule(CLIENT_AREA_TOKEN_REFRESH_RETRY_MS);
        return;
      }

      const sharedLastRefresh = readLastRefresh(sessionIssuedAtMs) ?? 0;
      const lastRefresh = Math.max(localLastRefresh, sharedLastRefresh);
      const elapsed = Date.now() - lastRefresh;

      if (!force && elapsed < CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS) {
        schedule(CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS - elapsed);
        return;
      }

      // This timestamp also acts as a short cross-tab lease. Another tab that
      // wakes at the same moment sees it and waits instead of rotating the same
      // token concurrently.
      const attemptAt = Date.now();
      localLastRefresh = attemptAt;
      persistLastRefresh(attemptAt, sessionIssuedAtMs);
      requestInFlight = true;

      try {
        const response = await clientAreaFetch("/api/client-area/session/refresh", {
          method: "POST",
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "X-Client-Area-Session-Refresh": "1",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          clearLastRefresh(attemptAt, sessionIssuedAtMs);
          localLastRefresh = 0;
          schedule(CLIENT_AREA_TOKEN_REFRESH_RETRY_MS);
          return;
        }

        localLastRefresh = Date.now();
        persistLastRefresh(localLastRefresh, sessionIssuedAtMs);
        schedule(CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS);
      } catch {
        if (!controller.signal.aborted) {
          clearLastRefresh(attemptAt, sessionIssuedAtMs);
          localLastRefresh = 0;
          schedule(CLIENT_AREA_TOKEN_REFRESH_RETRY_MS);
        }
      } finally {
        requestInFlight = false;
      }
    }

    function refreshIfDue() {
      if (!document.hidden) {
        void refreshSession();
      }
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY) {
        refreshIfDue();
      }
    }

    // Count the first interval from when this login session was issued, not
    // from when a tab mounted. A newly opened tab must not postpone refresh for
    // an already aging token by another full interval.
    schedule(
      CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS -
        (Date.now() - localLastRefresh),
    );

    window.addEventListener("online", refreshIfDue);
    window.addEventListener("focus", refreshIfDue);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", refreshIfDue);

    return () => {
      controller.abort();

      if (timer !== null) {
        window.clearTimeout(timer);
      }

      window.removeEventListener("online", refreshIfDue);
      window.removeEventListener("focus", refreshIfDue);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", refreshIfDue);
    };
  }, [sessionIssuedAtMs]);

  return null;
}
