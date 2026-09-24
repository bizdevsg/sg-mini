"use client";

import { useEffect, useState } from "react";

import type { BannerApiRecord } from "@/lib/banner";

type BannerApiResponse = {
  data?: BannerApiRecord[];
};

const BANNER_RETRY_DELAYS_MS = [0, 1500, 4000] as const;

export function useBannerRecords(initialBanners: BannerApiRecord[]) {
  const [banners, setBanners] = useState(initialBanners);

  useEffect(() => {
    setBanners(initialBanners);
  }, [initialBanners]);

  useEffect(() => {
    if (initialBanners.length > 0) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    let retryTimeoutId: number | null = null;
    let attemptIndex = 0;

    const scheduleRetry = () => {
      attemptIndex += 1;

      if (cancelled || attemptIndex >= BANNER_RETRY_DELAYS_MS.length) {
        return;
      }

      retryTimeoutId = window.setTimeout(() => {
        void loadBanners();
      }, BANNER_RETRY_DELAYS_MS[attemptIndex]);
    };

    const loadBanners = async () => {
      try {
        const response = await fetch("/api/banner", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          scheduleRetry();
          return;
        }

        const payload = (await response.json()) as BannerApiResponse;

        if (cancelled) {
          return;
        }

        if (Array.isArray(payload.data) && payload.data.length > 0) {
          setBanners(payload.data);
          return;
        }

        scheduleRetry();
      } catch {
        if (cancelled || controller.signal.aborted) {
          return;
        }

        scheduleRetry();
      }
    };

    void loadBanners();

    return () => {
      cancelled = true;
      controller.abort();

      if (retryTimeoutId !== null) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, [initialBanners]);

  return banners;
}
