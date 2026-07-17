import "server-only";

import { COMPANY_PROFILE_API_URL, USE_DUMMY_API_DATA } from "@/lib/env";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { getMessages, type AppLocale } from "@/locales";

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

const DEFAULT_ADDRESS =
  "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220";
const DEFAULT_MAPS_EMBED_URL =
  "https://www.google.com/maps?q=TCC%20Batavia%20Tower%20One%20Lt.%2010%20Jl.%20K.H.%20Mas%20Mansyur%20Kav.%20126%20Jakarta%20Pusat%2010220&z=15&output=embed";
const DEFAULT_PHONE = "021-29675088";
const DEFAULT_EMAIL = "berjangka@solidgold.co.id";
const DEFAULT_FAX = "021-29675089";
const DEFAULT_COMPLAINT_LINK = "https://pengaduan.bappebti.go.id/";
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

function getFallbackCompanyProfile(locale: AppLocale): CompanyProfile {
  const { companyProfile, visiMisi } = getMessages(locale).aboutPage;

  return {
    id: 1,
    companyName: companyProfile.title,
    description: companyProfile.paragraphs.join("\n\n"),
    descriptionParagraphs: companyProfile.paragraphs,
    mission: visiMisi.missionItems,
    vision: visiMisi.visionItems,
    address: DEFAULT_ADDRESS,
    mapsEmbedUrl: DEFAULT_MAPS_EMBED_URL,
    phone: DEFAULT_PHONE,
    email: DEFAULT_EMAIL,
    fax: DEFAULT_FAX,
    complaintLink: DEFAULT_COMPLAINT_LINK,
    createdAt: null,
    updatedAt: null,
  };
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
  const fallbackProfile = getFallbackCompanyProfile(locale);
  const companyName =
    normalizeText(
      pickLocalizedValue(locale, record?.company_name, record?.company_name_en),
    ) || fallbackProfile.companyName;
  const description =
    normalizeText(
      pickLocalizedValue(locale, record?.description, record?.description_en),
    ) || fallbackProfile.description;
  const mission = normalizeTextList(
    pickLocalizedValue(locale, record?.mission, record?.mission_en),
  );
  const vision = normalizeTextList(
    pickLocalizedValue(locale, record?.vision, record?.vision_en),
  );
  const address = normalizeText(record?.address) || fallbackProfile.address;
  const mapsEmbedUrl =
    normalizeText(record?.maps_embed_url) || fallbackProfile.mapsEmbedUrl;
  const phone = normalizeText(record?.phone) || fallbackProfile.phone;
  const email = normalizeText(record?.email) || fallbackProfile.email;
  const fax = normalizeText(record?.fax) || fallbackProfile.fax;
  const complaintLink =
    normalizeText(record?.complaint_link) || fallbackProfile.complaintLink;

  return {
    id:
      typeof record?.id === "number" && Number.isFinite(record.id)
        ? record.id
        : fallbackProfile.id,
    companyName,
    description,
    descriptionParagraphs: splitDescriptionParagraphs(description),
    mission: mission.length > 0 ? mission : fallbackProfile.mission,
    vision: vision.length > 0 ? vision : fallbackProfile.vision,
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
  const fallbackProfile = getFallbackCompanyProfile(locale);

  if (USE_DUMMY_API_DATA) {
    return fallbackProfile;
  }

  try {
    const response = await fetch(COMPANY_PROFILE_API_URL, {
      next: {
        revalidate: COMPANY_PROFILE_REVALIDATE_SECONDS,
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch company profile: ${response.status} ${response.statusText}`,
      );
      return fallbackProfile;
    }

    const responseBody = await response.text();
    const payload = parseJsonResponse<CompanyProfileApiResponse>(responseBody);
    return normalizeCompanyProfile(payload.data, locale);
  } catch (error) {
    console.error("Failed to fetch company profile", error);
    return fallbackProfile;
  }
}
