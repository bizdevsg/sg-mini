import "server-only";

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
};

const DUMMY_BANNER_COUNT = 10;
const DUMMY_BANNER_BASE_DATE = "2026-01-01T00:00:00.000Z";

function isLocalBannerFallbackSource(url: string) {
  return /(^https?:\/\/)?sg-admin\.test(?=\/|$)/i.test(url);
}

function createDummyBannerImage(index: number) {
  const label = `Banner Dummy ${index}`;
  const accent = index % 2 === 0 ? "#D5A246" : "#F4C15D";
  const secondary = index % 2 === 0 ? "#1E293B" : "#0F172A";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111217" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
      </defs>
      <rect width="1600" height="600" fill="url(#bg)" />
      <circle cx="1320" cy="140" r="180" fill="${accent}" fill-opacity="0.18" />
      <circle cx="220" cy="520" r="200" fill="${accent}" fill-opacity="0.12" />
      <rect x="80" y="72" width="1440" height="456" rx="28" fill="none" stroke="${accent}" stroke-width="4" stroke-opacity="0.6" />
      <text x="120" y="220" fill="${accent}" font-family="Arial, sans-serif" font-size="44" font-weight="700">${label}</text>
      <text x="120" y="300" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="72" font-weight="700">Solid Gold Berjangka</text>
      <text x="120" y="372" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="30">Fallback sementara saat sumber banner masih memakai sg-admin.test</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

function getDummyBannerRecords() {
  return Array.from({ length: DUMMY_BANNER_COUNT }, (_, index) => ({
    id: index + 1,
    image: `dummy-banner-${index + 1}.svg`,
    image_url: createDummyBannerImage(index + 1),
    is_active: true,
    sort_order: index + 1,
    created_at: DUMMY_BANNER_BASE_DATE,
    updated_at: DUMMY_BANNER_BASE_DATE,
  }));
}

function compareBanners(left: BannerApiRecord, right: BannerApiRecord) {
  if (left.sort_order !== right.sort_order) {
    return left.sort_order - right.sort_order;
  }

  return left.id - right.id;
}

export async function getBannerRecords() {
  if (isLocalBannerFallbackSource(BANNER_API_URL)) {
    return getDummyBannerRecords();
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
