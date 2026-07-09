import { NextRequest, NextResponse } from "next/server";

import {
  protectInternalApiRoute,
  withApiProtectionHeaders,
} from "@/lib/api-protection";
import {
  getProductCatalog,
  isProductPageCategory,
  PRODUCT_PAGE_CATEGORIES,
} from "@/lib/products";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const blockedResponse = protectInternalApiRoute(request);

  if (blockedResponse) {
    return blockedResponse;
  }

  const category = request.nextUrl.searchParams.get("category");

  if (category && isProductPageCategory(category)) {
    const items = await getProductCatalog(category);
    return withApiProtectionHeaders(
      NextResponse.json({
        category,
        items,
      }),
      {
        cacheControl: "private, no-store, max-age=0",
      },
    );
  }

  const entries = await Promise.all(
    PRODUCT_PAGE_CATEGORIES.map(async (entry) => ({
      category: entry,
      items: await getProductCatalog(entry),
    })),
  );

  return withApiProtectionHeaders(
    NextResponse.json({
      categories: entries,
    }),
    {
      cacheControl: "private, no-store, max-age=0",
    },
  );
}
