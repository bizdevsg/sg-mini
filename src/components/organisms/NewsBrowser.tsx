"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useState } from "react";

import { EmptyStatePanel } from "@/components/molecules/EmptyStatePanel";
import { NewsCategoryFilter } from "@/components/molecules/NewsCategoryFilter";
import { NewsFeedArticleCard } from "@/components/molecules/NewsFeedArticleCard";
import { NewsFilterModal } from "@/components/molecules/NewsFilterModal";
import {
  NEWS_FILTER_CATEGORIES,
  type NewsFeedArticle,
} from "@/lib/news.shared";
import { getMessages, type AppLocale } from "@/locales";

type NewsBrowserProps = {
  articles: NewsFeedArticle[];
  locale: AppLocale;
  source: "api" | "fallback";
  labels: {
    listTitle: string;
    allCategories: string;
    filter: string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyBody: string;
    pagination: {
      previous: string;
      next: string;
      summary: string;
    };
  };
};

const NEWS_PAGE_SIZE = 14;
const EAGER_IMAGE_COUNT = 2;
const DEFAULT_SORT = "newest";
const DEFAULT_PERIOD = "all";

type SortOption = "newest" | "oldest";
type PeriodOption = "all" | "today" | "week" | "month";

function getCategoryLabel(
  category: (typeof NEWS_FILTER_CATEGORIES)[number],
  categoryLabels: Record<string, string>,
) {
  return categoryLabels[category] ?? category;
}

function getSummaryText(
  browserLabels: ReturnType<typeof getMessages>["newsBrowser"],
  source: "api" | "fallback",
  selectedCategory: string | null,
  totalItems: number,
  categoryLabels: Record<string, string>,
) {
  const selectedCategoryLabel = selectedCategory
    ? getCategoryLabel(
        selectedCategory as (typeof NEWS_FILTER_CATEGORIES)[number],
        categoryLabels,
      )
    : null;

  if (selectedCategoryLabel) {
    return `${totalItems} ${browserLabels.summary.articlesInCategory} ${selectedCategoryLabel}`;
  }

  return source === "api"
    ? `${totalItems} ${browserLabels.summary.available}`
    : browserLabels.summary.fallback;
}

function getPaginationSummary(
  template: string,
  currentPage: number,
  totalPages: number,
) {
  return template
    .replace("{current}", String(currentPage))
    .replace("{total}", String(totalPages));
}

function normalizeSearchText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function parsePublishedTimestamp(value: string) {
  const directTimestamp = new Date(value).getTime();

  if (Number.isFinite(directTimestamp)) {
    return directTimestamp;
  }

  const normalizedTimestamp = new Date(value.replace(" ", "T")).getTime();

  return Number.isFinite(normalizedTimestamp) ? normalizedTimestamp : null;
}

function getStartOfToday(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getStartOfWeek(date: Date) {
  const startOfToday = getStartOfToday(date);
  const mondayBasedDay = (startOfToday.getDay() + 6) % 7;

  startOfToday.setDate(startOfToday.getDate() - mondayBasedDay);

  return startOfToday;
}

function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function matchesPeriodFilter(
  article: NewsFeedArticle,
  period: PeriodOption,
  now: Date,
) {
  if (period === "all") {
    return true;
  }

  const publishedTimestamp = parsePublishedTimestamp(article.publishedAt);

  if (publishedTimestamp === null) {
    return false;
  }

  if (period === "today") {
    return publishedTimestamp >= getStartOfToday(now).getTime();
  }

  if (period === "week") {
    return publishedTimestamp >= getStartOfWeek(now).getTime();
  }

  return publishedTimestamp >= getStartOfMonth(now).getTime();
}

function compareArticlesByDate(
  left: NewsFeedArticle,
  right: NewsFeedArticle,
  direction: "asc" | "desc",
) {
  const leftTimestamp = parsePublishedTimestamp(left.publishedAt) ?? 0;
  const rightTimestamp = parsePublishedTimestamp(right.publishedAt) ?? 0;

  return direction === "asc"
    ? leftTimestamp - rightTimestamp
    : rightTimestamp - leftTimestamp;
}

export function NewsBrowser({
  articles,
  locale,
  source,
  labels,
}: NewsBrowserProps) {
  const browserLabels = getMessages(locale).newsBrowser;
  const categoryLabels = browserLabels.categories;
  const categories = NEWS_FILTER_CATEGORIES;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedSort, setAppliedSort] = useState<SortOption>(DEFAULT_SORT);
  const [appliedPeriod, setAppliedPeriod] =
    useState<PeriodOption>(DEFAULT_PERIOD);
  const [draftSort, setDraftSort] = useState<SortOption>(DEFAULT_SORT);
  const [draftPeriod, setDraftPeriod] = useState<PeriodOption>(DEFAULT_PERIOD);
  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  const now = new Date();
  const filterModalLabels = browserLabels.filterModal;
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "newest", label: filterModalLabels.newest },
    { value: "oldest", label: filterModalLabels.oldest },
  ];
  const periodOptions: Array<{ value: PeriodOption; label: string }> = [
    { value: "all", label: filterModalLabels.all },
    { value: "today", label: filterModalLabels.today },
    { value: "week", label: filterModalLabels.week },
    { value: "month", label: filterModalLabels.month },
  ];

  const filteredArticles = articles.filter((article) => {
    if (selectedCategory && article.category !== selectedCategory) {
      return false;
    }

    if (normalizedSearchQuery) {
      const searchableText = [article.title, article.displayCategory]
        .join(" ")
        .toLocaleLowerCase();

      if (!searchableText.includes(normalizedSearchQuery)) {
        return false;
      }
    }

    return matchesPeriodFilter(article, appliedPeriod, now);
  });
  const sortedArticles = filteredArticles.slice().sort((left, right) => {
    if (appliedSort === "oldest") {
      return compareArticlesByDate(left, right, "asc");
    }

    return compareArticlesByDate(left, right, "desc");
  });
  const totalPages = Math.max(
    1,
    Math.ceil(sortedArticles.length / NEWS_PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * NEWS_PAGE_SIZE;
  const visibleArticles = sortedArticles.slice(
    pageStartIndex,
    pageStartIndex + NEWS_PAGE_SIZE,
  );
  const summaryText = getSummaryText(
    browserLabels,
    source,
    selectedCategory,
    sortedArticles.length,
    categoryLabels,
  );
  const paginationSummary = getPaginationSummary(
    browserLabels.pagination.template,
    safeCurrentPage,
    totalPages,
  );
  const emptyBodyText =
    selectedCategory || normalizedSearchQuery || appliedPeriod !== "all"
      ? browserLabels.emptyFiltered
      : labels.emptyBody;

  function handleCategoryChange(category: string | null) {
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }

  function handleOpenFilterModal() {
    setDraftSort(appliedSort);
    setDraftPeriod(appliedPeriod);
    setIsFilterModalOpen(true);
  }

  function handleCloseFilterModal() {
    setIsFilterModalOpen(false);
  }

  function handleApplyFilters() {
    setAppliedSort(draftSort);
    setAppliedPeriod(draftPeriod);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  }

  function handleResetFilters() {
    setDraftSort(DEFAULT_SORT);
    setDraftPeriod(DEFAULT_PERIOD);
    setAppliedSort(DEFAULT_SORT);
    setAppliedPeriod(DEFAULT_PERIOD);
    setCurrentPage(1);
  }

  function handlePreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function handleNextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_3fr]">
      <NewsCategoryFilter
        title={labels.listTitle}
        allCategoriesLabel={labels.allCategories}
        categories={categories}
        selectedCategory={selectedCategory}
        categoryLabels={categoryLabels}
        summaryText={summaryText}
        emptyBodyText={emptyBodyText}
        onCategoryChange={handleCategoryChange}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleOpenFilterModal}
            className="rounded-lg bg-yellow-500 p-3 text-zinc-800 sm:px-6 sm:py-2"
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={["fas", "sliders"]} />
              <span className="hidden sm:block">{labels.filter}</span>
            </div>
          </button>

          <div className="flex h-11 w-full items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4">
            <FontAwesomeIcon
              icon={["fas", "magnifying-glass"]}
              className="text-sm text-yellow-500"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchPlaceholder}
              className="flex-1 border-none bg-transparent text-sm text-yellow-500 outline-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {visibleArticles.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleArticles.map((article, index) => {
              const shouldPrioritizeImage = index < EAGER_IMAGE_COUNT;

              return (
                <NewsFeedArticleCard
                  key={article.id}
                  article={article}
                  locale={locale}
                  readMoreLabel={browserLabels.readArticle}
                  prioritizeImage={shouldPrioritizeImage}
                />
              );
            })}
          </div>
        ) : (
          <EmptyStatePanel
            title={labels.emptyTitle}
            body={emptyBodyText}
            className="border-yellow-500/20 bg-yellow-500/[0.04] text-gray-400"
          />
        )}

        {sortedArticles.length > NEWS_PAGE_SIZE ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] px-4 py-3">
            <p className="text-sm text-gray-300">{paginationSummary}</p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={safeCurrentPage === 1}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  safeCurrentPage === 1
                    ? "pointer-events-none border-yellow-500/10 text-gray-600"
                    : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                }`}
              >
                {labels.pagination.previous}
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={safeCurrentPage === totalPages}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  safeCurrentPage === totalPages
                    ? "pointer-events-none border-yellow-500/10 text-gray-600"
                    : "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                }`}
              >
                {labels.pagination.next}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <NewsFilterModal
        isOpen={isFilterModalOpen}
        labels={filterModalLabels}
        sortOptions={sortOptions}
        periodOptions={periodOptions}
        draftSort={draftSort}
        draftPeriod={draftPeriod}
        onDraftSortChange={(value) => setDraftSort(value as SortOption)}
        onDraftPeriodChange={(value) => setDraftPeriod(value as PeriodOption)}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
}
