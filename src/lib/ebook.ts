import "server-only";

import {
  EBOOK_REVALIDATE_SECONDS,
  type EbookCategory,
  type EbookCategoryDetail,
  type EbookResource,
} from "@/lib/ebook.shared";
import { EBOOK_CATEGORY_API_URL, PRODUCT_PORTAL_BASE_URL, USE_DUMMY_API_DATA } from "@/lib/env";

type EbookCategoryApiRecord = {
  id?: number;
  name?: string | null;
  slug?: string | null;
  ebooks_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type EbookCategoryApiResponse = {
  data?: EbookCategoryApiRecord[];
};

type EbookResourceApiRecord = {
  id?: number;
  title?: string | null;
  kategori?: string | null;
  category?: {
    id?: number;
    name?: string | null;
    slug?: string | null;
  } | null;
  slug?: string | null;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  file?: string | null;
  file_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type EbookCategoryDetailApiResponse = {
  data?: EbookResourceApiRecord[];
  category?: EbookCategoryApiRecord;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function summarizeDescription(value: unknown) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return "";
  }

  const firstParagraph =
    normalizedValue
      .split(/\n\s*\n/)
      .map((entry) => entry.trim())
      .find(Boolean) ?? normalizedValue;

  if (firstParagraph.length <= 220) {
    return firstParagraph;
  }

  return `${firstParagraph.slice(0, 217).trimEnd()}...`;
}

function isAbsoluteHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function resolveStorageAssetUrl(value: unknown) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  if (isAbsoluteHttpUrl(normalizedValue)) {
    return normalizedValue;
  }

  const normalizedBaseUrl = PRODUCT_PORTAL_BASE_URL.replace(/\/+$/, "");

  if (normalizedValue.startsWith("/")) {
    return `${normalizedBaseUrl}${normalizedValue}`;
  }

  const normalizedStoragePath = normalizedValue.replace(/^storage\/+/, "");
  return `${normalizedBaseUrl}/storage/${normalizedStoragePath}`;
}

function toEbookCategory(item: EbookCategoryApiRecord): EbookCategory | null {
  const name = normalizeText(item.name);
  const slug = normalizeText(item.slug);

  if (!name || !slug) {
    return null;
  }

  return {
    id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : 0,
    name,
    slug,
    ebooksCount:
      typeof item.ebooks_count === "number" && Number.isFinite(item.ebooks_count)
        ? item.ebooks_count
        : 0,
    createdAt: normalizeText(item.created_at) || null,
    updatedAt: normalizeText(item.updated_at) || null,
  };
}

function toEbookResource(item: EbookResourceApiRecord): EbookResource | null {
  const title = normalizeText(item.title);
  const slug = normalizeText(item.slug);
  const categoryName =
    normalizeText(item.category?.name) || normalizeText(item.kategori);
  const categorySlug = normalizeText(item.category?.slug);

  if (!title || !slug || !categoryName) {
    return null;
  }

  return {
    id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : 0,
    title,
    slug,
    excerpt: summarizeDescription(item.description),
    description: normalizeText(item.description),
    categoryName,
    categorySlug,
    imageSrc:
      resolveStorageAssetUrl(item.image_url) ??
      resolveStorageAssetUrl(item.image),
    fileUrl:
      resolveStorageAssetUrl(item.file_url) ??
      resolveStorageAssetUrl(item.file),
    createdAt: normalizeText(item.created_at) || null,
    updatedAt: normalizeText(item.updated_at) || null,
  };
}

function compareCategories(left: EbookCategory, right: EbookCategory) {
  return left.name.localeCompare(right.name);
}

function compareEbookResources(left: EbookResource, right: EbookResource) {
  const leftTimestamp = left.createdAt ? new Date(left.createdAt).getTime() : 0;
  const rightTimestamp = right.createdAt ? new Date(right.createdAt).getTime() : 0;

  if (leftTimestamp !== rightTimestamp) {
    return rightTimestamp - leftTimestamp;
  }

  return left.title.localeCompare(right.title);
}

function getEbookCategoryApiDetailUrl(slug: string) {
  const normalizedBaseUrl = EBOOK_CATEGORY_API_URL.replace(/\/+$/, "");
  return `${normalizedBaseUrl}/${encodeURIComponent(slug)}`;
}

export async function getEbookCategories() {
  if (USE_DUMMY_API_DATA) {
    return [];
  }

  try {
    const response = await fetch(EBOOK_CATEGORY_API_URL, {
      next: {
        revalidate: EBOOK_REVALIDATE_SECONDS,
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        `Ebook category API returned ${response.status} ${response.statusText}.`,
      );
      return [];
    }

    const payload = (await response.json()) as EbookCategoryApiResponse;

    if (!payload?.data || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data
      .map(toEbookCategory)
      .filter((item): item is EbookCategory => item !== null)
      .sort(compareCategories);
  } catch (error) {
    console.warn("Failed to fetch ebook categories.", error);
    return [];
  }
}

export async function getEbookCategoryDetail(
  slug: string,
): Promise<EbookCategoryDetail | null> {
  if (USE_DUMMY_API_DATA) {
    return null;
  }

  try {
    const response = await fetch(getEbookCategoryApiDetailUrl(slug), {
      next: {
        revalidate: EBOOK_REVALIDATE_SECONDS,
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status !== 404) {
        console.warn(
          `Ebook category detail API returned ${response.status} ${response.statusText}.`,
        );
      }
      return null;
    }

    const payload = (await response.json()) as EbookCategoryDetailApiResponse;
    const items = Array.isArray(payload?.data)
      ? payload.data
          .map(toEbookResource)
          .filter((item): item is EbookResource => item !== null)
          .sort(compareEbookResources)
      : [];
    const category =
      (payload?.category ? toEbookCategory(payload.category) : null) ??
      (items.length > 0
        ? {
            id: items[0].id,
            name: items[0].categoryName,
            slug: items[0].categorySlug || slug,
            ebooksCount: items.length,
            createdAt: items[0].createdAt,
            updatedAt: items[0].updatedAt,
          }
        : null);

    if (!category) {
      return null;
    }

    return {
      category: {
        ...category,
        ebooksCount: category.ebooksCount || items.length,
      },
      items,
    };
  } catch (error) {
    console.warn("Failed to fetch ebook category detail.", error);
    return null;
  }
}
