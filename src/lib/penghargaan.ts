import "server-only";

import {
  PENGHARGAAN_API_URL,
  USE_DUMMY_API_DATA,
  getPenghargaanAssetUrl,
} from "@/lib/env";
import { parseJsonResponse } from "@/lib/parse-json-response";

export type PenghargaanRecord = {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  image: string | null;
  imageUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type RawPenghargaanRecord = {
  id?: number;
  title?: string | null;
  subtitle?: string | null;
  slug?: string | null;
  image?: string | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type PenghargaanApiResponse = {
  data?: RawPenghargaanRecord[];
};

const PENGHARGAAN_REVALIDATE_SECONDS = 300;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

function normalizeRichText(value: unknown) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) {
    return "";
  }

  return stripHtml(normalizedValue).replace(/\s+/g, " ").trim();
}

function resolvePenghargaanImageUrl(item: RawPenghargaanRecord) {
  const imageUrl = normalizeText(item.image_url);
  const image = normalizeText(item.image);

  if (imageUrl) {
    if (
      imageUrl.startsWith("/api/image-proxy/") ||
      imageUrl.startsWith("/assets/") ||
      imageUrl.startsWith("data:image/")
    ) {
      return imageUrl;
    }

    return getPenghargaanAssetUrl(imageUrl);
  }

  return image ? getPenghargaanAssetUrl(image) : null;
}

function mapPenghargaanRecord(
  item: RawPenghargaanRecord,
): PenghargaanRecord | null {
  const title = normalizeText(item.title);

  if (!title) {
    return null;
  }

  return {
    id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : 0,
    title,
    subtitle: normalizeRichText(item.subtitle),
    slug: normalizeText(item.slug),
    image: normalizeText(item.image) || null,
    imageUrl: resolvePenghargaanImageUrl(item),
    createdAt: normalizeText(item.created_at) || null,
    updatedAt: normalizeText(item.updated_at) || null,
  };
}

export async function getPenghargaanRecords() {
  if (USE_DUMMY_API_DATA) {
    return [];
  }

  try {
    const response = await fetch(PENGHARGAAN_API_URL, {
      next: {
        revalidate: PENGHARGAAN_REVALIDATE_SECONDS,
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch penghargaan: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const responseBody = await response.text();
    const payload = parseJsonResponse<PenghargaanApiResponse>(responseBody);

    if (!payload?.data || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data
      .map(mapPenghargaanRecord)
      .filter((item): item is PenghargaanRecord => item !== null);
  } catch (error) {
    console.error("Failed to fetch penghargaan", error);
    return [];
  }
}
