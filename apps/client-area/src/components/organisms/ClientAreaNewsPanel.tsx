"use client";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaArticleCard } from "@/components/molecules/ClientAreaArticleCard";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import type {
  ArticleItem,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import type { NewsCategory } from "@/lib/news.shared";
import { getMessages, type AppLocale } from "@/locales";

const CLIENT_AREA_NEWS_PAGE_SIZE = 6;
const ALL_NEWS_FILTER_ID = "all";

type ClientAreaNewsPanelProps = {
  articles?: ArticleItem[];
  /** Categories from the portal (GET /api/v1/berita/categories). */
  categories?: NewsCategory[];
  copy: DashboardCopy;
  locale: AppLocale;
};

type NewsFilter = {
  id: string;
  label: string;
  /** Category name an article's `category` is compared with (case-insensitive). */
  name: string;
};

function normalizeCategory(value: string) {
  return value.trim().toLowerCase();
}

// Filters come from the portal's category list. If that list could not be loaded,
// fall back to the categories found on the articles themselves — never to
// keyword guesses.
function buildNewsFilters(
  categories: NewsCategory[] | undefined,
  articles: ArticleItem[],
): NewsFilter[] {
  if (categories && categories.length > 0) {
    return categories.map((category) => ({
      id: category.slug,
      label: category.name,
      name: category.name,
    }));
  }

  const seen = new Map<string, NewsFilter>();

  for (const article of articles) {
    const key = normalizeCategory(article.category);

    if (key && !seen.has(key)) {
      seen.set(key, { id: key, label: article.category, name: article.category });
    }
  }

  return [...seen.values()];
}

export function ClientAreaNewsPanel({
  articles,
  categories,
  copy,
  locale,
}: ClientAreaNewsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_NEWS_FILTER_ID);
  const resolvedArticles = articles && articles.length > 0 ? articles : copy.articles;
  const newsFilters = [
    {
      id: ALL_NEWS_FILTER_ID,
      label: locale === "id" ? "Semua" : "All",
      name: "",
    },
    ...buildNewsFilters(categories, resolvedArticles),
  ];
  const activeFilterName =
    newsFilters.find((filter) => filter.id === activeFilter)?.name ?? "";
  const filteredArticles = resolvedArticles.filter(
    (article) =>
      activeFilter === ALL_NEWS_FILTER_ID ||
      normalizeCategory(article.category) === normalizeCategory(activeFilterName),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / CLIENT_AREA_NEWS_PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * CLIENT_AREA_NEWS_PAGE_SIZE;
  const visibleArticles = filteredArticles.slice(
    pageStartIndex,
    pageStartIndex + CLIENT_AREA_NEWS_PAGE_SIZE,
  );
  const paginationLabels = getMessages(locale).newsPage.pagination;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, resolvedArticles.length]);

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "newspaper"]} />
        {copy.newsTitle}
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        {newsFilters.map((filter) => {
          const isActive = filter.id === activeFilter;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 sm:w-auto ${isActive
                ? "border-yellow-500 bg-linear-to-b from-[#FF9600] to-[#FFDE00] text-black"
                : "border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-yellow-500/50 hover:text-yellow-400"
                }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {visibleArticles.map((article) => (
          <ClientAreaArticleCard
            key={article.id ?? article.title}
            article={article}
            href={
              article.slug ? `/${locale}/client-area/news/${article.slug}` : undefined
            }
          />
        ))}

        {visibleArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-400">
            Belum ada artikel untuk filter ini.
          </div>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <PaginationControls
          className="border-t border-zinc-800 pt-4"
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          nextLabel={paginationLabels.next}
          onNext={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
          onPrevious={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          previousLabel={paginationLabels.previous}
          summary={`${paginationLabels.summary} ${safeCurrentPage} / ${totalPages}`}
        />
      ) : null}
    </div>
  );
}
