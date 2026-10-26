import "server-only";

import { cache } from "react";

import { TIKTOK_VIDEO_API_URL } from "@/lib/env";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";
import type { TikTokVideo } from "@/lib/tiktok-video.shared";

type RawTikTokVideo = {
  id?: number | string | null;
  video_id?: string | number | null;
  title?: string | null;
  is_active?: boolean | number | string | null;
};

type TikTokVideoApiResponse = {
  data?: RawTikTokVideo[];
};

export type TikTokVideoResult = {
  data: TikTokVideo;
  source: "api" | "fallback";
};

const TIKTOK_VIDEO_TIMEOUT_MS = 8000;
const TIKTOK_VIDEO_REVALIDATE_SECONDS = 300;
const FALLBACK_TIKTOK_VIDEO_ID = "7700863615682858247";

function buildTikTokVideo(
  videoId: string,
  options: { id?: number; title?: string } = {},
): TikTokVideo {
  return {
    id: options.id ?? 0,
    title: options.title ?? "",
    videoId,
    videoUrl: `https://www.tiktok.com/@solid.prime/video/${videoId}`,
    embedUrl: `https://www.tiktok.com/player/v1/${videoId}`,
  };
}

function getFallbackTikTokVideo(): TikTokVideoResult {
  return {
    data: buildTikTokVideo(FALLBACK_TIKTOK_VIDEO_ID),
    source: "fallback",
  };
}

function normalizeVideoId(value: unknown) {
  const normalizedValue = String(value ?? "").trim();
  return /^\d+$/.test(normalizedValue) ? normalizedValue : "";
}

function normalizeId(value: unknown) {
  const normalizedValue = Number(value);
  return Number.isSafeInteger(normalizedValue) ? normalizedValue : 0;
}

function normalizeActive(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return ["1", "true", "active"].includes(
    String(value ?? "").trim().toLowerCase(),
  );
}

function mapTikTokVideo(record: RawTikTokVideo): TikTokVideo | null {
  const videoId = normalizeVideoId(record.video_id);

  if (!videoId || !normalizeActive(record.is_active)) {
    return null;
  }

  return buildTikTokVideo(videoId, {
    id: normalizeId(record.id),
    title: record.title?.trim() ?? "",
  });
}

export const getTikTokVideo = cache(
  async function getTikTokVideo(): Promise<TikTokVideoResult> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      TIKTOK_VIDEO_TIMEOUT_MS,
    );

    try {
      const response = await fetch(TIKTOK_VIDEO_API_URL, {
        headers: await getSgAdminApiHeaders(),
        next: { revalidate: TIKTOK_VIDEO_REVALIDATE_SECONDS },
        signal: controller.signal,
      });

      if (!response.ok) {
        return getFallbackTikTokVideo();
      }

      const payload = (await response.json()) as TikTokVideoApiResponse;
      const video = Array.isArray(payload.data)
        ? payload.data
            .map(mapTikTokVideo)
            .find((item): item is TikTokVideo => item !== null)
        : null;

      return video
        ? { data: video, source: "api" }
        : getFallbackTikTokVideo();
    } catch {
      return getFallbackTikTokVideo();
    } finally {
      clearTimeout(timeout);
    }
  },
);
