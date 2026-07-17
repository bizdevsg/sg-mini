import "server-only";

import { cache } from "react";

import { getDummyProductCatalog } from "@/lib/api-dummy-data";
import { PRODUCT_API_URL, USE_DUMMY_API_DATA, getProductAssetUrl } from "@/lib/env";

export const PRODUCT_PAGE_CATEGORIES = ["multilateral", "bilateral"] as const;
const PRODUCT_CATALOG_REVALIDATE_SECONDS = 300;

export type ProductPageCategory = (typeof PRODUCT_PAGE_CATEGORIES)[number];

export type ProductCatalogItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  specsHtml: string;
  imageSrc: string | null;
  sourceCategory: string;
};

const PRODUCT_SOURCE_CATEGORY_MAP: Record<ProductPageCategory, string> = {
  multilateral: "JFX",
  bilateral: "SPA",
};

const PRODUCT_API_CATEGORY_PATH_MAP: Record<ProductPageCategory, string> = {
  multilateral: "jfx",
  bilateral: "spa",
};

type ProductApiRecord = {
  id: number;
  nama_produk: string;
  slug: string;
  deskripsi_produk: string | null;
  specs: string | null;
  image: string | null;
  image_url?: string | null;
  kategori: string;
  created_at: string;
  updated_at: string;
};

type ProductApiResponse = {
  status?: string;
  http?: number;
  data?: ProductApiRecord[];
};

type ProductDetailApiResponse = {
  status?: string;
  http?: number;
  data?: ProductApiRecord | null;
};

function getDummyCatalogForCategory(category: ProductPageCategory) {
  return getDummyProductCatalog(category);
}

function compareProducts(left: ProductApiRecord, right: ProductApiRecord) {
  const categoryDiff = left.kategori.localeCompare(right.kategori);

  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return left.id - right.id;
}

function getProductCategoryApiUrl(category: ProductPageCategory) {
  const baseUrl = PRODUCT_API_URL.replace(/\/+$/, "");
  const categoryPath = PRODUCT_API_CATEGORY_PATH_MAP[category];

  return `${baseUrl}/${categoryPath}`;
}

function resolveProductImageSrc(item: ProductApiRecord) {
  const imageUrl = item.image_url?.trim();

  if (imageUrl) {
    if (
      imageUrl.startsWith("/api/image-proxy/") ||
      imageUrl.startsWith("/assets/") ||
      imageUrl.startsWith("data:image/")
    ) {
      return imageUrl;
    }

    return getProductAssetUrl(imageUrl);
  }

  return item.image ? getProductAssetUrl(item.image) : null;
}

function mapProductApiRecord(item: ProductApiRecord): ProductCatalogItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.nama_produk,
    description: item.deskripsi_produk?.trim() || item.nama_produk,
    specsHtml: item.specs?.trim() || "",
    imageSrc: resolveProductImageSrc(item),
    sourceCategory: item.kategori,
  };
}

async function getProductApiRecords(category: ProductPageCategory) {
  const response = await fetch(getProductCategoryApiUrl(category), {
    next: {
      revalidate: PRODUCT_CATALOG_REVALIDATE_SECONDS,
    },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    console.warn(
      `Product API returned ${response.status} ${response.statusText}. Falling back to dummy product catalog.`,
    );

    return null;
  }

  const payload = (await response.json()) as ProductApiResponse;

  if (!payload?.data || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data.slice().sort(compareProducts);
}

async function getProductApiRecordBySlug(
  category: ProductPageCategory,
  slug: string,
) {
  const response = await fetch(
    `${getProductCategoryApiUrl(category)}/${encodeURIComponent(slug)}`,
    {
      next: {
        revalidate: PRODUCT_CATALOG_REVALIDATE_SECONDS,
      },
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as ProductDetailApiResponse;

  if (!payload?.data) {
    return null;
  }

  return payload.data;
}

export function isProductPageCategory(
  value: string,
): value is ProductPageCategory {
  return PRODUCT_PAGE_CATEGORIES.includes(value as ProductPageCategory);
}

export const getProductCatalog = cache(async function getProductCatalog(
  category: ProductPageCategory,
) {
  if (USE_DUMMY_API_DATA) {
    return getDummyCatalogForCategory(category);
  }

  try {
    const sourceCategory = PRODUCT_SOURCE_CATEGORY_MAP[category];
    const records = await getProductApiRecords(category);

    if (!records) {
      return getDummyCatalogForCategory(category);
    }

    return records
      .filter((item) => item.kategori === sourceCategory)
      .map(mapProductApiRecord);
  } catch (error) {
    console.warn(
      "Failed to fetch product catalog. Falling back to dummy data.",
      error,
    );
    return getDummyCatalogForCategory(category);
  }
});

export const getProductBySlug = cache(async function getProductBySlug(
  category: ProductPageCategory,
  slug: string,
) {
  if (USE_DUMMY_API_DATA) {
    const catalog = await getProductCatalog(category);
    return catalog.find((candidate) => candidate.slug === slug) ?? null;
  }

  try {
    const record = await getProductApiRecordBySlug(category, slug);

    if (!record) {
      const catalog = await getProductCatalog(category);
      const fallbackItem =
        catalog.find((candidate) => candidate.slug === slug) ?? null;
      return fallbackItem;
    }

    return mapProductApiRecord(record);
  } catch (error) {
    const catalog = await getProductCatalog(category);
    const fallbackItem =
      catalog.find((candidate) => candidate.slug === slug) ?? null;
    console.warn(
      `Failed to fetch product detail for slug "${slug}". Falling back to catalog item.`,
      error,
    );
    return fallbackItem;
  }
});
