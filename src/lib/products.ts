import { getProductApiRecords } from "@/app/api/_data/products";
import { getProductAssetUrl } from "@/lib/env";

export const PRODUCT_PAGE_CATEGORIES = ["multilateral", "bilateral"] as const;

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
