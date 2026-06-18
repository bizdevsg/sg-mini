import "server-only";

import { unstable_cache } from "next/cache";

import { PRODUCT_API_URL } from "@/lib/env";

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

function compareProducts(left: ProductApiRecord, right: ProductApiRecord) {
  const categoryDiff = left.kategori.localeCompare(right.kategori);

  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return left.id - right.id;
}

const getCachedProductApiRecords = unstable_cache(
  async () => {
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

    return payload.data.slice().sort(compareProducts);
  },
  ["product-api-records"],
  {
    revalidate: 1800,
  },
);

export async function getProductApiRecords() {
  return getCachedProductApiRecords();
}
