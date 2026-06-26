import "server-only";

import { getDummyBannerRecords } from "@/lib/api-dummy-data";
import {
  BANNER_API_URL,
  USE_DUMMY_API_DATA,
  getBannerAssetUrl,
} from "@/lib/env";

export type BannerApiRecord = {
  id: number;
  image: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type BannerApiResponse = {
  data?: BannerApiRecord[];
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function mapBannerRecord(item: BannerApiRecord): BannerApiRecord | null {
  const image = normalizeText(item.image);
  const imageUrlSource = normalizeText(item.image_url) || image;

  if (!imageUrlSource) {
    return null;
  }

  return {
    ...item,
    image: image || item.image,
    image_url: getBannerAssetUrl(imageUrlSource),
  };
}

function compareBanners(left: BannerApiRecord, right: BannerApiRecord) {
  if (left.sort_order !== right.sort_order) {
    return left.sort_order - right.sort_order;
  }

  return left.id - right.id;
}

export async function getBannerRecords() {
  if (USE_DUMMY_API_DATA) {
    return getDummyBannerRecords()
      .map(mapBannerRecord)
      .filter((item): item is BannerApiRecord => Boolean(item && item.is_active))
      .slice()
      .sort(compareBanners);
  }

  try {
    const response = await fetch(BANNER_API_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch banners: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const payload = (await response.json()) as BannerApiResponse;

    if (!payload?.data || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data
      .map(mapBannerRecord)
      .filter((item): item is BannerApiRecord => Boolean(item && item.is_active))
      .slice()
      .sort(compareBanners);
  } catch (error) {
    console.error("Failed to fetch banners", error);
    return [];
  }
}
