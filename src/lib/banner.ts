import "server-only";

import { getDummyBannerRecords } from "@/lib/api-dummy-data";
import { BANNER_API_URL, USE_DUMMY_API_DATA } from "@/lib/env";

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

function compareBanners(left: BannerApiRecord, right: BannerApiRecord) {
  if (left.sort_order !== right.sort_order) {
    return left.sort_order - right.sort_order;
  }

  return left.id - right.id;
}

export async function getBannerRecords() {
  if (USE_DUMMY_API_DATA) {
    return getDummyBannerRecords()
      .filter((item) => item.is_active && item.image_url)
      .slice()
      .sort(compareBanners);
  }

  const response = await fetch(BANNER_API_URL, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch banners: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as BannerApiResponse;

  if (!payload?.data || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data
    .filter((item) => item.is_active && item.image_url)
    .slice()
    .sort(compareBanners);
}
