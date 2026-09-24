"use client";

import { useEffect, useEffectEvent, useRef } from "react";

import type { AppLocale } from "@/locales";
import {
  CLIENT_AREA_INACTIVITY_TIMEOUT_MS,
  CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS,
  CLIENT_AREA_LAST_ACTIVITY_COOKIE,
  CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY,
  getClientAreaLoginHref,
  parseClientAreaLastActivity,
} from "@/lib/client-area-session";

type ClientAreaSessionTimeoutProps = {
  locale: AppLocale;
};

const ACTIVITY_EVENTS = [
  "keydown",
  "mousedown",
  "mousemove",
  "scroll",
  "touchstart",
] as const;

const MIN_ACTIVITY_UPDATE_INTERVAL_MS = 1_000;
const MIN_ACTIVITY_PERSIST_INTERVAL_MS = 15_000;

function resolveCookieAttributes(maxAge: number) {
  return `${CLIENT_AREA_LAST_ACTIVITY_COOKIE}=; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function writeLastActivityCookie(value: number) {
  const secureAttribute =
    window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${CLIENT_AREA_LAST_ACTIVITY_COOKIE}=${value}; Max-Age=${CLIENT_AREA_INACTIVITY_TIMEOUT_SECONDS}; Path=/; SameSite=Lax${secureAttribute}`;
}

function clearLastActivityCookie() {
  const secureAttribute =
    window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${resolveCookieAttributes(0)}${secureAttribute}`;
}

function readSharedLastActivity() {
  try {
    return parseClientAreaLastActivity(
      window.localStorage.getItem(CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

function persistSharedLastActivity(value: number) {
  try {
    window.localStorage.setItem(
      CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY,
      value.toString(),
    );
  } catch {
    // Ignore storage write failures in restricted browsers.
  }
}

function clearSharedLastActivity() {
  try {
    window.localStorage.removeItem(CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failures in restricted browsers.
  }
}

export function ClientAreaSessionTimeout({
  locale,
}: ClientAreaSessionTimeoutProps) {
  const lastActivityRef = useRef(0);
  const lastPersistedActivityRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const expireSession = useEffectEvent(() => {
    clearLastActivityCookie();
    clearSharedLastActivity();
    window.location.replace(getClientAreaLoginHref(locale));
  });

  const scheduleTimeout = useEffectEvent(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    const remainingTime =
      CLIENT_AREA_INACTIVITY_TIMEOUT_MS -
      (Date.now() - lastActivityRef.current);

    if (remainingTime <= 0) {
      expireSession();
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      expireSession();
    }, remainingTime);
  });

  const syncActivity = useEffectEvent(
    (timestamp: number, options?: { persist?: boolean }) => {
      if (timestamp <= lastActivityRef.current) {
        return;
      }

      lastActivityRef.current = timestamp;

      if (options?.persist) {
        writeLastActivityCookie(timestamp);
        persistSharedLastActivity(timestamp);
        lastPersistedActivityRef.current = timestamp;
      }

      scheduleTimeout();
    },
  );

  useEffect(() => {
    const sharedLastActivity = readSharedLastActivity();
    const initialTimestamp = Math.max(sharedLastActivity ?? 0, Date.now());

    syncActivity(initialTimestamp, { persist: true });

    const handleActivity = () => {
      const timestamp = Date.now();

      if (
        timestamp - lastActivityRef.current <
        MIN_ACTIVITY_UPDATE_INTERVAL_MS
      ) {
        return;
      }

      syncActivity(timestamp, {
        persist:
          timestamp - lastPersistedActivityRef.current >=
          MIN_ACTIVITY_PERSIST_INTERVAL_MS,
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        return;
      }

      handleActivity();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CLIENT_AREA_LAST_ACTIVITY_STORAGE_KEY) {
        return;
      }

      const sharedTimestamp = parseClientAreaLastActivity(event.newValue);

      if (sharedTimestamp === null) {
        expireSession();
        return;
      }

      syncActivity(sharedTimestamp);
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorage);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [expireSession, scheduleTimeout, syncActivity]);

  return null;
}
