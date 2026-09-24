import "server-only";

import { TERMS_CONDITIONS_API_URL, normalizeSgAdminUrl } from "@/lib/env";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";
import type { AppLocale } from "@/locales";

export type TermsConditionsRecord = {
  id: number;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type TermsConditionsApiRecord = {
  id?: number;
  content?: string | null;
  content_en?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type TermsConditionsApiResponse = {
  data?: TermsConditionsApiRecord | null;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function resolveTermsConditionsUrl(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  if (/^(mailto:|tel:|#)/i.test(normalizedValue)) {
    return normalizedValue;
  }

  try {
    return normalizeSgAdminUrl(
      new URL(normalizedValue, TERMS_CONDITIONS_API_URL).toString(),
    );
  } catch {
    return normalizedValue;
  }
}

function sanitizeTermsConditionsHtml(content: string) {
  if (!content) {
    return "";
  }

  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+(src|href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(
      /<(img|source)\b([^>]*)\bsrc=(['"])(.*?)\3([^>]*)>/gi,
      (_match, tagName, before, quote, src, after) => {
        const resolvedSrc = resolveTermsConditionsUrl(normalizeText(src));
        return `<${tagName}${before}src=${quote}${resolvedSrc || src}${quote}${after}>`;
      },
    )
    .replace(
      /<a\b([^>]*)\bhref=(['"])(.*?)\2([^>]*)>/gi,
      (_match, before, quote, href, after) => {
        const resolvedHref = resolveTermsConditionsUrl(normalizeText(href));
        const target = /target\s*=/i.test(`${before} ${after}`)
          ? ""
          : ' target="_blank"';
        const rel = /rel\s*=/i.test(`${before} ${after}`)
          ? ""
          : ' rel="noopener noreferrer"';

        return `<a${before}href=${quote}${resolvedHref || href}${quote}${after}${target}${rel}>`;
      },
    )
    .replace(/<img\b(?![^>]*\bloading=)([^>]*)>/gi, '<img loading="lazy"$1>')
    .replace(/<table\b([^>]*)>/gi, '<div class="terms-conditions-table-wrap"><table$1>')
    .replace(/<\/table>/gi, "</table></div>");
}

function pickLocalizedValue(
  locale: AppLocale,
  defaultValue: unknown,
  englishValue: unknown,
) {
  return locale === "en" ? englishValue ?? defaultValue : defaultValue;
}

function normalizeTermsConditionsRecord(
  record: TermsConditionsApiRecord | null | undefined,
  locale: AppLocale,
) {
  const content = sanitizeTermsConditionsHtml(
    normalizeText(
      pickLocalizedValue(locale, record?.content, record?.content_en),
    ),
  );

  return {
    id: typeof record?.id === "number" && Number.isFinite(record.id) ? record.id : 0,
    content,
    createdAt: normalizeText(record?.created_at) || null,
    updatedAt: normalizeText(record?.updated_at) || null,
  };
}

export async function getTermsConditionsRecord(locale: AppLocale = "id") {
  try {
    const response = await fetch(TERMS_CONDITIONS_API_URL, {
      cache: "no-store",
      headers: await getSgAdminApiHeaders(),
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch terms and conditions: ${response.status} ${response.statusText}`,
      );
      return normalizeTermsConditionsRecord(null, locale);
    }

    const responseBody = await response.text();
    const payload = parseJsonResponse<TermsConditionsApiResponse>(responseBody);

    return normalizeTermsConditionsRecord(payload.data, locale);
  } catch (error) {
    console.error("Failed to fetch terms and conditions", error);
    return normalizeTermsConditionsRecord(null, locale);
  }
}
