import "server-only";

import { COMPANY_PROFILE_API_URL } from "@/lib/env";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";
import type { AppLocale } from "@/locales";

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
  company_name_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  mission?: unknown;
  mission_en?: unknown;
  vision?: unknown;
  vision_en?: unknown;
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

const COMPANY_PROFILE_REVALIDATE_SECONDS = 300;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTextList(value: unknown) {
  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(normalizedValue) as unknown;

      if (Array.isArray(parsedValue)) {
        return parsedValue
          .map((item) => normalizeText(item))
          .filter((item) => item.length > 0);
      }
    } catch {
      return normalizedValue
        .split(/\r?\n+/g)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
  }

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
      : [];
}

function pickLocalizedValue(
  locale: AppLocale,
  defaultValue: unknown,
  englishValue: unknown,
) {
  return locale === "en" ? englishValue ?? defaultValue : defaultValue;
}

function normalizeCompanyProfile(
  record: CompanyProfileApiRecord | null | undefined,
  locale: AppLocale,
): CompanyProfile {
  const companyName = normalizeText(
    pickLocalizedValue(locale, record?.company_name, record?.company_name_en),
  );
  const description = normalizeText(
    pickLocalizedValue(locale, record?.description, record?.description_en),
  );
  const mission = normalizeTextList(
    pickLocalizedValue(locale, record?.mission, record?.mission_en),
  );
  const vision = normalizeTextList(
    pickLocalizedValue(locale, record?.vision, record?.vision_en),
  );
  const address = normalizeText(record?.address);
  const mapsEmbedUrl = normalizeText(record?.maps_embed_url);
  const phone = normalizeText(record?.phone);
  const email = normalizeText(record?.email);
  const fax = normalizeText(record?.fax);
  const complaintLink = normalizeText(record?.complaint_link);

  return {
    id: typeof record?.id === "number" && Number.isFinite(record.id) ? record.id : 0,
    companyName,
    description,
    descriptionParagraphs: splitDescriptionParagraphs(description),
    mission,
    vision,
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

export async function getCompanyProfile(locale: AppLocale = "id") {
  try {
    const response = await fetch(COMPANY_PROFILE_API_URL, {
      next: {
        revalidate: COMPANY_PROFILE_REVALIDATE_SECONDS,
      },
      headers: await getSgAdminApiHeaders(),
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch company profile: ${response.status} ${response.statusText}`,
      );
      return normalizeCompanyProfile(null, locale);
    }

    const responseBody = await response.text();
    const payload = parseJsonResponse<CompanyProfileApiResponse>(responseBody);
    return normalizeCompanyProfile(payload.data, locale);
  } catch (error) {
    console.error("Failed to fetch company profile", error);
    return normalizeCompanyProfile(null, locale);
  }
}
