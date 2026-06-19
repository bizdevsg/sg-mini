"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { LoadingOverlay } from "@/components/molecules/LoadingOverlay";
import { getMessages, type AppLocale } from "@/locales";

type LoadingContextValue = {
  start: (label?: string) => symbol;
  stop: (token: symbol) => void;
  isLoading: boolean;
};

type LoadingProviderProps = {
  children: React.ReactNode;
  locale: AppLocale;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);
const MAX_LOADING_MS = 10000;
const ROUTE_LOADING_MIN_MS = 250;
const ROUTE_LOADING_MAX_MS = 5000;
const HIDE_AFTER_IDLE_MS = 200;

export function LoadingProvider({
  children,
  locale,
}: LoadingProviderProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const tokens = useRef(new Set<symbol>());
  const tokenTimers = useRef(new Map<symbol, number>());
  const routeTokenRef = useRef<symbol | null>(null);
  const routeStartedAtRef = useRef(0);
  const sawNonRouteTokenRef = useRef(false);
  const routeMaxTimerRef = useRef<number | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? "";
  const messages = getMessages(locale).loadingOverlay;

  const start = useCallback((label?: string) => {
    const token = Symbol(label ?? "loading");

    if (routeTokenRef.current && token !== routeTokenRef.current) {
      sawNonRouteTokenRef.current = true;
    }

    tokens.current.add(token);
    setPendingCount((count) => count + 1);
    setShowOverlay(true);
    setFadeOut(false);

    const timer = window.setTimeout(() => {
      if (tokens.current.has(token)) {
        tokens.current.delete(token);
        setPendingCount((count) => Math.max(0, count - 1));
      }

      tokenTimers.current.delete(token);
    }, MAX_LOADING_MS);

    tokenTimers.current.set(token, timer);
    return token;
  }, []);

  const stop = useCallback((token: symbol) => {
    if (!tokens.current.has(token)) {
      return;
    }

    tokens.current.delete(token);
    setPendingCount((count) => Math.max(0, count - 1));

    const timer = tokenTimers.current.get(token);

    if (timer) {
      window.clearTimeout(timer);
      tokenTimers.current.delete(token);
    }

    if (routeTokenRef.current === token) {
      routeTokenRef.current = null;
      sawNonRouteTokenRef.current = false;

      if (routeMaxTimerRef.current) {
        window.clearTimeout(routeMaxTimerRef.current);
        routeMaxTimerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (routeTokenRef.current) {
      stop(routeTokenRef.current);
      routeTokenRef.current = null;
    }

    if (routeMaxTimerRef.current) {
      window.clearTimeout(routeMaxTimerRef.current);
      routeMaxTimerRef.current = null;
    }

    routeStartedAtRef.current = Date.now();
    sawNonRouteTokenRef.current = false;

    const routeToken = start("route");
    routeTokenRef.current = routeToken;

    routeMaxTimerRef.current = window.setTimeout(() => {
      if (routeTokenRef.current === routeToken) {
        stop(routeToken);
      }
    }, ROUTE_LOADING_MAX_MS);

    return () => {
      if (routeMaxTimerRef.current) {
        window.clearTimeout(routeMaxTimerRef.current);
        routeMaxTimerRef.current = null;
      }

      if (routeTokenRef.current === routeToken) {
        stop(routeToken);
      }
    };
  }, [pathname, searchKey, start, stop]);

  useEffect(() => {
    const routeToken = routeTokenRef.current;

    if (!routeToken) {
      return;
    }

    const elapsed = Date.now() - routeStartedAtRef.current;
    const waitMs = Math.max(0, ROUTE_LOADING_MIN_MS - elapsed);

    if (!sawNonRouteTokenRef.current) {
      const timer = window.setTimeout(() => {
        if (routeTokenRef.current !== routeToken) {
          return;
        }

        if (sawNonRouteTokenRef.current) {
          return;
        }

        stop(routeToken);
      }, waitMs);

      return () => {
        window.clearTimeout(timer);
      };
    }

    if (pendingCount !== 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (routeTokenRef.current !== routeToken) {
        return;
      }

      if (pendingCount !== 1) {
        return;
      }

      stop(routeToken);
    }, waitMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pendingCount, stop]);

  useEffect(() => {
    if (pendingCount > 0 || !showOverlay) {
      return;
    }

    let hideTimeout: number | undefined;
    const fadeTimeout = window.setTimeout(() => {
      setFadeOut(true);
      hideTimeout = window.setTimeout(() => {
        setShowOverlay(false);
        setFadeOut(false);
      }, 300);
    }, HIDE_AFTER_IDLE_MS);

    return () => {
      window.clearTimeout(fadeTimeout);

      if (hideTimeout) {
        window.clearTimeout(hideTimeout);
      }
    };
  }, [pendingCount, showOverlay]);

  useEffect(() => {
    const tokenTimersRef = tokenTimers.current;
    const tokensRef = tokens.current;

    return () => {
      tokenTimersRef.forEach((timer) => window.clearTimeout(timer));
      tokenTimersRef.clear();
      tokensRef.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      start,
      stop,
      isLoading: pendingCount > 0,
    }),
    [pendingCount, start, stop],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {showOverlay ? (
        <LoadingOverlay
          title={messages.title}
          description={messages.description}
          fadingOut={fadeOut}
        />
      ) : null}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider.");
  }

  return context;
}
