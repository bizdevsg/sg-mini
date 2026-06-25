import "server-only";

import { LEGALITAS_API_URL, USE_DUMMY_API_DATA } from "@/lib/env";

export type LegalitasRecord = {
  id: number;
  title: string;
  nomor: string;
  description: string;
  slug: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type LegalitasApiRecord = {
  id?: number;
  title?: string | null;
  nomor?: string | null;
  description?: string | null;
  slug?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type LegalitasApiMeta = {
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
  from?: number | null;
  to?: number | null;
};

type LegalitasApiResponse = {
  data?: LegalitasApiRecord[];
  meta?: LegalitasApiMeta;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toLegalitasRecord(item: LegalitasApiRecord): LegalitasRecord | null {
  const title = normalizeText(item.title);
  const nomor = normalizeText(item.nomor);
  const description = normalizeText(item.description);

  if (!title || !description) {
    return null;
  }

  return {
    id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : 0,
    title,
    nomor,
    description,
    slug: normalizeText(item.slug),
    createdAt: normalizeText(item.created_at) || null,
    updatedAt: normalizeText(item.updated_at) || null,
  };
}

export async function getLegalitasRecords() {
  if (USE_DUMMY_API_DATA) {
    return [];
  }

  try {
    const response = await fetch(LEGALITAS_API_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch legalitas: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const payload = (await response.json()) as LegalitasApiResponse;

    if (!payload?.data || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data
      .map(toLegalitasRecord)
      .filter((item): item is LegalitasRecord => item !== null);
  } catch (error) {
    console.error("Failed to fetch legalitas", error);
    return [];
  }
}
