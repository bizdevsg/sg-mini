import "server-only";

import {
  PRIVACY_POLICY_API_URL,
  USE_DUMMY_API_DATA,
  normalizeSgAdminUrl,
} from "@/lib/env";
import { parseJsonResponse } from "@/lib/parse-json-response";
import type { AppLocale } from "@/locales";

export type PrivacyPolicyRecord = {
  id: number;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type PrivacyPolicyApiRecord = {
  id?: number;
  content?: string | null;
  content_en?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type PrivacyPolicyApiResponse = {
  data?: PrivacyPolicyApiRecord | null;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function pickLocalizedValue(
  locale: AppLocale,
  defaultValue: unknown,
  englishValue: unknown,
) {
  return locale === "en" ? englishValue ?? defaultValue : defaultValue;
}

function resolvePrivacyPolicyUrl(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  if (/^(mailto:|tel:|#)/i.test(normalizedValue)) {
    return normalizedValue;
  }

  try {
    return normalizeSgAdminUrl(
      new URL(normalizedValue, PRIVACY_POLICY_API_URL).toString(),
    );
  } catch {
    return normalizedValue;
  }
}

function stripAdminEditorArtifacts(content: string) {
  let normalizedContent = content
    .replace(
      /<p>\s*<label\b[^>]*for="content(?:_en)?"[^>]*>[\s\S]*?<\/label>\s*<\/p>/gi,
      "",
    );

  // Unwrap TinyMCE scaffolding while keeping the actual edited HTML content.
  const editorWrapperPattern =
    /<div class="space-y-2">\s*<div class="tox[^"]*"[^>]*>\s*<div class="tox-editor-container">\s*<div class="tox-editor-header"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gi;

  while (editorWrapperPattern.test(normalizedContent)) {
    normalizedContent = normalizedContent.replace(
      editorWrapperPattern,
      "$1",
    );
  }

  return normalizedContent;
}

function hasVisibleHtmlContent(content: string) {
  const plainText = content
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length > 0;
}

function sanitizePrivacyPolicyHtml(content: string) {
  if (!content) {
    return "";
  }

  const sanitizedContent = stripAdminEditorArtifacts(content)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+(src|href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(
      /<(img|source)\b([^>]*)\bsrc=(['"])(.*?)\3([^>]*)>/gi,
      (_match, tagName, before, quote, src, after) => {
        const resolvedSrc = resolvePrivacyPolicyUrl(normalizeText(src));
        return `<${tagName}${before}src=${quote}${resolvedSrc || src}${quote}${after}>`;
      },
    )
    .replace(
      /<a\b([^>]*)\bhref=(['"])(.*?)\2([^>]*)>/gi,
      (_match, before, quote, href, after) => {
        const resolvedHref = resolvePrivacyPolicyUrl(normalizeText(href));
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
    .replace(/<table\b([^>]*)>/gi, '<div class="privacy-policy-table-wrap"><table$1>')
    .replace(/<\/table>/gi, "</table></div>")
    .trim();

  return hasVisibleHtmlContent(sanitizedContent) ? sanitizedContent : "";
}

function getFallbackPrivacyPolicyRecord(locale: AppLocale): PrivacyPolicyRecord {
  const content =
    locale === "id"
      ? "<p>Kebijakan privasi belum tersedia saat ini.</p><p>Silakan coba lagi beberapa saat.</p>"
      : "<p>The privacy policy is not available right now.</p><p>Please try again later.</p>";

  return {
    id: 0,
    content,
    createdAt: null,
    updatedAt: null,
  };
}

function normalizePrivacyPolicyRecord(
  record: PrivacyPolicyApiRecord | null | undefined,
  locale: AppLocale,
) {
  const fallbackRecord = getFallbackPrivacyPolicyRecord(locale);
  const content = sanitizePrivacyPolicyHtml(
    normalizeText(
      pickLocalizedValue(locale, record?.content, record?.content_en),
    ),
  );

  return {
    id:
      typeof record?.id === "number" && Number.isFinite(record.id)
        ? record.id
        : fallbackRecord.id,
    content: content || fallbackRecord.content,
    createdAt: normalizeText(record?.created_at) || null,
    updatedAt: normalizeText(record?.updated_at) || null,
  };
}

export async function getPrivacyPolicyRecord(locale: AppLocale = "id") {
  const fallbackRecord = getFallbackPrivacyPolicyRecord(locale);

  if (USE_DUMMY_API_DATA) {
    return fallbackRecord;
  }

  try {
    const response = await fetch(PRIVACY_POLICY_API_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch privacy policy: ${response.status} ${response.statusText}`,
      );
      return fallbackRecord;
    }

    const responseBody = await response.text();
    const payload = parseJsonResponse<PrivacyPolicyApiResponse>(responseBody);
    return normalizePrivacyPolicyRecord(payload.data, locale);
  } catch (error) {
    console.error("Failed to fetch privacy policy", error);
    return fallbackRecord;
  }
}
