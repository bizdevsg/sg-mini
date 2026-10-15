"use client";

import { useEffect } from "react";

import { clientAreaFetch } from "@/lib/client-area-fetch";
import {
  CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS,
  CLIENT_AREA_TOKEN_REFRESH_RETRY_MS,
  CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY,
  parseClientAreaLastActivity,
} from "@/lib/client-area-session";

function readLastRefresh() {
  try {
    return parseClientAreaLastActivity(
      window.localStorage.getItem(CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

function persistLastRefresh(timestamp: number) {
  try {
    window.localStorage.setItem(
      CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY,
      timestamp.toString(),
    );
  } catch {
    // A restricted browser can still refresh its own tab without cross-tab
    // coordination.
  }
}

function clearLastRefresh(timestamp: number) {
  try {
    if (readLastRefresh() === timestamp) {
      window.localStorage.removeItem(CLIENT_AREA_TOKEN_REFRESH_STORAGE_KEY);
    }
  } catch {
    // Ignore storage cleanup failures in restricted browsers.
  }
}

/**
 * Refreshes the encrypted server-side SGB session approximately every five
 * minutes while the Client Area is in use. Only a non-sensitive timestamp is
 * stored in localStorage; the bearer token remains in an httpOnly cookie.
 */
export function ClientAreaTokenRefresh() {
  useEffect(() => {
    const controller = new AbortController();
    let timer: number | null = null;
    let requestInFlight = false;
    let localLastRefresh = readLastRefresh() ?? Date.now();

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

      const sharedLastRefresh = readLastRefresh() ?? 0;
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
      persistLastRefresh(attemptAt);
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
          clearLastRefresh(attemptAt);
          localLastRefresh = 0;
          schedule(CLIENT_AREA_TOKEN_REFRESH_RETRY_MS);
          return;
        }

        localLastRefresh = Date.now();
        persistLastRefresh(localLastRefresh);
        schedule(CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS);
      } catch {
        if (!controller.signal.aborted) {
          clearLastRefresh(attemptAt);
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

    // Existing data requests normally rotate the freshly issued login token;
    // begin the dedicated keep-alive after one interval to avoid an extra call
    // during initial page hydration.
    schedule(CLIENT_AREA_TOKEN_REFRESH_INTERVAL_MS);

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
  }, []);

  return null;
}
