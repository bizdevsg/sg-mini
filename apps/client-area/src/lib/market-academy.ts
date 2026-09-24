import "server-only";

import { MARKET_ACADEMY_API_URL } from "@/lib/env";
import type {
  MarketAcademyArticle,
  MarketAcademyArticleDetail,
  MarketAcademyArticleDetailResult,
  MarketAcademyFeedResult,
} from "@/lib/market-academy.shared";
import type { AppLocale } from "@/locales";

export type {
  MarketAcademyArticle,
  MarketAcademyArticleDetail,
  MarketAcademyArticleDetailResult,
  MarketAcademyFeedResult,
} from "@/lib/market-academy.shared";

type RawMarketAcademyArticle = {
  id: number;
  title?: string | null;
  link?: string | null;
  image?: string | null;
  category?: string | null;
  date?: string | null;
  summary?: string | null;
  detail?: string | null;
  published_at?: string | null;
};

type MarketAcademyApiResponse = {
  status?: string;
  data?: RawMarketAcademyArticle[];
};

const MARKET_ACADEMY_TIMEOUT_MS = 8000;
const MARKET_ACADEMY_REVALIDATE_SECONDS = 300;
const SUMMARY_MAX_LENGTH = 220;
const MARKET_ACADEMY_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23111217'/%3E%3Crect x='30' y='30' width='1140' height='615' rx='28' fill='none' stroke='%23eab308' stroke-opacity='0.4' stroke-width='6'/%3E%3Ctext x='80' y='180' fill='%23eab308' font-family='Arial,sans-serif' font-size='56' font-weight='700'%3EMarket Academy%3C/text%3E%3C/svg%3E";

function normalizeText(value: string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildBodyHtml(content: string) {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => normalizeWhitespace(paragraph))
    .filter((paragraph) => paragraph.length > 0);

  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function getArticleSlug(article: RawMarketAcademyArticle) {
  const normalizedLink = normalizeText(article.link);

  if (normalizedLink) {
    try {
      const segments = new URL(normalizedLink).pathname
        .split("/")
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);
      const lastSegment = segments[segments.length - 1];

      if (lastSegment) {
        return lastSegment;
      }
    } catch {
      // fall through to id below
    }
  }

  return String(article.id);
}

function getRouteSlugKey(slug: string) {
  const normalizedSlug = normalizeText(slug).toLowerCase();
  const externalIdMatch = normalizedSlug.match(/^(\d+)(?=-|$)/);

  return externalIdMatch?.[1] ?? normalizedSlug;
}

function mapArticle(article: RawMarketAcademyArticle): MarketAcademyArticle {
  const summarySource =
    normalizeText(article.summary) || normalizeText(article.detail);
  const category = normalizeText(article.category) || "Market Academy";

  return {
    id: String(article.id),
    title: normalizeText(article.title),
    slug: getArticleSlug(article),
    summary: truncateText(normalizeWhitespace(summarySource), SUMMARY_MAX_LENGTH),
    category,
    displayCategory: category,
    publishedAt: normalizeText(article.published_at) || normalizeText(article.date),
    imageSrc: normalizeText(article.image) || MARKET_ACADEMY_PLACEHOLDER_IMAGE,
  };
}

export function findMarketAcademyFeedArticleByRouteSlug(
  articles: MarketAcademyArticle[],
  slug: string,
) {
  const normalizedSlug = normalizeText(slug);

  const directMatch = articles.find((article) => article.slug === normalizedSlug);

  if (directMatch) {
    return directMatch;
  }

  const routeKey = getRouteSlugKey(normalizedSlug);

  return (
    articles.find((article) => getRouteSlugKey(article.slug) === routeKey) ?? null
  );
}

function mapArticleDetail(
  article: RawMarketAcademyArticle,
): MarketAcademyArticleDetail {
  const feedArticle = mapArticle(article);
  const rawDetail =
    normalizeText(article.detail) || normalizeText(article.summary);
  const bodyHtml =
    buildBodyHtml(rawDetail) || `<p>${escapeHtml(feedArticle.summary)}</p>`;

  return {
    ...feedArticle,
    bodyHtml,
  };
}

async function requestMarketAcademyArticles(
  locale: AppLocale,
): Promise<RawMarketAcademyArticle[]> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    MARKET_ACADEMY_TIMEOUT_MS,
  );

  try {
    const url = new URL(MARKET_ACADEMY_API_URL);
    url.searchParams.set("lang", locale);

    const response = await fetch(url.toString(), {
      next: {
        revalidate: MARKET_ACADEMY_REVALIDATE_SECONDS,
      },
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as MarketAcademyApiResponse;

    return payload.status === "success" && Array.isArray(payload.data)
      ? payload.data
      : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function compareArticlesByRecency(
  left: RawMarketAcademyArticle,
  right: RawMarketAcademyArticle,
) {
  const leftTimestamp = new Date(
    left.published_at ?? left.date ?? "",
  ).getTime();
  const rightTimestamp = new Date(
    right.published_at ?? right.date ?? "",
  ).getTime();
  const safeLeft = Number.isFinite(leftTimestamp) ? leftTimestamp : 0;
  const safeRight = Number.isFinite(rightTimestamp) ? rightTimestamp : 0;

  return safeRight - safeLeft;
}

export async function getMarketAcademyFeed(
  locale: AppLocale,
  limit?: number,
): Promise<MarketAcademyFeedResult> {
  const rawArticles = await requestMarketAcademyArticles(locale);

  if (!rawArticles.length) {
    return { articles: [], source: "empty" };
  }

  const sortedArticles = rawArticles.slice().sort(compareArticlesByRecency);
  const articles = sortedArticles
    .map(mapArticle)
    .slice(0, typeof limit === "number" ? limit : sortedArticles.length);

  return { articles, source: "api" };
}

export async function getMarketAcademyArticleBySlug(
  locale: AppLocale,
  slug: string,
): Promise<MarketAcademyArticleDetailResult> {
  const rawArticles = await requestMarketAcademyArticles(locale);
  const rawArticle = rawArticles.find(
    (article) => getArticleSlug(article) === slug,
  );

  if (!rawArticle) {
    return { article: null, source: "empty" };
  }

  return { article: mapArticleDetail(rawArticle), source: "api" };
}
