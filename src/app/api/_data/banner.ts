import "server-only";

import { unstable_cache } from "next/cache";

import { BANNER_API_URL } from "@/lib/env";

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
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    from?: number;
    to?: number;
  };
};

function compareBanners(left: BannerApiRecord, right: BannerApiRecord) {
  if (left.sort_order !== right.sort_order) {
    return left.sort_order - right.sort_order;
  }

  return left.id - right.id;
}

const getCachedBannerRecords = unstable_cache(
  async () => {
    const response = await fetch(BANNER_API_URL, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 300,
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
  },
  ["banner-records"],
  {
    revalidate: 300,
  },
);

export async function getBannerRecords() {
  return getCachedBannerRecords();
}
