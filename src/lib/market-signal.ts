import "server-only";

import { getDummyMarketSignalFeed } from "@/lib/api-dummy-data";
import {
  MARKET_SIGNAL_API_URL,
  USE_DUMMY_API_DATA,
  getMarketSignalAssetUrl,
} from "@/lib/env";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";

export type MarketSignalPotensi = "buy" | "sell";

export type MarketSignalRecord = {
  id: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  title: string;
  potensi: MarketSignalPotensi;
  entry: string;
  isExpired: boolean | null;
  expiredAt: string;
  timeframe: string;
  takingProfit: string;
  stopLoss: string;
  source: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type RawMarketSignalCategory = {
  id: number;
  name?: string | null;
  slug?: string | null;
};

type RawMarketSignalRecord = {
  id: number;
  category_id: number;
  title?: string | null;
  potensi?: string | null;
  entry?: string | null;
  entri?: string | null;
  entry_price?: string | null;
  entrypoint?: string | null;
  entry_point?: string | null;
  harga_entry?: string | null;
  harga_masuk?: string | null;
  expired?: boolean | string | number | null;
  expire?: boolean | string | number | null;
  is_expired?: boolean | string | number | null;
  expired_signal?: boolean | string | number | null;
  signal_expired?: boolean | string | number | null;
  expired_at?: string | null;
  expire_at?: string | null;
  expiry_at?: string | null;
  expires_at?: string | null;
  status?: string | null;
  timeframe?: string | null;
  taking_profit?: string | null;
  stop_loss?: string | null;
  sumber?: string | null;
  source?: string | null;
  kategori?: string | null;
  category?: RawMarketSignalCategory | null;
  image?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
};

type MarketSignalApiResponse = {
  data?: RawMarketSignalRecord[];
};

export type MarketSignalResult = {
  items: MarketSignalRecord[];
  source: "api" | "empty";
};

const MARKET_SIGNAL_TIMEOUT_MS = 8000;
const MARKET_SIGNAL_REVALIDATE_SECONDS = 300;
const MARKET_SIGNAL_FETCH_PER_PAGE = 50;

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePotensi(
  value: string | null | undefined,
): MarketSignalPotensi {
  return normalizeText(value).toLowerCase() === "sell" ? "sell" : "buy";
}

function normalizeBooleanLike(
  value: boolean | string | number | null | undefined,
) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }

    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (["1", "true", "yes", "expired"].includes(normalizedValue)) {
    return true;
  }

  if (["0", "false", "no", "active", "open"].includes(normalizedValue)) {
    return false;
  }

  return null;
}

function resolveMarketSignalExpiredAt(item: RawMarketSignalRecord) {
  return (
    normalizeText(item.expired_at) ||
    normalizeText(item.expire_at) ||
    normalizeText(item.expiry_at) ||
    normalizeText(item.expires_at)
  );
}

function resolveMarketSignalExpiredStatus(
  item: RawMarketSignalRecord,
  expiredAt: string,
) {
  const directStatus =
    normalizeBooleanLike(item.expired) ??
    normalizeBooleanLike(item.expire) ??
    normalizeBooleanLike(item.is_expired) ??
    normalizeBooleanLike(item.expired_signal) ??
    normalizeBooleanLike(item.signal_expired) ??
    normalizeBooleanLike(item.status);

  if (directStatus !== null) {
    return directStatus;
  }

  if (!expiredAt) {
    return null;
  }

  const expiredTime = new Date(expiredAt).getTime();

  if (Number.isNaN(expiredTime)) {
    return null;
  }

  return expiredTime <= Date.now();
}

function slugifyCategoryName(categoryName: string) {
  return categoryName.trim().toLowerCase().replace(/\s+/g, "-");
}

function resolveMarketSignalImageUrl(item: RawMarketSignalRecord) {
  const imageUrlSource =
    normalizeText(item.image_url) || normalizeText(item.image);

  return imageUrlSource ? getMarketSignalAssetUrl(imageUrlSource) : "";
}

function mapMarketSignalRecord(
  item: RawMarketSignalRecord,
): MarketSignalRecord {
  const categoryName =
    normalizeText(item.category?.name) || normalizeText(item.kategori);
  const categorySlug =
    normalizeText(item.category?.slug) || slugifyCategoryName(categoryName);
  const entry =
    normalizeText(item.entry) ||
    normalizeText(item.entri) ||
    normalizeText(item.entry_price) ||
    normalizeText(item.entrypoint) ||
    normalizeText(item.entry_point) ||
    normalizeText(item.harga_entry) ||
    normalizeText(item.harga_masuk);
  const expiredAt = resolveMarketSignalExpiredAt(item);
  const isExpired = resolveMarketSignalExpiredStatus(item, expiredAt);

  return {
    id: item.id,
    categoryId: item.category?.id ?? item.category_id,
    categoryName,
    categorySlug,
    title: normalizeText(item.title),
    potensi: normalizePotensi(item.potensi),
    entry,
    isExpired,
    expiredAt,
    timeframe: normalizeText(item.timeframe),
    takingProfit: normalizeText(item.taking_profit),
    stopLoss: normalizeText(item.stop_loss),
    source: normalizeText(item.sumber) || normalizeText(item.source),
    imageUrl: resolveMarketSignalImageUrl(item),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function compareMarketSignalRecordsByRecency(
  left: MarketSignalRecord,
  right: MarketSignalRecord,
) {
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
}

function sortMarketSignalResultByRecency(
  result: MarketSignalResult,
): MarketSignalResult {
  return {
    items: result.items.slice().sort(compareMarketSignalRecordsByRecency),
    source: result.source,
  };
}

export async function getMarketSignalFeed(): Promise<MarketSignalResult> {
  if (USE_DUMMY_API_DATA) {
    return sortMarketSignalResultByRecency(getDummyMarketSignalFeed());
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    MARKET_SIGNAL_TIMEOUT_MS,
  );

  try {
    const url = new URL(MARKET_SIGNAL_API_URL);
    url.searchParams.set("per_page", String(MARKET_SIGNAL_FETCH_PER_PAGE));

    const requestHeaders = await getSgAdminApiHeaders();
    const requestOrigin = requestHeaders.get("Origin");

    if (requestOrigin && !requestHeaders.has("Referer")) {
      requestHeaders.set(
        "Referer",
        requestOrigin.endsWith("/") ? requestOrigin : `${requestOrigin}/`,
      );
    }

    const response = await fetch(url.toString(), {
      next: {
        revalidate: MARKET_SIGNAL_REVALIDATE_SECONDS,
      },
      signal: controller.signal,
      headers: requestHeaders,
    });

    if (!response.ok) {
      return { items: [], source: "empty" };
    }

    const payload = (await response.json()) as MarketSignalApiResponse;

    if (!payload?.data || !Array.isArray(payload.data)) {
      return { items: [], source: "empty" };
    }

    return sortMarketSignalResultByRecency({
      items: payload.data.map(mapMarketSignalRecord),
      source: "api",
    });
  } catch {
    return { items: [], source: "empty" };
  } finally {
    clearTimeout(timeout);
  }
}

export function pickOneMarketSignalPerCategory(
  items: MarketSignalRecord[],
): MarketSignalRecord[] {
  const seenCategories = new Set<string>();
  const picked: MarketSignalRecord[] = [];

  for (const item of items) {
    const categoryKey = item.categorySlug || item.categoryName;

    if (!categoryKey || seenCategories.has(categoryKey)) {
      continue;
    }

    seenCategories.add(categoryKey);
    picked.push(item);
  }

  return picked;
}

function normalizeCategoryOrderKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const MARKET_SIGNAL_CATEGORY_ORDER = [
  "Gold",
  "Silver",
  "Oil",
  "Hangseng",
  "Nikkei",
  "AUD/USD",
  "EUR/USD",
  "GBP/USD",
  "USD/CHF",
  "USD/JPY",
  "US30",
  "DXY",
].map(normalizeCategoryOrderKey);

function resolveMarketSignalCategoryOrderIndex(item: MarketSignalRecord) {
  const normalizedSlug = normalizeCategoryOrderKey(item.categorySlug);
  const normalizedName = normalizeCategoryOrderKey(item.categoryName);
  const index = MARKET_SIGNAL_CATEGORY_ORDER.findIndex(
    (key) => key === normalizedSlug || key === normalizedName,
  );

  return index === -1 ? MARKET_SIGNAL_CATEGORY_ORDER.length : index;
}

function sortMarketSignalsByCategoryOrder(
  items: MarketSignalRecord[],
): MarketSignalRecord[] {
  return items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((a, b) => {
      const orderDiff =
        resolveMarketSignalCategoryOrderIndex(a.item) -
        resolveMarketSignalCategoryOrderIndex(b.item);

      return orderDiff !== 0 ? orderDiff : a.originalIndex - b.originalIndex;
    })
    .map(({ item }) => item);
}

export async function getMarketSignalFeedByCategory(): Promise<MarketSignalResult> {
  const feed = await getMarketSignalFeed();

  return {
    items: sortMarketSignalsByCategoryOrder(
      pickOneMarketSignalPerCategory(feed.items),
    ),
    source: feed.source,
  };
}

export async function getLatestMarketSignalByCategory(
  categorySlug: string,
): Promise<MarketSignalRecord | null> {
  const feed = await getMarketSignalFeed();

  return (
    feed.items.find((item) => item.categorySlug === categorySlug) ?? null
  );
}

export async function getMarketSignalHistoryByCategory(
  categorySlug: string,
  excludeId: number,
  limit = 5,
): Promise<MarketSignalRecord[]> {
  const feed = await getMarketSignalFeed();

  return feed.items
    .filter(
      (item) => item.categorySlug === categorySlug && item.id !== excludeId,
    )
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    )
    .slice(0, limit);
}
