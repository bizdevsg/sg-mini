import "server-only";

import {
  PENGHARGAAN_API_URL,
  USE_DUMMY_API_DATA,
  getPenghargaanAssetUrl,
} from "@/lib/env";

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

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
    subtitle: normalizeText(item.subtitle),
    slug: normalizeText(item.slug),
    image: normalizeText(item.image) || null,
    imageUrl: normalizeText(item.image)
      ? getPenghargaanAssetUrl(normalizeText(item.image))
      : normalizeText(item.image_url)
        ? getPenghargaanAssetUrl(normalizeText(item.image_url))
        : null,
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
      cache: "no-store",
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

    const payload = (await response.json()) as PenghargaanApiResponse;

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
