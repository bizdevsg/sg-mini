"use client";

import type { TransitionEvent } from "react";
import { useEffect, useRef, useState } from "react";

import type { BannerApiRecord } from "@/lib/banner";
import { getMessages, type AppLocale } from "@/locales";

type BannerSlideshowProps = {
  banners: BannerApiRecord[];
  locale: AppLocale;
};

const TRACK_TRANSITION_DURATION_MS = 520;
const AUTOPLAY_DELAY_MS = 4500;

function normalizeTrackIndex(trackIndex: number, bannerCount: number) {
  if (bannerCount <= 1) {
    return 0;
  }

  const normalizedIndex =
    ((trackIndex % bannerCount) + bannerCount) % bannerCount;

  return normalizedIndex + bannerCount;
}

function getSlideGap(viewportWidth: number) {
  return viewportWidth >= 1024 ? 48 : 24;
}

function getSlideWidth(viewportWidth: number) {
  if (viewportWidth >= 1600) {
    return 980;
  }

  if (viewportWidth >= 1280) {
    return Math.round(viewportWidth * 0.56);
  }

  if (viewportWidth >= 1024) {
    return Math.round(viewportWidth * 0.62);
  }

  if (viewportWidth >= 640) {
    return Math.round(viewportWidth * 0.8);
  }

  return Math.round(viewportWidth * 0.86);
}

function formatBannerLabel(template: string, index: number) {
  return template.replace("{index}", String(index));
}

export function BannerSlideshow({ banners, locale }: BannerSlideshowProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(banners.length);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(0);
  const labels = getMessages(locale).bannerSlideshow;
  const repeatedBanners =
    banners.length > 1 ? [...banners, ...banners, ...banners] : banners;

  function clearAutoplayTimer() {
    if (autoplayTimerRef.current !== null) {
      window.clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }

  function scheduleNextAutoplay() {
    clearAutoplayTimer();

    if (banners.length <= 1 || document.hidden) {
      return;
    }

    autoplayTimerRef.current = window.setTimeout(() => {
      setIsTransitionEnabled(true);
      setTrackIndex((currentIndex) => currentIndex + 1);
      setActiveIndex((currentIndex) => (currentIndex + 1) % banners.length);
    }, AUTOPLAY_DELAY_MS);
  }

  useEffect(() => {
    setActiveIndex(0);
    setTrackIndex(banners.length > 1 ? banners.length : 0);
    setIsTransitionEnabled(true);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    scheduleNextAutoplay();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearAutoplayTimer();
        return;
      }

      setIsTransitionEnabled(false);
      setTrackIndex((currentIndex) =>
        normalizeTrackIndex(currentIndex, banners.length),
      );
      setActiveIndex((currentIndex) => currentIndex % banners.length);
      scheduleNextAutoplay();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearAutoplayTimer();
    };
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    scheduleNextAutoplay();

    return () => {
      clearAutoplayTimer();
    };
  }, [activeIndex, banners.length]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateViewportWidth = () => {
      setViewportWidth(viewport.clientWidth);
    };

    updateViewportWidth();

    const observer = new ResizeObserver(() => {
      updateViewportWidth();
    });

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  const resolvedViewportWidth = viewportWidth || 1280;
  const slideGap = getSlideGap(resolvedViewportWidth);
  const slideWidth = getSlideWidth(resolvedViewportWidth);
  const effectiveTrackIndex = banners.length > 1 ? trackIndex : 0;
  const trackOffset =
    resolvedViewportWidth > 0
      ? resolvedViewportWidth / 2 -
      slideWidth / 2 -
      effectiveTrackIndex * (slideWidth + slideGap)
      : 0;

  function goToSlide(targetIndex: number) {
    if (banners.length <= 1) {
      return;
    }

    clearAutoplayTimer();
    setIsTransitionEnabled(true);
    setTrackIndex(banners.length + targetIndex);
    setActiveIndex(targetIndex);
  }

  function handleTrackTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform" ||
      banners.length <= 1
    ) {
      return;
    }

    if (trackIndex < banners.length) {
      setIsTransitionEnabled(false);
      setTrackIndex(trackIndex + banners.length);
      setActiveIndex(trackIndex % banners.length);
      return;
    }

    if (trackIndex >= banners.length * 2) {
      setIsTransitionEnabled(false);
      setTrackIndex(trackIndex - banners.length);
      setActiveIndex(trackIndex % banners.length);
    }
  }

  return (
    <div
      className="relative"
      role="region"
      aria-label={labels.regionLabel}
      aria-roledescription="carousel"
    >
      <div
        ref={viewportRef}
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]"
      >
        <div
          className="flex items-start ease-out"
          style={{
            gap: `${slideGap}px`,
            transform: `translateX(${trackOffset}px)`,
            transitionDuration: isTransitionEnabled
              ? `${TRACK_TRANSITION_DURATION_MS}ms`
              : "0ms",
            transitionProperty: "transform",
            transitionTimingFunction: "ease-out",
          }}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {repeatedBanners.map((banner, index) => {
            const normalizedIndex =
              banners.length > 0 ? index % banners.length : 0;

            return (
              <button
                key={`${banner.id}-${index}`}
                type="button"
                aria-label={formatBannerLabel(
                  labels.slideButtonLabel,
                  normalizedIndex + 1,
                )}
                aria-pressed={normalizedIndex === activeIndex}
                className="shrink-0 text-left"
                style={{
                  width: `${slideWidth}px`,
                }}
                onClick={() => {
                  if (banners.length <= 1) {
                    return;
                  }

                  goToSlide(normalizedIndex);
                }}
              >
                <article
                  className={`overflow-hidden transition-opacity duration-300 rounded-xl overflow-hidden ${normalizedIndex === activeIndex
                    ? "border-line opacity-100"
                    : "border-line/80 opacity-80 hover:opacity-100"
                    }`}
                >
                  <img
                    src={banner.image_url}
                    alt={formatBannerLabel(
                      labels.slideImageAlt,
                      normalizedIndex + 1,
                    )}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="block h-auto w-full"
                  />
                </article>
              </button>
            );
          })}
        </div>
      </div>

      {banners.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-2">
          {banners.map((banner, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={banner.id}
                type="button"
                aria-label={formatBannerLabel(labels.slideButtonLabel, index + 1)}
                aria-pressed={isActive}
                className={`h-2.5 rounded-full transition-all duration-300 ${isActive
                  ? "w-8 bg-linear-to-b from-[#FF9600] to-[#FFDE00]"
                  : "w-2.5 bg-white/35 hover:bg-white/60"
                  }`}
                onClick={() => {
                  goToSlide(index);
                }}
              >
                <span className="sr-only">
                  {formatBannerLabel(labels.slideButtonLabel, index + 1)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
