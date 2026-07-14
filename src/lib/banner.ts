import "server-only";

import { cache } from "react";

import { getDummyBannerDetailBySlug, getDummyBannerRecords } from "@/lib/api-dummy-data";
import {
  BANNER_API_URL,
  BANNER_DETAIL_API_URL,
  BANNER_IMAGE_BASE_URL,
  USE_DUMMY_API_DATA,
  getBannerAssetUrl,
} from "@/lib/env";

export type BannerApiRecord = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BannerDetailRecord = BannerApiRecord;

type RawBannerApiRecord = {
  id: number;
  slug?: string | null;
  title?: string | null;
  judul?: string | null;
  excerpt?: string | null;
  ringkasan?: string | null;
  content?: string | null;
  konten?: string | null;
  terms_and_conditions?: string | null;
  image?: string | null;
  image_url?: string | null;
  is_active?: boolean | number | string | null;
  sort_order?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type BannerApiResponse = {
  data?: RawBannerApiRecord[];
};

type BannerDetailApiResponse = {
  data?: RawBannerApiRecord | RawBannerApiRecord[] | null;
};

const BANNER_TIMEOUT_MS = 8000;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue === "1" || normalizedValue === "true";
  }

  return false;
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return 0;
}

function isLocalBannerAssetPath(value: string) {
  return value.startsWith("/assets/");
}

function resolveBannerAssetUrl(value: string) {
  return isLocalBannerAssetPath(value) ? value : getBannerAssetUrl(value);
}

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function getAssetOrigin(baseUrl: string) {
  try {
    return new URL(baseUrl).origin;
  } catch {
    return baseUrl;
  }
}

function buildDirectBannerAssetUrl(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  if (isAbsoluteHttpUrl(normalizedValue)) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("/")) {
    return `${getAssetOrigin(BANNER_IMAGE_BASE_URL)}${normalizedValue}`;
  }

  return `${BANNER_IMAGE_BASE_URL.replace(/\/+$/, "")}/${normalizedValue.replace(/^\/+/, "")}`;
}

function sanitizeBannerHtml(content: string | null | undefined) {
  if (!content) {
    return "";
  }

  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+(src|href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/\s+data-mce-[a-z-]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+contenteditable\s*=\s*(['"]).*?\1/gi, "")
    .replace(/<(img|source)\b([^>]*)\bsrc=(['"])(.*?)\3([^>]*)>/gi, (_match, tagName, before, quote, src, after) => {
      const normalizedSrc = normalizeText(src);
      const resolvedSrc = normalizedSrc ? resolveBannerAssetUrl(normalizedSrc) : normalizedSrc;
      return `<${tagName}${before}src=${quote}${resolvedSrc || src}${quote}${after}>`;
    })
    .replace(/<a\b([^>]*)\bhref=(['"])(.*?)\2([^>]*)>/gi, (_match, before, quote, href, after) => {
      const normalizedHref = normalizeText(href);
      const isAbsoluteOrSafeHref =
        /^(mailto:|tel:|#|https?:\/\/)/i.test(normalizedHref) ||
        normalizedHref.startsWith("/");
      const resolvedHref =
        !normalizedHref || isAbsoluteOrSafeHref
          ? normalizedHref
          : buildDirectBannerAssetUrl(normalizedHref);
      const target = /target\s*=/i.test(`${before} ${after}`)
        ? ""
        : ' target="_blank"';
      const rel = /rel\s*=/i.test(`${before} ${after}`)
        ? ""
        : ' rel="noopener noreferrer"';

      return `<a${before}href=${quote}${resolvedHref || href}${quote}${after}${target}${rel}>`;
    })
    .replace(/<img\b(?![^>]*\bloading=)([^>]*)>/gi, '<img loading="lazy"$1>')
    .replace(/<table\b([^>]*)>/gi, '<div class="banner-detail-table-wrap"><table$1>')
    .replace(/<\/table>/gi, "</table></div>");
}

function mapBannerRecord(item: RawBannerApiRecord): BannerApiRecord | null {
  const image = normalizeText(item.image);
  const imageUrlSource = normalizeText(item.image_url) || image;
  const title = normalizeText(item.title ?? item.judul);
  const slug = normalizeText(item.slug);

  if (!imageUrlSource) {
    return null;
  }

  return {
    id: item.id,
    slug,
    title,
    excerpt: normalizeText(item.excerpt ?? item.ringkasan),
    content: sanitizeBannerHtml(
      item.content ?? item.konten ?? item.terms_and_conditions ?? "",
    ),
    image,
    image_url: resolveBannerAssetUrl(imageUrlSource),
    is_active: normalizeBoolean(item.is_active),
    sort_order: normalizeNumber(item.sort_order),
    created_at: normalizeText(item.created_at),
    updated_at: normalizeText(item.updated_at),
  };
}

function compareBanners(left: BannerApiRecord, right: BannerApiRecord) {
  if (left.sort_order !== right.sort_order) {
    return left.sort_order - right.sort_order;
  }

  return left.id - right.id;
}

function buildBannerDetailApiUrl(slug: string) {
  const baseUrl = BANNER_DETAIL_API_URL.replace(/\/+$/, "");
  return `${baseUrl}/${encodeURIComponent(slug)}`;
}

async function fetchBannerList() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BANNER_TIMEOUT_MS);

  try {
    const response = await fetch(BANNER_API_URL, {
      cache: "no-store",
      signal: controller.signal,
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
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchBannerDetail(slug: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BANNER_TIMEOUT_MS);

  try {
    const response = await fetch(buildBannerDetailApiUrl(slug), {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as BannerDetailApiResponse;

    if (!payload?.data) {
      return null;
    }

    const rawRecord = Array.isArray(payload.data)
      ? payload.data[0] ?? null
      : payload.data;

    if (!rawRecord) {
      return null;
    }

    const mappedRecord = mapBannerRecord(rawRecord);
    return mappedRecord && mappedRecord.is_active ? mappedRecord : null;
  } catch (error) {
    console.error(`Failed to fetch banner detail for slug "${slug}"`, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export const getBannerRecords = cache(async function getBannerRecords() {
  if (USE_DUMMY_API_DATA) {
    return getDummyBannerRecords()
      .map(mapBannerRecord)
      .filter((item): item is BannerApiRecord => Boolean(item && item.is_active))
      .slice()
      .sort(compareBanners);
  }

  return fetchBannerList();
});

export const getBannerBySlug = cache(async function getBannerBySlug(slug: string) {
  if (USE_DUMMY_API_DATA) {
    return getDummyBannerDetailBySlug(slug);
  }

  const normalizedSlug = normalizeText(slug);

  if (!normalizedSlug) {
    return null;
  }

  const detailedBanner = await fetchBannerDetail(normalizedSlug);

  if (detailedBanner) {
    return detailedBanner;
  }

  const banners = await getBannerRecords();
  return banners.find((banner) => banner.slug === normalizedSlug) ?? null;
});
