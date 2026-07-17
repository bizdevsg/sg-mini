import "server-only";

import { getDummyPengumuman } from "@/lib/api-dummy-data";
import {
  PENGUMUMAN_API_URL,
  USE_DUMMY_API_DATA,
  getPengumumanAssetUrl,
  isSgAdminUrl,
  normalizeSgAdminUrl,
} from "@/lib/env";

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
const PENGUMUMAN_REVALIDATE_SECONDS = 300;

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function resolvePengumumanHtmlUrl(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  if (/^(mailto:|tel:|#)/i.test(normalizedValue)) {
    return normalizedValue;
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    const normalizedAbsoluteUrl = normalizeSgAdminUrl(normalizedValue);

    return isSgAdminUrl(normalizedAbsoluteUrl)
      ? getPengumumanAssetUrl(normalizedAbsoluteUrl)
      : normalizedAbsoluteUrl;
  }

  if (normalizedValue.startsWith("/")) {
    return getPengumumanAssetUrl(normalizedValue);
  }

  return getPengumumanAssetUrl(`/${normalizedValue.replace(/^\/+/, "")}`);
}

function sanitizePengumumanHtml(content: string | null | undefined) {
  if (!content) {
    return "";
  }

  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+(src|href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/\s+data-mce-[a-z-]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+contenteditable\s*=\s*(['"]).*?\1/gi, "")
    .replace(/<a\b([^>]*)\bhref=(['"])(.*?)\2([^>]*)>/gi, (_match, before, quote, href, after) => {
      const resolvedHref = resolvePengumumanHtmlUrl(href);
      const target = /target\s*=/i.test(`${before} ${after}`)
        ? ""
        : ' target="_blank"';
      const rel = /rel\s*=/i.test(`${before} ${after}`)
        ? ""
        : ' rel="noopener noreferrer"';

      return `<a${before}href=${quote}${resolvedHref || href}${quote}${after}${target}${rel}>`;
    })
    .replace(/<(img|source)\b([^>]*)\bsrc=(['"])(.*?)\3([^>]*)>/gi, (_match, tagName, before, quote, src, after) => {
      const resolvedSrc = resolvePengumumanHtmlUrl(src);
      return `<${tagName}${before}src=${quote}${resolvedSrc || src}${quote}${after}>`;
    })
    .replace(/<img\b(?![^>]*\bloading=)([^>]*)>/gi, '<img loading="lazy"$1>')
    .replace(/<table\b([^>]*)>/gi, '<div class="pengumuman-table-wrap"><table$1>')
    .replace(/<\/table>/gi, "</table></div>");
}

function mapPengumumanRecord(item: RawPengumumanRecord): PengumumanRecord {
  const imagePath = item.image_url?.trim() || item.image?.trim() || null;
  const judul = normalizeWhitespace(item.judul ?? item.title ?? "");

  return {
    id: item.id,
    judul,
    konten: sanitizePengumumanHtml(item.konten ?? item.content ?? null),
    image: item.image,
    image_url: imagePath ? getPengumumanAssetUrl(imagePath) : null,
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
      next: {
        revalidate: PENGUMUMAN_REVALIDATE_SECONDS,
      },
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
