import "server-only";

import { request as requestHttp } from "node:http";
import { request as requestHttps } from "node:https";

import { getMessages, type AppLocale } from "@/locales";

import {
  NEWS_API_URL,
  NEWS_API_URL_ID,
  getNewsAssetUrl,
} from "@/lib/env";
import { getSgAdminApiHeaders } from "@/lib/sg-admin-api";
import {
  type NewsArticleDetail,
  type NewsArticleDetailResult,
  type NewsFeedArticle,
  type NewsFeedResult,
} from "@/lib/news.shared";

export type {
  NewsArticleDetail,
  NewsArticleDetailResult,
  NewsFeedArticle,
  NewsFeedResult,
} from "@/lib/news.shared";

export type PortalNewsApiArticle = {
  id: number | string;
  title: string;
  title_id?: string;
  title_en?: string;
  titles?: Record<string, string>;
  slug?: string;
  link?: string;
  content?: string;
  content_id?: string;
  content_en?: string;
  summary?: string;
  detail?: string;
  description?: string;
  excerpt?: string;
  body?: string;
  category?: string | { name?: string; title?: string; slug?: string };
  category_name?: string;
  kategori?: string | { name?: string; title?: string; slug?: string };
  image?: string;
  image_url?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  featured_image?: string;
  images?: string[];
  published_at?: string;
  createdAt?: string;
  updatedAt?: string;
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

type PortalNewsApiResponse = Record<string, unknown>;

function getRouteSlugKey(slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  const externalIdMatch = normalizedSlug.match(/^(\d+)(?=-|$)/);

  return externalIdMatch?.[1] ?? normalizedSlug;
}

const SUMMARY_MAX_LENGTH = 220;
const NEWS_API_TIMEOUT_MS = 20000;
const NEWS_API_CACHE_TTL_MS = 60 * 1000;
export const NEWS_REVALIDATE_SECONDS = NEWS_API_CACHE_TTL_MS / 1000;
const NEWS_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23111217'/%3E%3Crect x='30' y='30' width='1140' height='615' rx='28' fill='none' stroke='%23eab308' stroke-opacity='0.4' stroke-width='6'/%3E%3Ctext x='80' y='180' fill='%23eab308' font-family='Arial,sans-serif' font-size='56' font-weight='700'%3ELive Market News%3C/text%3E%3Ctext x='80' y='260' fill='%23f4f4f5' font-family='Arial,sans-serif' font-size='34'%3EPortal News feed placeholder%3C/text%3E%3C/svg%3E";

const cachedPortalNewsArticles = new Map<
  AppLocale,
  {
    articles: PortalNewsApiArticle[];
    expiresAt: number;
  }
>();
const inFlightPortalNewsRequests = new Map<
  AppLocale,
  Promise<PortalNewsApiArticle[]>
>();
const cachedPortalNewsArticleDetails = new Map<
  string,
  {
    article: PortalNewsApiArticle | null;
    expiresAt: number;
  }
>();
const inFlightPortalNewsDetailRequests = new Map<
  string,
  Promise<PortalNewsApiArticle | null>
>();

function resolveNewsApiUrl(locale: AppLocale) {
  return locale === "id" ? NEWS_API_URL_ID : NEWS_API_URL;
}

function buildNewsArticleDetailUrl(locale: AppLocale, slug: string) {
  const normalizedBaseUrl = resolveNewsApiUrl(locale).replace(/\/+$/, "");
  return new URL(`${normalizedBaseUrl}/${encodeURIComponent(slug.trim())}`);
}

function buildNewsFeedUrl(locale: AppLocale) {
  const url = new URL(resolveNewsApiUrl(locale));
  url.searchParams.set("per_page", "100");
  return url;
}

function getNewsArticleDetailCacheKey(locale: AppLocale, slug: string) {
  return `${locale}:${slug.trim().toLowerCase()}`;
}

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

function getLocalizedArticleField(
  locale: AppLocale,
  localizedValues: { id?: string; en?: string },
) {
  const localizedValue =
    locale === "en" ? localizedValues.en : localizedValues.id;
  const trimmedValue = localizedValue?.trim();

  return trimmedValue || null;
}

function getArticleContent(article: PortalNewsApiArticle, locale: AppLocale) {
  const localizedContent = getLocalizedArticleField(locale, {
    id: article.content_id,
    en: article.content_en,
  });

  return (
    localizedContent ??
    article.detail ??
    article.content ??
    article.body ??
    article.description ??
    ""
  );
}

function getArticleCategoryName(article: PortalNewsApiArticle) {
  const kategori = article.kategori;
  const kategoriName =
    typeof kategori === "string" ? kategori : kategori?.name ?? kategori?.title;
  const category = article.category;
  const categoryName =
    typeof category === "string"
      ? category
      : category?.name ?? category?.title ?? "";

  return kategoriName ?? article.category_name ?? categoryName;
}

function getArticleSlug(article: PortalNewsApiArticle) {
  const normalizedSlug = article.slug?.trim();

  if (normalizedSlug) {
    return normalizedSlug;
  }

  const normalizedLink = article.link?.trim();

  if (normalizedLink) {
    try {
      const parsedUrl = new URL(normalizedLink);
      const segments = parsedUrl.pathname
        .split("/")
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);
      const lastSegment = segments[segments.length - 1];

      if (lastSegment) {
        return lastSegment;
      }
    } catch {
      return normalizedLink;
    }
  }

  return String(article.id);
}

export function findNewsFeedArticleByRouteSlug(
  articles: NewsFeedArticle[],
  slug: string,
) {
  const normalizedSlug = slug.trim();

  const directMatch = articles.find((article) => article.slug === normalizedSlug);

  if (directMatch) {
    return directMatch;
  }

  const routeKey = getRouteSlugKey(normalizedSlug);

  return (
    articles.find((article) => getRouteSlugKey(article.slug) === routeKey) ?? null
  );
}

function getArticleSummary(article: PortalNewsApiArticle, locale: AppLocale) {
  const directSummary = normalizeWhitespace(
    decodeHtmlEntities(stripHtml(article.summary ?? article.excerpt ?? "")),
  );

  if (directSummary) {
    return truncateText(directSummary, SUMMARY_MAX_LENGTH);
  }

  const normalizedContent = normalizeWhitespace(
    decodeHtmlEntities(stripHtml(getArticleContent(article, locale))),
  );

  if (!normalizedContent) {
    return getArticleTitle(article, locale);
  }

  return truncateText(normalizedContent, SUMMARY_MAX_LENGTH);
}

function sanitizeArticleHtml(content: string) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<(iframe|object|embed|form|input|button|textarea|select)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[\s\S]*?"|'[\s\S]*?'|[^\s>]+)/gi, "")
    .replace(
      /\s+(href|src)\s*=\s*(?:"\s*javascript:[\s\S]*?"|'\s*javascript:[\s\S]*?'|javascript:[^\s>]+)/gi,
      "",
    )
    .replace(/\s+style\s*=\s*(?:"[\s\S]*?"|'[\s\S]*?'|[^\s>]+)/gi, "")
    .replace(/\s+class\s*=\s*(?:"[\s\S]*?"|'[\s\S]*?'|[^\s>]+)/gi, "")
    .replace(/\s+color\s*=\s*(?:"[\s\S]*?"|'[\s\S]*?'|[^\s>]+)/gi, "")
    .replace(/<\/?font\b[^>]*>/gi, "");
}

function getArticleBodyHtml(content: string) {
  const sanitizedContent = sanitizeArticleHtml(content).trim();

  if (/<[a-z][\s\S]*>/i.test(sanitizedContent)) {
    return sanitizedContent;
  }

  const fallbackParagraphs = decodeHtmlEntities(content)
    .split(/\n{2,}/)
    .map((paragraph) => normalizeWhitespace(stripHtml(paragraph)))
    .filter((paragraph) => paragraph.length > 0);

  if (fallbackParagraphs.length > 0) {
    return fallbackParagraphs
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  const fallbackText = normalizeWhitespace(decodeHtmlEntities(stripHtml(content)));
  return fallbackText ? `<p>${escapeHtml(fallbackText)}</p>` : "";
}

function getArticleTitle(article: PortalNewsApiArticle, locale: AppLocale) {
  const localizedTitle = getLocalizedArticleField(locale, {
    id: article.title_id,
    en: article.title_en,
  });

  return (
    localizedTitle ??
    article.titles?.sg ??
    article.titles?.default ??
    article.title
  );
}

function getTimestamp(value?: string) {
  const timestamp = new Date(value ?? "").getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function getArticlePublishedAt(article: PortalNewsApiArticle) {
  return (
    article.published_at ??
    article.createdAt ??
    article.updatedAt ??
    article.created_at ??
    article.updated_at ??
    ""
  );
}

function getArticlePublishedTimestamp(article: PortalNewsApiArticle) {
  return getTimestamp(getArticlePublishedAt(article));
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
  return getArticlePublishedAt(article);
}

function getArticleImage(article: PortalNewsApiArticle) {
  const directImage = (
    article.image_url ??
    article.image ??
    article.thumbnail ??
    article.thumbnail_url ??
    article.featured_image
  )?.trim();

  if (directImage) {
    return getNewsAssetUrl(directImage);
  }

  const imagePath = article.images?.find((image) => image.trim().length > 0);

  if (!imagePath) {
    return NEWS_PLACEHOLDER_IMAGE;
  }

  return getNewsAssetUrl(imagePath);
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

function toFeedArticle(
  article: PortalNewsApiArticle,
  locale: AppLocale,
): NewsFeedArticle {
  const summary = getArticleSummary(article, locale);
  const categoryName = getArticleCategoryName(article);
  const normalizedCategory = categoryName.trim() || "Uncategorized";

  return {
    id: String(article.id),
    title: getArticleTitle(article, locale),
    slug: getArticleSlug(article),
    summary,
    category: normalizedCategory,
    displayCategory: getDisplayNewsCategory(categoryName, normalizedCategory),
    publishedAt: getPublishedAt(article),
    imageSrc: getArticleImage(article),
  };
}

function toFeedArticleFromEntry(article: PortalNewsFeedEntry): NewsFeedArticle {
  const normalizedCategory = article.categoryName.trim() || "Uncategorized";
  const normalizedImagePath = article.imagePath?.trim() ?? "";

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
    imageSrc: normalizedImagePath
      ? getNewsAssetUrl(normalizedImagePath)
      : NEWS_PLACEHOLDER_IMAGE,
  };
}

function toPortalNewsFeedEntry(
  article: PortalNewsApiArticle,
  locale: AppLocale,
): PortalNewsFeedEntry {
  return {
    id: String(article.id),
    title: getArticleTitle(article, locale),
    slug: getArticleSlug(article),
    summary: getArticleSummary(article, locale),
    categoryName: getArticleCategoryName(article).trim(),
    publishedAt: getPublishedAt(article),
    imagePath:
      article.image_url?.trim() ||
      article.image?.trim() ||
      article.images?.find((image) => image.trim().length > 0) ||
      null,
  };
}

function toDetailArticle(
  article: PortalNewsApiArticle,
  locale: AppLocale,
): NewsArticleDetail {
  const feedArticle = toFeedArticle(article, locale);
  const content = getArticleContent(article, locale);
  const bodyHtml = getArticleBodyHtml(content);

  return {
    ...feedArticle,
    bodyHtml: bodyHtml || `<p>${escapeHtml(feedArticle.summary)}</p>`,
    readTime: getEstimatedReadTime(content || feedArticle.summary, locale),
    tags: [],
  };
}

function isNewsArticle(value: unknown): value is PortalNewsApiArticle {
  return (
    typeof value === "object" &&
    value !== null &&
    ("id" in value || "slug" in value) &&
    ("title" in value || "titles" in value)
  );
}

function getResponseData(payload: PortalNewsApiResponse) {
  return payload.data ?? payload.result ?? payload.results ?? payload.berita ?? null;
}

function extractNewsArticles(payload: PortalNewsApiResponse): PortalNewsApiArticle[] {
  const data = getResponseData(payload);

  if (Array.isArray(data)) {
    return data.filter(isNewsArticle);
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const collection = data as Record<string, unknown>;
  const entries = collection.data ?? collection.items ?? collection.articles ?? collection.berita;
  return Array.isArray(entries) ? entries.filter(isNewsArticle) : [];
}

function extractNewsArticle(payload: PortalNewsApiResponse): PortalNewsApiArticle | null {
  const data = getResponseData(payload);

  if (isNewsArticle(data)) {
    return data;
  }

  if (typeof data !== "object" || data === null) {
    return null;
  }

  const record = data as Record<string, unknown>;
  const article = record.article ?? record.berita;
  return isNewsArticle(article) ? article : null;
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

async function requestPortalNewsArticles(
  locale: AppLocale,
): Promise<PortalNewsApiArticle[]> {
  return new Promise<PortalNewsApiArticle[]>((resolve) => {
    const requestUrl = buildNewsFeedUrl(locale);
    const requestClient = getRequestClient(requestUrl.protocol);
    void getSgAdminApiHeaders().then((headers) => {
      const httpRequest = requestClient(
        requestUrl,
        {
          method: "GET",
          headers: Object.fromEntries(headers.entries()),
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
            resolve(extractNewsArticles(payload).slice().sort(compareArticleDates));
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
  });
}

async function requestPortalNewsArticleBySlug(
  locale: AppLocale,
  slug: string,
): Promise<PortalNewsApiArticle | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  return new Promise<PortalNewsApiArticle | null>((resolve) => {
    const requestUrl = buildNewsArticleDetailUrl(locale, normalizedSlug);
    const requestClient = getRequestClient(requestUrl.protocol);
    void getSgAdminApiHeaders().then((headers) => {
      const httpRequest = requestClient(
        requestUrl,
        {
          method: "GET",
          headers: Object.fromEntries(headers.entries()),
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
            resolve(null);
            return;
          }

          try {
            const payload = JSON.parse(responseBody) as PortalNewsApiResponse;
            resolve(extractNewsArticle(payload));
          } catch {
            resolve(null);
          }
        });
      },
      );

      httpRequest.on("error", () => {
        resolve(null);
      });

      httpRequest.setTimeout(NEWS_API_TIMEOUT_MS, () => {
        httpRequest.destroy();
        resolve(null);
      });

      httpRequest.end();
    });
  });
}

async function requestPortalNewsArticlesCached(
  locale: AppLocale,
): Promise<PortalNewsApiArticle[]> {
  const now = Date.now();
  const cachedArticles = cachedPortalNewsArticles.get(locale);

  if (cachedArticles && cachedArticles.expiresAt > now) {
    return cachedArticles.articles;
  }

  const inFlightRequest = inFlightPortalNewsRequests.get(locale);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const nextRequest = requestPortalNewsArticles(locale)
    .then((articles) => {
      cachedPortalNewsArticles.set(locale, {
        articles,
        expiresAt: Date.now() + NEWS_API_CACHE_TTL_MS,
      });
      return articles;
    })
    .finally(() => {
      inFlightPortalNewsRequests.delete(locale);
    });

  inFlightPortalNewsRequests.set(locale, nextRequest);

  return nextRequest;
}

async function requestPortalNewsArticleBySlugCached(
  locale: AppLocale,
  slug: string,
): Promise<PortalNewsApiArticle | null> {
  const cacheKey = getNewsArticleDetailCacheKey(locale, slug);
  const now = Date.now();
  const cachedArticle = cachedPortalNewsArticleDetails.get(cacheKey);

  if (cachedArticle && cachedArticle.expiresAt > now) {
    return cachedArticle.article;
  }

  const inFlightRequest = inFlightPortalNewsDetailRequests.get(cacheKey);

  if (inFlightRequest) {
    return inFlightRequest;
  }

  const nextRequest = requestPortalNewsArticleBySlug(locale, slug)
    .then((article) => {
      cachedPortalNewsArticleDetails.set(cacheKey, {
        article,
        expiresAt: Date.now() + NEWS_API_CACHE_TTL_MS,
      });
      return article;
    })
    .finally(() => {
      inFlightPortalNewsDetailRequests.delete(cacheKey);
    });

  inFlightPortalNewsDetailRequests.set(cacheKey, nextRequest);

  return nextRequest;
}

async function fetchPortalNewsFeedEntries(
  locale: AppLocale,
): Promise<PortalNewsFeedEntry[]> {
  const articles = await requestPortalNewsArticlesCached(locale);
  return articles.map((article) => toPortalNewsFeedEntry(article, locale));
}

export async function getNewsFeed(
  locale: AppLocale,
  limit?: number,
): Promise<NewsFeedResult> {
  try {
    const rawArticles = await fetchPortalNewsFeedEntries(locale);
    const articles = rawArticles
      .map(toFeedArticleFromEntry)
      .slice(0, typeof limit === "number" ? limit : rawArticles.length);

    if (!articles.length) {
      return {
        articles: [],
      };
    }

    return {
      articles,
    };
  } catch {
    return {
      articles: [],
    };
  }
}

export async function getNewsArticleBySlug(
  locale: AppLocale,
  slug: string,
): Promise<NewsArticleDetailResult> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return {
      article: null,
    };
  }

  try {
    const detailedArticle = await requestPortalNewsArticleBySlugCached(
      locale,
      normalizedSlug,
    );

    if (detailedArticle) {
      return {
        article: toDetailArticle(detailedArticle, locale),
      };
    }

    const articles = await requestPortalNewsArticlesCached(locale);
    const rawArticle =
      articles.find(
        (article) =>
          getArticleSlug(article) === normalizedSlug ||
          getRouteSlugKey(getArticleSlug(article)) ===
            getRouteSlugKey(normalizedSlug),
      ) ?? null;

    if (rawArticle) {
      return {
        article: toDetailArticle(rawArticle, locale),
      };
    }

    return {
      article: null,
    };
  } catch {
    return {
      article: null,
    };
  }
}
