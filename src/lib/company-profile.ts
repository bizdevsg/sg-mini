import "server-only";

import { COMPANY_PROFILE_API_URL, USE_DUMMY_API_DATA } from "@/lib/env";

export type CompanyProfile = {
  id: number;
  companyName: string;
  description: string;
  descriptionParagraphs: string[];
  mission: string[];
  vision: string[];
  address: string;
  mapsEmbedUrl: string;
  phone: string;
  email: string;
  fax: string;
  complaintLink: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type CompanyProfileApiRecord = {
  id?: number;
  company_name?: string | null;
  description?: string | null;
  mission?: unknown;
  vision?: unknown;
  address?: string | null;
  maps_embed_url?: string | null;
  phone?: string | null;
  email?: string | null;
  fax?: string | null;
  complaint_link?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type CompanyProfileApiResponse = {
  data?: CompanyProfileApiRecord | null;
};

const FALLBACK_COMPANY_PROFILE: CompanyProfile = {
  id: 1,
  companyName: "PT. Solid Gold Berjangka",
  description:
    "Berdiri sejak tahun 2002, PT Solid Gold Berjangka (SGB) merupakan perusahaan pialang berjangka yang terdaftar dan diawasi oleh BAPPEBTI. Dengan pengalaman lebih dari dua dekade, SGB menjadi salah satu pelaku utama dalam industri Perdagangan Berjangka Komoditi di Indonesia.\n\nSGB merupakan anggota Bursa Berjangka Jakarta (BBJ) dan Kliring Berjangka Indonesia (Persero), serta terus memperluas layanan melalui kantor operasional di Jakarta, Semarang, dan Makassar.",
  descriptionParagraphs: [
    "Berdiri sejak tahun 2002, PT Solid Gold Berjangka (SGB) merupakan perusahaan pialang berjangka yang terdaftar dan diawasi oleh BAPPEBTI. Dengan pengalaman lebih dari dua dekade, SGB menjadi salah satu pelaku utama dalam industri Perdagangan Berjangka Komoditi di Indonesia.",
    "SGB merupakan anggota Bursa Berjangka Jakarta (BBJ) dan Kliring Berjangka Indonesia (Persero), serta terus memperluas layanan melalui kantor operasional di Jakarta, Semarang, dan Makassar.",
  ],
  mission: [
    "Menjadi sebuah perusahaan pialang berjangka yang memiliki skala internasional",
    "Menjadi market leader, baik itu secara regional ataupun internasional",
  ],
  vision: [
    "Mengembangkan dan memajukan Perdagangan Berjangka di Indonesia sehingga dapat memberikan dampak positif kepada perekonomian Nasional baik dari segi mikro dan makro",
    "Memberdayakan Perdagangan Berjangka di Indonesia dan membantu semua pihak yang membutuhkannya untuk dapat mempergunakannya sebagai sarana lindung nilai (Hedging)",
  ],
  address:
    "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=TCC%20Batavia%20Tower%20One%20Lt.%2010%20Jl.%20K.H.%20Mas%20Mansyur%20Kav.%20126%20Jakarta%20Pusat%2010220&z=15&output=embed",
  phone: "021-29675088",
  email: "berjangka@solidgold.co.id",
  fax: "021-29675089",
  complaintLink: "https://pengaduan.bappebti.go.id/",
  createdAt: null,
  updatedAt: null,
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTextList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter((item) => item.length > 0);
}

function splitDescriptionParagraphs(description: string) {
  const paragraphs = description
    .split(/\r?\n\s*\r?\n/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return paragraphs.length > 0
    ? paragraphs
    : FALLBACK_COMPANY_PROFILE.descriptionParagraphs;
}

function normalizeCompanyProfile(
  record: CompanyProfileApiRecord | null | undefined,
): CompanyProfile {
  const companyName =
    normalizeText(record?.company_name) || FALLBACK_COMPANY_PROFILE.companyName;
  const description =
    normalizeText(record?.description) || FALLBACK_COMPANY_PROFILE.description;
  const mission = normalizeTextList(record?.mission);
  const vision = normalizeTextList(record?.vision);
  const address =
    normalizeText(record?.address) || FALLBACK_COMPANY_PROFILE.address;
  const mapsEmbedUrl =
    normalizeText(record?.maps_embed_url) ||
    FALLBACK_COMPANY_PROFILE.mapsEmbedUrl;
  const phone = normalizeText(record?.phone) || FALLBACK_COMPANY_PROFILE.phone;
  const email = normalizeText(record?.email) || FALLBACK_COMPANY_PROFILE.email;
  const fax = normalizeText(record?.fax) || FALLBACK_COMPANY_PROFILE.fax;
  const complaintLink =
    normalizeText(record?.complaint_link) ||
    FALLBACK_COMPANY_PROFILE.complaintLink;

  return {
    id:
      typeof record?.id === "number" && Number.isFinite(record.id)
        ? record.id
        : FALLBACK_COMPANY_PROFILE.id,
    companyName,
    description,
    descriptionParagraphs: splitDescriptionParagraphs(description),
    mission: mission.length > 0 ? mission : FALLBACK_COMPANY_PROFILE.mission,
    vision: vision.length > 0 ? vision : FALLBACK_COMPANY_PROFILE.vision,
    address,
    mapsEmbedUrl,
    phone,
    email,
    fax,
    complaintLink,
    createdAt: normalizeText(record?.created_at) || null,
    updatedAt: normalizeText(record?.updated_at) || null,
  };
}

export async function getCompanyProfile() {
  if (USE_DUMMY_API_DATA) {
    return FALLBACK_COMPANY_PROFILE;
  }

  try {
    const response = await fetch(COMPANY_PROFILE_API_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch company profile: ${response.status} ${response.statusText}`,
      );
      return FALLBACK_COMPANY_PROFILE;
    }

    const payload = (await response.json()) as CompanyProfileApiResponse;
    return normalizeCompanyProfile(payload.data);
  } catch (error) {
    console.error("Failed to fetch company profile", error);
    return FALLBACK_COMPANY_PROFILE;
  }
}
