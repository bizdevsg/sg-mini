import "server-only";

import { PRODUCT_API_URL, getProductAssetUrl } from "@/lib/env";

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

type ProductApiRecord = {
  id: number;
  nama_produk: string;
  slug: string;
  deskripsi_produk: string | null;
  specs: string | null;
  image: string | null;
  kategori: string;
  created_at: string;
  updated_at: string;
};

type ProductApiResponse = {
  status?: string;
  http?: number;
  data?: ProductApiRecord[];
};

function compareProducts(left: ProductApiRecord, right: ProductApiRecord) {
  const categoryDiff = left.kategori.localeCompare(right.kategori);

  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return left.id - right.id;
}

async function getProductApiRecords() {
  const response = await fetch(PRODUCT_API_URL, {
    next: {
      revalidate: PRODUCT_CATALOG_REVALIDATE_SECONDS,
    },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as ProductApiResponse;

  if (!payload?.data || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data.slice().sort(compareProducts);
}

export function isProductPageCategory(
  value: string,
): value is ProductPageCategory {
  return PRODUCT_PAGE_CATEGORIES.includes(value as ProductPageCategory);
}

export async function getProductCatalog(category: ProductPageCategory) {
  try {
    const sourceCategory = PRODUCT_SOURCE_CATEGORY_MAP[category];
    const records = await getProductApiRecords();

    return records
      .filter((item) => item.kategori === sourceCategory)
      .map<ProductCatalogItem>((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.nama_produk,
        description: item.deskripsi_produk?.trim() || item.nama_produk,
        specsHtml: item.specs?.trim() || "",
        imageSrc: item.image ? getProductAssetUrl(item.image) : null,
        sourceCategory: item.kategori,
      }));
  } catch (error) {
    console.error("Failed to fetch product catalog", error);
    return [];
  }
}
