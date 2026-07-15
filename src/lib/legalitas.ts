import "server-only";

import { LEGALITAS_API_URL, USE_DUMMY_API_DATA } from "@/lib/env";
import type { AppLocale } from "@/locales";

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

const FALLBACK_LEGALITAS_BY_LOCALE: Record<AppLocale, LegalitasRecord[]> = {
  id: [
    {
      id: 1,
      title: "Akta Pendirian Perseroan Terbatas",
      nomor: "52",
      description:
        "Tanggal 18 Januari 2002 oleh Notaris Soehendro Gautama, SH, PT. Solid Gold Berjangka",
      slug: "akta-pendirian-perseroan-terbatas",
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 2,
      title: "Pengesahan Departemen Kehakiman dan HAM",
      nomor: "C-05612 HT.01.01.TH.2002",
      description: "Pengesahan resmi dari Kementerian Hukum dan HAM",
      slug: "pengesahan-departemen-kehakiman-dan-ham",
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 3,
      title: "Surat Persetujuan Anggota Bursa (SPAB)",
      nomor: "SPAB-047/BBJ/07/02",
      description: "Persetujuan keanggotaan bursa berjangka",
      slug: "surat-persetujuan-anggota-bursa-spab",
      createdAt: null,
      updatedAt: null,
    },
  ],
  en: [
    {
      id: 1,
      title: "Limited Liability Company Deed of Establishment",
      nomor: "52",
      description:
        "Dated January 18, 2002 by Notary Soehendro Gautama, SH, PT. Solid Gold Berjangka",
      slug: "limited-liability-company-deed-of-establishment",
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 2,
      title: "Approval from the Ministry of Justice and Human Rights",
      nomor: "C-05612 HT.01.01.TH.2002",
      description: "Official approval from the Ministry of Law and Human Rights",
      slug: "approval-ministry-of-justice-and-human-rights",
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 3,
      title: "Exchange Membership Approval Letter (SPAB)",
      nomor: "SPAB-047/BBJ/07/02",
      description: "Approval for futures exchange membership",
      slug: "exchange-membership-approval-letter-spab",
      createdAt: null,
      updatedAt: null,
    },
  ],
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

export async function getLegalitasRecords(locale: AppLocale = "id") {
  if (USE_DUMMY_API_DATA) {
    return FALLBACK_LEGALITAS_BY_LOCALE[locale];
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
