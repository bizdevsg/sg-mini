import { PRODUCT_API_URL, getProductAssetUrl } from "@/lib/env";

export const PRODUCT_PAGE_CATEGORIES = ["multilateral", "bilateral"] as const;

export type ProductPageCategory = (typeof PRODUCT_PAGE_CATEGORIES)[number];

export type ProductApiRecord = {
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

export function isProductPageCategory(
  value: string,
): value is ProductPageCategory {
  return PRODUCT_PAGE_CATEGORIES.includes(value as ProductPageCategory);
}

function compareProducts(left: ProductApiRecord, right: ProductApiRecord) {
  const categoryDiff = left.kategori.localeCompare(right.kategori);

  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return left.id - right.id;
}

export async function getProductCatalog(category: ProductPageCategory) {
  try {
    const response = await fetch(PRODUCT_API_URL, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 1800,
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

    const sourceCategory = PRODUCT_SOURCE_CATEGORY_MAP[category];

    return payload.data
      .slice()
      .sort(compareProducts)
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
