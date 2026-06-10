"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getCdnAssetUrl } from "@/lib/env";
import { getMessages } from "@/locales";

const INITIAL_PROGRESS = 10;
const MAX_PROGRESS_BEFORE_COMPLETE = 92;

function hasNavigationModifiers(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function getNavigationUrl(anchor: HTMLAnchorElement) {
  try {
    return new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

function isPriorityImage(image: HTMLImageElement) {
  if (image.loading !== "lazy") {
    return true;
  }

  if (image.fetchPriority === "high") {
    return true;
  }

  const bounds = image.getBoundingClientRect();
  return bounds.top < window.innerHeight * 1.25;
}

function waitForImage(image: HTMLImageElement) {
  if (image.complete) {
    if (typeof image.decode === "function") {
      return image.decode().catch(() => undefined);
    }

    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => {
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);
      resolve();
    };

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  });
}

async function waitForPageReady() {
  await waitForNextPaint();

  if ("fonts" in document) {
    await document.fonts.ready.catch(() => undefined);
  }

  const images = Array.from(document.images).filter(isPriorityImage);
  await Promise.all(images.map(waitForImage));
  await waitForNextPaint();
}

export function RouteLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const mountedRef = useRef(false);
  const navigationTokenRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);
  const failSafeTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const locale = pathname.startsWith("/en") ? "en" : "id";
  const loadingOverlay = getMessages(locale).loadingOverlay;

  function clearTimers() {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (failSafeTimerRef.current !== null) {
      window.clearTimeout(failSafeTimerRef.current);
      failSafeTimerRef.current = null;
    }

    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }

  function finishLoading() {
    if (!isLoadingRef.current) {
      return;
    }

    clearTimers();
    isLoadingRef.current = false;
    setProgress(100);

    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 220);
  }

  function startLoading() {
    if (isLoadingRef.current) {
      return;
    }

    clearTimers();
    isLoadingRef.current = true;
    setIsVisible(true);
    setProgress(INITIAL_PROGRESS);

    progressTimerRef.current = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= MAX_PROGRESS_BEFORE_COMPLETE) {
          return currentProgress;
        }

        const remaining = MAX_PROGRESS_BEFORE_COMPLETE - currentProgress;
        const nextStep = Math.max(1.2, remaining * 0.16);

        return Math.min(
          MAX_PROGRESS_BEFORE_COMPLETE,
          currentProgress + nextStep,
        );
      });
    }, 180);

    failSafeTimerRef.current = window.setTimeout(() => {
      finishLoading();
    }, 12000);
  }

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (!isLoadingRef.current) {
      return;
    }

    const currentToken = ++navigationTokenRef.current;

    void (async () => {
      await waitForPageReady();

      if (navigationTokenRef.current !== currentToken) {
        return;
      }

      finishLoading();
    })();
  }, [routeKey]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        hasNavigationModifiers(event)
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel")?.includes("external")
      ) {
        return;
      }

      const nextUrl = getNavigationUrl(anchor);
      if (!nextUrl || nextUrl.origin !== window.location.origin) {
        return;
      }

      const currentUrl = new URL(window.location.href);
      const isSameDocument =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search;

      if (isSameDocument) {
        return;
      }

      startLoading();
    };

    const handlePopState = () => {
      startLoading();
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        isVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      style={{
        backgroundColor: "#050505",
        backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(240,203,115,.08) 0%, transparent 30%),
        radial-gradient(circle at 80% 30%, rgba(240,203,115,.06) 0%, transparent 25%),
        radial-gradient(circle at 50% 80%, rgba(240,203,115,.05) 0%, transparent 35%)
      `,
      }}
      aria-hidden={!isVisible}
    >
      {/* Gold Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[15%] top-[30%] h-1 w-1 animate-pulse rounded-full bg-[#f0cb73]/50" />
        <div className="absolute right-[20%] top-[40%] h-1 w-1 animate-pulse rounded-full bg-[#f0cb73]/30" />
        <div className="absolute bottom-[20%] left-[60%] h-1 w-1 animate-pulse rounded-full bg-[#f0cb73]/40" />
        <div className="absolute left-[70%] top-[18%] h-[2px] w-[2px] animate-pulse rounded-full bg-[#f0cb73]/50" />
        <div className="absolute left-[25%] bottom-[25%] h-[2px] w-[2px] animate-pulse rounded-full bg-[#f0cb73]/40" />
      </div>

      {/* Main Card */}
      <div
        className={`relative flex w-[min(92vw,380px)] flex-col items-center gap-6 rounded-[32px] border border-[#f0cb73]/10 bg-white/[0.03] px-8 py-8 shadow-[0_0_80px_rgba(240,203,115,.06)] backdrop-blur-2xl transition-all duration-300 ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Logo */}
        <div className="relative flex py-5 items-center justify-center">
          {/* Glow */}
          <div className="absolute h-40 w-40 rounded-full bg-[#f0cb73]/10 blur-3xl" />

          {/* Logo Container */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            <Image
              src={getCdnAssetUrl("Logo%20SG-WEB111.png")}
              alt="Logo SGB"
              width={120}
              height={120}
              priority
              className="h-28 w-28 object-contain"
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1 text-center">
          <p className="text-sm font-semibold tracking-wide text-white">
            {loadingOverlay.title}
          </p>

          <p className="text-xs text-white/45">
            {loadingOverlay.description}
          </p>
        </div>

        {/* Progress */}
        <div className="w-full">
          <div className="h-[4px] overflow-hidden rounded-full bg-white/5">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-[#f0cb73] via-[#d6aa4a] to-[#fff0c0] transition-[width] duration-200 ease-out"
              style={{
                width: `${progress}%`,
              }}
            >
              <div
                className="
                absolute inset-0
                animate-[shimmer_2s_linear_infinite]
                bg-gradient-to-r
                from-transparent
                via-white/40
                to-transparent
              "
              />
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="font-mono text-xs tracking-[0.2em] text-[#f0cb73]/80">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Bottom Glow */}
        <div className="absolute -bottom-8 left-1/2 h-20 w-48 -translate-x-1/2 rounded-full bg-[#f0cb73]/10 blur-3xl" />
      </div>
    </div>
  );
}
