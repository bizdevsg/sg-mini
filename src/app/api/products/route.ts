import { NextRequest, NextResponse } from "next/server";

import {
  getProductCatalog,
  isProductPageCategory,
  PRODUCT_PAGE_CATEGORIES,
} from "@/lib/products";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  if (category && isProductPageCategory(category)) {
    const items = await getProductCatalog(category);
    return NextResponse.json({
      category,
      items,
    });
  }

  const entries = await Promise.all(
    PRODUCT_PAGE_CATEGORIES.map(async (entry) => ({
      category: entry,
      items: await getProductCatalog(entry),
    })),
  );

  return NextResponse.json({
    categories: entries,
  });
}
