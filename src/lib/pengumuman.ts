import "server-only";

import { getDummyPengumuman } from "@/lib/api-dummy-data";
import { PENGUMUMAN_API_URL, USE_DUMMY_API_DATA } from "@/lib/env";

export type PengumumanRecord = {
  id: number;
  judul: string;
  konten: string | null;
  image: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

type RawPengumumanRecord = {
  id: number;
  judul?: string | null;
  title?: string | null;
  konten?: string | null;
  content?: string | null;
  image: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

type PengumumanMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
};

type PengumumanApiResponse = {
  data?: RawPengumumanRecord[];
  meta?: PengumumanMeta;
};

export type PengumumanResult = {
  items: PengumumanRecord[];
  meta: PengumumanMeta | null;
  source: "api" | "empty";
};

const PENGUMUMAN_TIMEOUT_MS = 8000;

function mapPengumumanRecord(item: RawPengumumanRecord): PengumumanRecord {
  return {
    id: item.id,
    judul: item.judul ?? item.title ?? "",
    konten: item.konten ?? item.content ?? null,
    image: item.image,
    image_url: item.image_url,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export async function getPengumuman(page = 1): Promise<PengumumanResult> {
  if (USE_DUMMY_API_DATA) {
    return getDummyPengumuman(page);
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    PENGUMUMAN_TIMEOUT_MS,
  );

  try {
    const url = new URL(PENGUMUMAN_API_URL);
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString(), {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return { items: [], meta: null, source: "empty" };
    }

    const payload = (await response.json()) as PengumumanApiResponse;

    if (!payload?.data || !Array.isArray(payload.data)) {
      return { items: [], meta: null, source: "empty" };
    }

    return {
      items: payload.data.map(mapPengumumanRecord),
      meta: payload.meta ?? null,
      source: "api",
    };
  } catch {
    return { items: [], meta: null, source: "empty" };
  } finally {
    clearTimeout(timeout);
  }
}
