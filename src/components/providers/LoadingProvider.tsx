"use client";

import {
  Suspense,
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
import {
  DEFAULT_LOCALE,
  getMessages,
  isSupportedLocale,
  type AppLocale,
} from "@/locales";

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
const OVERLAY_MIN_VISIBLE_MS = 300;
const ROUTE_LOADING_MIN_MS = 250;
const ROUTE_LOADING_MAX_MS = 5000;
const HIDE_AFTER_IDLE_MS = 120;

type RouteLoadingTrackerProps = {
  onRouteChange: () => void | (() => void);
  pathname: string;
};

function RouteLoadingTracker({
  onRouteChange,
  pathname,
}: RouteLoadingTrackerProps) {
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? "";

  useEffect(() => onRouteChange(), [onRouteChange, pathname, searchKey]);

  return null;
}

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
  const overlayShownAtRef = useRef(0);
  const sawNonRouteTokenRef = useRef(false);
  const routeMaxTimerRef = useRef<number | null>(null);
  const hasMountedRef = useRef(false);
  const pathname = usePathname();
  const activeLocale = useMemo(() => {
    const firstSegment = pathname.split("/").filter(Boolean)[0];

    return firstSegment && isSupportedLocale(firstSegment)
      ? firstSegment
      : locale ?? DEFAULT_LOCALE;
  }, [locale, pathname]);
  const messages = getMessages(activeLocale).loadingOverlay;

  const start = useCallback((label?: string) => {
    const token = Symbol(label ?? "loading");
    const isStartingFreshSession = tokens.current.size === 0;

    if (routeTokenRef.current && token !== routeTokenRef.current) {
      sawNonRouteTokenRef.current = true;
    }

    if (isStartingFreshSession) {
      overlayShownAtRef.current = Date.now();
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

  const handleRouteChange = useCallback(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

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
  }, [start, stop]);

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
    const elapsed = Date.now() - overlayShownAtRef.current;
    const minVisibleWaitMs = Math.max(0, OVERLAY_MIN_VISIBLE_MS - elapsed);
    const fadeTimeout = window.setTimeout(() => {
      setFadeOut(true);
      hideTimeout = window.setTimeout(() => {
        setShowOverlay(false);
        setFadeOut(false);
      }, 300);
    }, minVisibleWaitMs + HIDE_AFTER_IDLE_MS);

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
      <Suspense fallback={null}>
        <RouteLoadingTracker
          onRouteChange={handleRouteChange}
          pathname={pathname}
        />
      </Suspense>
      {children}
      {showOverlay ? (
        <LoadingOverlay
          brandLabel={getMessages(activeLocale).app.brandWordmark}
          logoAlt={getMessages(activeLocale).footer.logoAlt}
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
