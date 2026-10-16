import "server-only";

import { cache } from "react";

import { PRODUCT_API_URL, getProductAssetUrl } from "@/lib/env";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";

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
  deskripsi_produk_id?: string | null;
  deskripsi_produk_en?: string | null;
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

export type PrimeProductItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  specsHtml: string;
  imageSrc: string | null;
  sourceCategory: string;
};

export type PrimeProductFallback = Omit<
  PrimeProductItem,
  "id" | "imageSrc" | "specsHtml"
>;

export type PrimeProductCatalogResult = {
  data: PrimeProductItem[];
  source: "api" | "fallback";
};

export type PrimeProductDetailResult = {
  data: PrimeProductItem | null;
  source: "api" | "fallback";
};

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

function appendInlineStyle(tag: string, styles: string) {
  const stylePattern = /\sstyle\s*=\s*(['"])([\s\S]*?)\1/i;

  if (stylePattern.test(tag)) {
    return tag.replace(stylePattern, (_match, quote: string, value: string) => {
      const currentStyles = value.trim().replace(/;?$/, ";");
      return ` style=${quote}${currentStyles} ${styles}${quote}`;
    });
  }

  return tag.replace(/>$/, ` style="${styles}">`);
}

function compactEmptyProductSpecRows(content: string) {
  return content.replace(
    /<tr\b[^>]*>\s*(?:<td\b[^>]*>\s*(?:&nbsp;|\u00a0)?\s*<\/td>\s*)+<\/tr>/gi,
    (row) =>
      row
        .replace(/<tr\b[^>]*>/i, (tag) =>
          appendInlineStyle(tag, "height: 10px !important;"),
        )
        .replace(/<td\b[^>]*>/gi, (tag) =>
          appendInlineStyle(
            tag,
            "height: 10px !important; padding: 0 !important; line-height: 0 !important;",
          ),
        ),
  );
}

function sanitizeProductSpecsHtml(content: string | null) {
  if (!content) {
    return "";
  }

  const safeContent = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/<table\b[^>]*>/gi, (tag) =>
      tag.replace(/height\s*:\s*[^;"']+;?/gi, ""),
    );

  return compactEmptyProductSpecRows(safeContent);
}

function mapProductApiRecord(item: ProductApiRecord): ProductCatalogItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.nama_produk,
    description: item.deskripsi_produk?.trim() || item.nama_produk,
    specsHtml: sanitizeProductSpecsHtml(item.specs),
    imageSrc: resolveProductImageSrc(item),
    sourceCategory: item.kategori,
  };
}

function mapPrimeProductApiRecord(
  item: ProductApiRecord,
  locale: "id" | "en",
): PrimeProductItem {
  const localizedDescription =
    locale === "en" ? item.deskripsi_produk_en : item.deskripsi_produk_id;

  return {
    id: item.id,
    slug: item.slug,
    name: item.nama_produk,
    description:
      localizedDescription?.trim() ||
      item.deskripsi_produk?.trim() ||
      item.nama_produk,
    specsHtml: sanitizeProductSpecsHtml(item.specs),
    imageSrc: resolveProductImageSrc(item),
    sourceCategory: item.kategori,
  };
}

function getPrimeProductApiUrl() {
  return `${PRODUCT_API_URL.replace(/\/+$/, "")}/prime`;
}

function getPrimeProductDetailApiUrl(slug: string) {
  return `${getPrimeProductApiUrl()}/${encodeURIComponent(slug)}`;
}

export async function getPrimeProductCatalog(
  locale: "id" | "en",
  fallback: PrimeProductFallback,
): Promise<PrimeProductCatalogResult> {
  const fallbackResult: PrimeProductCatalogResult = {
    data: [{ id: 0, imageSrc: null, specsHtml: "", ...fallback }],
    source: "fallback",
  };

  try {
    const response = await fetch(getPrimeProductApiUrl(), {
      next: {
        revalidate: PRODUCT_CATALOG_REVALIDATE_SECONDS,
      },
      headers: await getSgAdminApiHeaders(),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.warn(
        `Prime product API returned ${response.status} ${response.statusText}.`,
      );
      return fallbackResult;
    }

    const payload = (await response.json()) as ProductApiResponse;
    const records = Array.isArray(payload?.data)
      ? payload.data.filter((item) => item.kategori === "PRIME")
      : [];

    if (!records.length) {
      return fallbackResult;
    }

    return {
      data: records.map((item) => mapPrimeProductApiRecord(item, locale)),
      source: "api",
    };
  } catch (error) {
    console.warn("Failed to fetch Prime product catalog.", error);
    return fallbackResult;
  }
}

export const getPrimeProductBySlug = cache(async function getPrimeProductBySlug(
  locale: "id" | "en",
  slug: string,
  fallback: PrimeProductFallback,
): Promise<PrimeProductDetailResult> {
  async function getFallbackResult(): Promise<PrimeProductDetailResult> {
    const catalog = await getPrimeProductCatalog(locale, fallback);

    return {
      data: catalog.data.find((product) => product.slug === slug) ?? null,
      source: "fallback",
    };
  }

  try {
    const response = await fetch(getPrimeProductDetailApiUrl(slug), {
      next: {
        revalidate: PRODUCT_CATALOG_REVALIDATE_SECONDS,
      },
      headers: await getSgAdminApiHeaders(),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.warn(
        `Prime product detail API returned ${response.status} ${response.statusText}.`,
      );
      return getFallbackResult();
    }

    const payload = (await response.json()) as ProductDetailApiResponse;
    const record = payload?.data;

    if (!record || record.kategori !== "PRIME" || record.slug !== slug) {
      return getFallbackResult();
    }

    return {
      data: mapPrimeProductApiRecord(record, locale),
      source: "api",
    };
  } catch (error) {
    console.warn(
      `Failed to fetch Prime product detail for slug "${slug}".`,
      error,
    );
    return getFallbackResult();
  }
});

async function getProductApiRecords(category: ProductPageCategory) {
  const response = await fetch(getProductCategoryApiUrl(category), {
    next: {
      revalidate: PRODUCT_CATALOG_REVALIDATE_SECONDS,
    },
    headers: await getSgAdminApiHeaders(),
  });

  if (!response.ok) {
    console.warn(
      `Product API returned ${response.status} ${response.statusText}.`,
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
      headers: await getSgAdminApiHeaders(),
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
  try {
    const sourceCategory = PRODUCT_SOURCE_CATEGORY_MAP[category];
    const records = await getProductApiRecords(category);

    if (!records) {
      return [];
    }

    return records
      .filter((item) => item.kategori === sourceCategory)
      .map(mapProductApiRecord);
  } catch (error) {
    console.warn(
      "Failed to fetch product catalog.",
      error,
    );
    return [];
  }
});

export const getProductBySlug = cache(async function getProductBySlug(
  category: ProductPageCategory,
  slug: string,
) {
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
