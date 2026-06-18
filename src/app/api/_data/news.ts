import "server-only";

import { request } from "node:https";
import { unstable_cache } from "next/cache";

import { NEWS_API_TOKEN, NEWS_API_URL } from "@/lib/env";

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

type PortalNewsApiResponse = {
  status: string;
  data?: PortalNewsApiArticle[];
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

const SUMMARY_MAX_LENGTH = 220;

function compareArticleDates(a: PortalNewsApiArticle, b: PortalNewsApiArticle) {
  const firstDate = new Date(a.updated_at ?? a.created_at ?? "").getTime();
  const secondDate = new Date(b.updated_at ?? b.created_at ?? "").getTime();

  if (!Number.isFinite(firstDate) && !Number.isFinite(secondDate)) {
    return 0;
  }

  if (!Number.isFinite(firstDate)) {
    return 1;
  }

  if (!Number.isFinite(secondDate)) {
    return -1;
  }

  return firstDate - secondDate;
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

function getArticleTitle(article: PortalNewsApiArticle) {
  return article.titles?.sg ?? article.titles?.default ?? article.title;
}

function toPortalNewsFeedEntry(article: PortalNewsApiArticle): PortalNewsFeedEntry {
  return {
    id: String(article.id),
    title: getArticleTitle(article),
    slug: article.slug,
    summary: getArticleSummary(article),
    categoryName: article.kategori?.name?.trim() || "",
    publishedAt: article.updated_at ?? article.created_at ?? "",
    imagePath:
      article.images?.find((image) => image.trim().length > 0) ?? null,
  };
}

async function requestPortalNewsArticles(): Promise<PortalNewsApiArticle[]> {
  if (!NEWS_API_TOKEN) {
    return [];
  }

  return new Promise<PortalNewsApiArticle[]>((resolve, reject) => {
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
            reject(new Error(`News API responded with ${statusCode}`));
            return;
          }

          try {
            const payload = JSON.parse(responseBody) as PortalNewsApiResponse;

            resolve(
              payload.status === "success" && Array.isArray(payload.data)
                ? payload.data.slice().sort(compareArticleDates)
                : [],
            );
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    httpRequest.on("error", (error) => {
      reject(error);
    });

    httpRequest.end();
  });
}

const getCachedPortalNewsFeedEntries = unstable_cache(
  async () => {
    const articles = await requestPortalNewsArticles();
    return articles.map(toPortalNewsFeedEntry);
  },
  ["portal-news-feed-entries"],
  {
    revalidate: 300,
  },
);

export async function getPortalNewsFeedEntries() {
  return getCachedPortalNewsFeedEntries();
}

export async function getPortalNewsArticleBySlug(slug: string) {
  const articles = await requestPortalNewsArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}
