import { request } from "node:https";

import {
  getNewsPageContent,
  type NewsArticle,
} from "@/components/content/news-content";
import { getMessages, type AppLocale } from "@/locales";

import { getNewsAssetUrl, NEWS_API_TOKEN, NEWS_API_URL } from "@/lib/env";

type PortalNewsApiResponse = {
  status: string;
  data?: PortalNewsApiArticle[];
};

type PortalNewsApiArticle = {
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

export type NewsFeedArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  displayCategory: string;
  publishedAt: string;
  imageSrc: string;
};

export type NewsArticleDetail = NewsFeedArticle & {
  body: string[];
  readTime: string;
  tags: string[];
};

export type NewsFeedResult = {
  articles: NewsFeedArticle[];
  source: "api" | "fallback";
};

export type NewsArticleDetailResult = {
  article: NewsArticleDetail | null;
  source: "api" | "fallback";
};

export const NEWS_FILTER_CATEGORIES = [
  "Index",
  "Commodity",
  "Currencies",
  "Global & Ekonomi",
  "Fiscal & Moneter",
  "Analisis Market",
] as const;

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
const NEWS_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23111217'/%3E%3Crect x='30' y='30' width='1140' height='615' rx='28' fill='none' stroke='%23eab308' stroke-opacity='0.4' stroke-width='6'/%3E%3Ctext x='80' y='180' fill='%23eab308' font-family='Arial,sans-serif' font-size='56' font-weight='700'%3ELive Market News%3C/text%3E%3Ctext x='80' y='260' fill='%23f4f4f5' font-family='Arial,sans-serif' font-size='34'%3EPortal News feed placeholder%3C/text%3E%3C/svg%3E";
const PORTAL_NEWS_CACHE_DURATION_MS = 5 * 60 * 1000;
let portalNewsArticlesPromise: Promise<PortalNewsApiArticle[]> | null = null;
let portalNewsArticlesFetchedAt = 0;

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

function getArticleParagraphs(content: string) {
  return decodeHtmlEntities(content)
    .replace(
      /<(?:\/p|\/div|\/h[1-6]|br\s*\/?|\/li|\/ul|\/ol|\/blockquote|\/section)>/gi,
      "\n",
    )
    .replace(/<li[^>]*>/gi, "• ")
    .split(/\n+/)
    .map((paragraph) => normalizeWhitespace(stripHtml(paragraph)))
    .filter((paragraph) => paragraph.length > 0);
}

function getArticleTitle(article: PortalNewsApiArticle) {
  return article.titles?.sg ?? article.titles?.default ?? article.title;
}

function getPublishedAt(article: PortalNewsApiArticle) {
  return article.updated_at ?? article.created_at ?? "";
}

function getArticleImage(article: PortalNewsApiArticle) {
  const imagePath = article.images?.find((image) => image.trim().length > 0);

  if (!imagePath) {
    return NEWS_PLACEHOLDER_IMAGE;
  }

  return getNewsAssetUrl(imagePath);
}

function compareArticleDates(a: PortalNewsApiArticle, b: PortalNewsApiArticle) {
  const firstDate = new Date(getPublishedAt(a)).getTime();
  const secondDate = new Date(getPublishedAt(b)).getTime();

  if (!Number.isFinite(firstDate) && !Number.isFinite(secondDate)) {
    return 0;
  }

  if (!Number.isFinite(firstDate)) {
    return 1;
  }

  if (!Number.isFinite(secondDate)) {
    return -1;
  }

  return secondDate - firstDate;
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

function toDetailArticle(
  article: PortalNewsApiArticle,
  locale: AppLocale,
): NewsArticleDetail {
  const feedArticle = toFeedArticle(article);
  const body = getArticleParagraphs(article.content);

  return {
    ...feedArticle,
    body: body.length ? body : [feedArticle.summary],
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
    body: article.body,
    readTime: article.readTime,
    tags: article.tags,
  };
}

function getFallbackArticles(
  locale: AppLocale,
  limit: number,
): NewsFeedArticle[] {
  return getNewsPageContent(locale)
    .latest.articles.slice(0, limit)
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

async function fetchPortalNewsArticles(): Promise<PortalNewsApiArticle[]> {
  if (!NEWS_API_TOKEN) {
    return [];
  }

  const isCacheFresh =
    portalNewsArticlesPromise !== null &&
    Date.now() - portalNewsArticlesFetchedAt < PORTAL_NEWS_CACHE_DURATION_MS;

  if (isCacheFresh && portalNewsArticlesPromise) {
    return portalNewsArticlesPromise;
  }

  portalNewsArticlesPromise = new Promise<PortalNewsApiArticle[]>(
    (resolve, reject) => {
      const requestUrl = new URL(NEWS_API_URL);
      const httpRequest = request(
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
              portalNewsArticlesPromise = null;
              reject(new Error(`News API responded with ${statusCode}`));
              return;
            }

            try {
              const payload = JSON.parse(
                responseBody,
              ) as PortalNewsApiResponse;
              portalNewsArticlesFetchedAt = Date.now();

              resolve(
                payload.status === "success" && Array.isArray(payload.data)
                  ? payload.data.slice().sort(compareArticleDates)
                  : [],
              );
            } catch (error) {
              portalNewsArticlesPromise = null;
              reject(error);
            }
          });
        },
      );

      httpRequest.on("error", (error) => {
        portalNewsArticlesPromise = null;
        reject(error);
      });

      httpRequest.end();
    },
  );

  return portalNewsArticlesPromise;
}

export async function getNewsFeed(
  locale: AppLocale,
  limit?: number,
): Promise<NewsFeedResult> {
  const fallbackLimit = limit ?? Number.MAX_SAFE_INTEGER;
  const fallbackArticles = getFallbackArticles(locale, fallbackLimit);

  if (!NEWS_API_TOKEN) {
    return {
      articles: fallbackArticles,
      source: "fallback",
    };
  }

  try {
    const rawArticles = (await fetchPortalNewsArticles()).map(toFeedArticle);
    const articles =
      typeof limit === "number" ? rawArticles.slice(0, limit) : rawArticles;

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
  } catch (error) {
    console.error("Failed to fetch news feed", error);

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

  if (!NEWS_API_TOKEN) {
    return {
      article: fallbackArticle,
      source: "fallback",
    };
  }

  try {
    const rawArticle = (await fetchPortalNewsArticles()).find(
      (article) => article.slug === slug,
    );

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
  } catch (error) {
    console.error("Failed to fetch news article", error);

    return {
      article: fallbackArticle,
      source: "fallback",
    };
  }
}
