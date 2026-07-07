import "server-only";

import { request as requestHttp } from "node:http";
import { request as requestHttps } from "node:https";

import {
  getNewsPageContent,
  type NewsArticle,
} from "@/locales/news-page-content";
import { getMessages, type AppLocale } from "@/locales";

import {
  NEWS_API_TOKEN,
  NEWS_API_URL,
  USE_DUMMY_API_DATA,
  getNewsAssetUrl,
} from "@/lib/env";
import {
  NEWS_FILTER_CATEGORIES,
  type NewsArticleDetail,
  type NewsArticleDetailResult,
  type NewsFeedArticle,
  type NewsFeedResult,
} from "@/lib/news.shared";

export { NEWS_FILTER_CATEGORIES } from "@/lib/news.shared";
export type {
  NewsArticleDetail,
  NewsArticleDetailResult,
  NewsFeedArticle,
  NewsFeedResult,
} from "@/lib/news.shared";

export type PortalNewsApiArticle = {
  id: number;
  title: string;
  titles?: Record<string, string>;
  slug: string;
  content: string;
  kategori?: {
    name?: string;
    slug?: string;
  };
  images?: string[];
  created_at?: string;
  updated_at?: string;
};

export type PortalNewsFeedEntry = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  categoryName: string;
  publishedAt: string;
  imagePath: string | null;
};

type PortalNewsApiResponse = {
  status: string;
  data?: PortalNewsApiArticle[];
};

const NEWS_CATEGORY_MAP = new Map<string, (typeof NEWS_FILTER_CATEGORIES)[number]>(
  [
    ["japan shares", "Index"],
    ["hong kong share", "Index"],
    ["gold", "Commodity"],
    ["silver", "Commodity"],
    ["oil", "Commodity"],
    ["aud/usd", "Currencies"],
    ["eur/usd", "Currencies"],
    ["gbp/usd", "Currencies"],
    ["usd/chf", "Currencies"],
    ["usd/jpy", "Currencies"],
    ["us dollar", "Currencies"],
    ["global economics", "Global & Ekonomi"],
    ["fiscal & moneter", "Fiscal & Moneter"],
    ["analisis market", "Analisis Market"],
    ["index", "Index"],
    ["commodity", "Commodity"],
    ["currencies", "Currencies"],
    ["global & ekonomi", "Global & Ekonomi"],
  ],
);

const SUMMARY_MAX_LENGTH = 220;
const NEWS_API_TIMEOUT_MS = 20000;
const NEWS_API_CACHE_TTL_MS = 60 * 1000;
export const NEWS_REVALIDATE_SECONDS = NEWS_API_CACHE_TTL_MS / 1000;
const NEWS_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23111217'/%3E%3Crect x='30' y='30' width='1140' height='615' rx='28' fill='none' stroke='%23eab308' stroke-opacity='0.4' stroke-width='6'/%3E%3Ctext x='80' y='180' fill='%23eab308' font-family='Arial,sans-serif' font-size='56' font-weight='700'%3ELive Market News%3C/text%3E%3Ctext x='80' y='260' fill='%23f4f4f5' font-family='Arial,sans-serif' font-size='34'%3EPortal News feed placeholder%3C/text%3E%3C/svg%3E";

let cachedPortalNewsArticles:
  | {
      articles: PortalNewsApiArticle[];
      expiresAt: number;
    }
  | null = null;
let inFlightPortalNewsRequest: Promise<PortalNewsApiArticle[]> | null = null;

function getRequestClient(protocol: string) {
  return protocol === "http:" ? requestHttp : requestHttps;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/&ndash;/gi, "-")
    .replace(/&mdash;/gi, "-")
    .replace(/&hellip;/gi, "...");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function getArticleSummary(article: PortalNewsApiArticle) {
  const normalizedContent = normalizeWhitespace(
    decodeHtmlEntities(stripHtml(article.content)),
  );

  if (!normalizedContent) {
    return article.title;
  }

  return truncateText(normalizedContent, SUMMARY_MAX_LENGTH);
}

function sanitizeArticleHtml(content: string) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<(iframe|object|embed|form|input|button|textarea|select)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/\s+style\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+class\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+color\s*=\s*(['"]).*?\1/gi, "");
}

function getArticleBodyHtml(content: string) {
  const sanitizedContent = sanitizeArticleHtml(content).trim();

  if (sanitizedContent) {
    return sanitizedContent;
  }

  const fallbackText = normalizeWhitespace(decodeHtmlEntities(stripHtml(content)));
  return fallbackText ? `<p>${escapeHtml(fallbackText)}</p>` : "";
}

function getFallbackBodyHtml(paragraphs: string[]) {
  return paragraphs
    .map((paragraph) => normalizeWhitespace(paragraph))
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function getArticleTitle(article: PortalNewsApiArticle) {
  return article.titles?.sg ?? article.titles?.default ?? article.title;
}

function getTimestamp(value?: string) {
  const timestamp = new Date(value ?? "").getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function getArticlePublishedTimestamp(article: PortalNewsApiArticle) {
  return getTimestamp(article.created_at ?? article.updated_at);
}

function compareArticleDates(a: PortalNewsApiArticle, b: PortalNewsApiArticle) {
  const firstDate = getArticlePublishedTimestamp(a);
  const secondDate = getArticlePublishedTimestamp(b);

  if (firstDate === null && secondDate === null) {
    return 0;
  }

  if (firstDate === null) {
    return 1;
  }

  if (secondDate === null) {
    return -1;
  }

  return secondDate - firstDate;
}

function comparePublishedAtStrings(
  firstPublishedAt?: string,
  secondPublishedAt?: string,
) {
  const firstDate = getTimestamp(firstPublishedAt);
  const secondDate = getTimestamp(secondPublishedAt);

  if (firstDate === null && secondDate === null) {
    return 0;
  }

  if (firstDate === null) {
    return 1;
  }

  if (secondDate === null) {
    return -1;
  }

  return secondDate - firstDate;
}

function getPublishedAt(article: PortalNewsApiArticle) {
  return article.created_at ?? article.updated_at ?? "";
}

function getArticleImage(article: PortalNewsApiArticle) {
  const imagePath = article.images?.find((image) => image.trim().length > 0);

  if (!imagePath) {
    return NEWS_PLACEHOLDER_IMAGE;
  }

  return getNewsAssetUrl(imagePath);
}

function normalizeCategoryText(value: string) {
  return value.trim().toLowerCase();
}

function getNormalizedNewsCategory(category?: string) {
  const rawCategory = normalizeCategoryText(category ?? "");
  return NEWS_CATEGORY_MAP.get(rawCategory) ?? "Global & Ekonomi";
}

function getDisplayNewsCategory(category: string | undefined, fallback: string) {
  const trimmedCategory = category?.trim();
  return trimmedCategory && trimmedCategory.length > 0
    ? trimmedCategory
    : fallback;
}

function getReadTimeLabel(minutes: number, locale: AppLocale) {
  return `${minutes} ${getMessages(locale).newsDetailPage.readTimeUnit}`;
}

function getEstimatedReadTime(content: string, locale: AppLocale) {
  const plainContent = normalizeWhitespace(decodeHtmlEntities(stripHtml(content)));
  const wordCount = plainContent ? plainContent.split(" ").length : 0;
  const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return getReadTimeLabel(estimatedMinutes, locale);
}

function toFeedArticle(article: PortalNewsApiArticle): NewsFeedArticle {
  const summary = getArticleSummary(article);
  const normalizedCategory = getNormalizedNewsCategory(article.kategori?.name);

  return {
    id: String(article.id),
    title: getArticleTitle(article),
    slug: article.slug,
    summary,
    category: normalizedCategory,
    displayCategory: getDisplayNewsCategory(
      article.kategori?.name,
      normalizedCategory,
    ),
    publishedAt: getPublishedAt(article),
    imageSrc: getArticleImage(article),
  };
}

function toFeedArticleFromEntry(article: PortalNewsFeedEntry): NewsFeedArticle {
  const normalizedCategory = getNormalizedNewsCategory(article.categoryName);

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    category: normalizedCategory,
    displayCategory: getDisplayNewsCategory(
      article.categoryName,
      normalizedCategory,
    ),
    publishedAt: article.publishedAt,
    imageSrc: article.imagePath ? getNewsAssetUrl(article.imagePath) : NEWS_PLACEHOLDER_IMAGE,
  };
}

function toPortalNewsFeedEntry(article: PortalNewsApiArticle): PortalNewsFeedEntry {
  return {
    id: String(article.id),
    title: getArticleTitle(article),
    slug: article.slug,
    summary: getArticleSummary(article),
    categoryName: article.kategori?.name?.trim() || "",
    publishedAt: getPublishedAt(article),
    imagePath:
      article.images?.find((image) => image.trim().length > 0) ?? null,
  };
}

function toDetailArticle(
  article: PortalNewsApiArticle,
  locale: AppLocale,
): NewsArticleDetail {
  const feedArticle = toFeedArticle(article);
  const bodyHtml = getArticleBodyHtml(article.content);

  return {
    ...feedArticle,
    bodyHtml: bodyHtml || `<p>${escapeHtml(feedArticle.summary)}</p>`,
    readTime: getEstimatedReadTime(article.content, locale),
    tags: [],
  };
}

function toFallbackDetailArticle(
  article: NewsArticle,
): NewsArticleDetail {
  const normalizedCategory = getNormalizedNewsCategory(article.category);

  return {
    id: article.slug,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    category: normalizedCategory,
    displayCategory: getDisplayNewsCategory(article.category, normalizedCategory),
    publishedAt: article.publishedAt,
    imageSrc: NEWS_PLACEHOLDER_IMAGE,
    bodyHtml: getFallbackBodyHtml(article.body),
    readTime: article.readTime,
    tags: article.tags,
  };
}

export function createNewsDetailFromFeedArticle(
  article: NewsFeedArticle,
  locale: AppLocale,
): NewsArticleDetail {
  return {
    ...article,
    bodyHtml: `<p>${escapeHtml(article.summary || article.title)}</p>`,
    readTime: getEstimatedReadTime(article.summary || article.title, locale),
    tags: [],
  };
}

function getFallbackArticles(
  locale: AppLocale,
  limit: number,
): NewsFeedArticle[] {
  return getNewsPageContent(locale)
    .latest.articles
    .slice()
    .sort((firstArticle, secondArticle) =>
      comparePublishedAtStrings(
        firstArticle.publishedAt,
        secondArticle.publishedAt,
      ),
    )
    .slice(0, limit)
    .map((article) => {
      const normalizedCategory = getNormalizedNewsCategory(article.category);

      return {
        id: article.slug,
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        category: normalizedCategory,
        displayCategory: getDisplayNewsCategory(
          article.category,
          normalizedCategory,
        ),
        publishedAt: article.publishedAt,
        imageSrc: NEWS_PLACEHOLDER_IMAGE,
      };
    });
}

function getFallbackArticleBySlug(locale: AppLocale, slug: string) {
  const article = getNewsPageContent(locale).latest.articles.find(
    (item) => item.slug === slug,
  );

  return article ? toFallbackDetailArticle(article) : null;
}

export function getStaticNewsFeed(
  locale: AppLocale,
  limit?: number,
): NewsFeedResult {
  const fallbackLimit = limit ?? Number.MAX_SAFE_INTEGER;

  return {
    articles: getFallbackArticles(locale, fallbackLimit),
    source: "fallback",
  };
}

export function getStaticNewsArticleBySlug(
  locale: AppLocale,
  slug: string,
): NewsArticleDetailResult {
  return {
    article: getFallbackArticleBySlug(locale, slug),
    source: "fallback",
  };
}

async function requestPortalNewsArticles(): Promise<PortalNewsApiArticle[]> {
  if (!NEWS_API_TOKEN) {
    return [];
  }

  return new Promise<PortalNewsApiArticle[]>((resolve) => {
    const requestUrl = new URL(NEWS_API_URL);
    const requestClient = getRequestClient(requestUrl.protocol);
    const httpRequest = requestClient(
      requestUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${NEWS_API_TOKEN}`,
        },
      },
      (response) => {
        const statusCode = response.statusCode ?? 500;
        let responseBody = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          responseBody += chunk;
        });

        response.on("end", () => {
          if (statusCode < 200 || statusCode >= 300) {
            resolve([]);
            return;
          }

          try {
            const payload = JSON.parse(responseBody) as PortalNewsApiResponse;

            resolve(
              payload.status === "success" && Array.isArray(payload.data)
                ? payload.data.slice().sort(compareArticleDates)
                : [],
            );
          } catch {
            resolve([]);
          }
        });
      },
    );

    httpRequest.on("error", () => {
      resolve([]);
    });

    httpRequest.setTimeout(NEWS_API_TIMEOUT_MS, () => {
      httpRequest.destroy();
      resolve([]);
    });

    httpRequest.end();
  });
}

async function requestPortalNewsArticlesCached(): Promise<PortalNewsApiArticle[]> {
  const now = Date.now();

  if (cachedPortalNewsArticles && cachedPortalNewsArticles.expiresAt > now) {
    return cachedPortalNewsArticles.articles;
  }

  if (inFlightPortalNewsRequest) {
    return inFlightPortalNewsRequest;
  }

  inFlightPortalNewsRequest = requestPortalNewsArticles()
    .then((articles) => {
      cachedPortalNewsArticles = {
        articles,
        expiresAt: Date.now() + NEWS_API_CACHE_TTL_MS,
      };
      return articles;
    })
    .finally(() => {
      inFlightPortalNewsRequest = null;
    });

  return inFlightPortalNewsRequest;
}

async function fetchPortalNewsFeedEntries(): Promise<PortalNewsFeedEntry[]> {
  if (!NEWS_API_TOKEN) {
    return [];
  }

  const articles = await requestPortalNewsArticlesCached();
  return articles.map(toPortalNewsFeedEntry);
}

export async function getNewsFeed(
  locale: AppLocale,
  limit?: number,
): Promise<NewsFeedResult> {
  const fallbackLimit = limit ?? Number.MAX_SAFE_INTEGER;
  const fallbackArticles = getFallbackArticles(locale, fallbackLimit);

  if (USE_DUMMY_API_DATA || !NEWS_API_TOKEN) {
    return {
      articles: fallbackArticles,
      source: "fallback",
    };
  }

  try {
    const rawArticles = await fetchPortalNewsFeedEntries();
    const articles = rawArticles
      .map(toFeedArticleFromEntry)
      .slice(0, typeof limit === "number" ? limit : rawArticles.length);

    if (!articles.length) {
      return {
        articles: fallbackArticles,
        source: "fallback",
      };
    }

    return {
      articles,
      source: "api",
    };
  } catch {
    return {
      articles: fallbackArticles,
      source: "fallback",
    };
  }
}

export async function getNewsArticleBySlug(
  locale: AppLocale,
  slug: string,
): Promise<NewsArticleDetailResult> {
  const fallbackArticle = getFallbackArticleBySlug(locale, slug);

  if (USE_DUMMY_API_DATA || !NEWS_API_TOKEN) {
    return {
      article: fallbackArticle,
      source: "fallback",
    };
  }

  try {
    const articles = await requestPortalNewsArticlesCached();
    const rawArticle = articles.find((article) => article.slug === slug) ?? null;

    if (rawArticle) {
      return {
        article: toDetailArticle(rawArticle, locale),
        source: "api",
      };
    }

    return {
      article: fallbackArticle,
      source: "fallback",
    };
  } catch {
    return {
      article: fallbackArticle,
      source: "fallback",
    };
  }
}
