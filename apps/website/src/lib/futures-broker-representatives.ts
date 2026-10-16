import "server-only";

import { FUTURES_BROKER_REPRESENTATIVES_API_URL } from "@/lib/env";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";
import type { AppLocale } from "@/locales";

export type FuturesBrokerRepresentative = {
  id: number;
  slug: string;
  name: string;
  licenseNumber: string | null;
  status: string;
  statusLabel: string;
  categoryName: string | null;
  officeAddress: string | null;
  phone: string | null;
  mapsUrl: string | null;
};

export type FuturesBrokerRepresentativesResult = {
  data: FuturesBrokerRepresentative[];
  source: "api" | "fallback";
};

type RepresentativeApiRecord = {
  id?: number;
  slug?: string | null;
  nama?: string | null;
  no_identitas?: string | null;
  status?: string | null;
  status_label?: string | null;
  category?: {
    nama_kategori?: string | null;
    alamat_kantor_cabang?: string | null;
    telp?: string | null;
    link_google_maps?: string | null;
  } | null;
};

type RepresentativeApiResponse = {
  data?: RepresentativeApiRecord[];
  meta?: {
    last_page?: number;
  };
};

const REVALIDATE_SECONDS = 300;
const MAX_PAGES = 50;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeExternalUrl(value: unknown) {
  const text = normalizeText(value);

  if (!text) {
    return null;
  }

  try {
    const url = new URL(text);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function mapApiRecord(
  item: RepresentativeApiRecord,
  locale: AppLocale,
): FuturesBrokerRepresentative | null {
  const name = normalizeText(item.nama);
  const status = normalizeText(item.status);

  if (!name) {
    return null;
  }

  return {
    id: typeof item.id === "number" && Number.isFinite(item.id) ? item.id : 0,
    slug: normalizeText(item.slug),
    name,
    licenseNumber: normalizeText(item.no_identitas) || null,
    status,
    statusLabel:
      locale === "en" && status.toLowerCase() === "aktif"
        ? "Active"
        : normalizeText(item.status_label) || status,
    categoryName: normalizeText(item.category?.nama_kategori) || null,
    officeAddress: normalizeText(item.category?.alamat_kantor_cabang) || null,
    phone: normalizeText(item.category?.telp) || null,
    mapsUrl: normalizeExternalUrl(item.category?.link_google_maps),
  };
}

function createFallbackRecords(
  locale: AppLocale,
  names: string[],
): FuturesBrokerRepresentative[] {
  return names.map((name, index) => ({
    id: -(index + 1),
    slug: "",
    name,
    licenseNumber: null,
    status: "aktif",
    statusLabel: locale === "en" ? "Active" : "Aktif",
    categoryName: null,
    officeAddress: null,
    phone: null,
    mapsUrl: null,
  }));
}

function getPageUrl(page: number) {
  const url = new URL(FUTURES_BROKER_REPRESENTATIVES_API_URL);
  url.searchParams.set("page", String(page));
  return url.toString();
}

async function fetchPage(page: number, headers: Headers) {
  const response = await fetch(getPageUrl(page), {
    headers,
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(
      `Representative API returned ${response.status} ${response.statusText}.`,
    );
  }

  return (await response.json()) as RepresentativeApiResponse;
}

export async function getFuturesBrokerRepresentatives(
  locale: AppLocale,
  fallbackNames: string[],
): Promise<FuturesBrokerRepresentativesResult> {
  const fallbackResult: FuturesBrokerRepresentativesResult = {
    data: createFallbackRecords(locale, fallbackNames),
    source: "fallback",
  };

  try {
    const headers = await getSgAdminApiHeaders();
    const firstPage = await fetchPage(1, headers);
    const lastPage = Math.min(
      Math.max(Math.trunc(firstPage.meta?.last_page ?? 1), 1),
      MAX_PAGES,
    );
    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) =>
        fetchPage(index + 2, headers),
      ),
    );
    const records = [firstPage, ...remainingPages]
      .flatMap((payload) => (Array.isArray(payload.data) ? payload.data : []))
      .map((item) => mapApiRecord(item, locale))
      .filter(
        (item): item is FuturesBrokerRepresentative => item !== null,
      );

    if (!records.length) {
      return fallbackResult;
    }

    return {
      data: records,
      source: "api",
    };
  } catch (error) {
    console.warn("Failed to fetch futures broker representatives.", error);
    return fallbackResult;
  }
}
