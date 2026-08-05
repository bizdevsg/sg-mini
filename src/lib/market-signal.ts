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

  return {
    id: item.id,
    categoryId: item.category?.id ?? item.category_id,
    categoryName,
    categorySlug,
    title: normalizeText(item.title),
    potensi: normalizePotensi(item.potensi),
    timeframe: normalizeText(item.timeframe),
    takingProfit: normalizeText(item.taking_profit),
    stopLoss: normalizeText(item.stop_loss),
    source: normalizeText(item.sumber) || normalizeText(item.source),
    imageUrl: resolveMarketSignalImageUrl(item),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function getMarketSignalFeed(): Promise<MarketSignalResult> {
  if (USE_DUMMY_API_DATA) {
    return getDummyMarketSignalFeed();
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

    return {
      items: payload.data.map(mapMarketSignalRecord),
      source: "api",
    };
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
