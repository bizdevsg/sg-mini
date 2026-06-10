"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ChangeEvent, useState } from "react";

import { NEWS_FILTER_CATEGORIES, type NewsFeedArticle } from "@/lib/news";
import { formatLocaleDateTime, getMessages, type AppLocale } from "@/locales";

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
      <aside className="space-y-4">
        <div className="rounded-xl border border-yellow-500/50 p-4">
          <h4 className="mb-4 font-bold uppercase text-yellow-500">
            {labels.listTitle}
          </h4>

          {categories.length ? (
            <>
              {/* Mobile Dropdown */}
              <div className="xl:hidden">
                <select
                  value={selectedCategory ?? ""}
                  onChange={(e) => handleCategoryChange(e.target.value || null)}
                  className="w-full rounded-lg border border-yellow-500/20 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">{labels.allCategories}</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category, categoryLabels)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop Sidebar */}
              <ul className="hidden space-y-3 xl:block">
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(null)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      !selectedCategory
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "text-white hover:bg-yellow-500/8"
                    }`}
                  >
                    {labels.allCategories}
                  </button>
                </li>

                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        selectedCategory === category
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "text-white hover:bg-yellow-500/8"
                      }`}
                    >
                      {getCategoryLabel(category, categoryLabels)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-gray-400">{emptyBodyText}</p>
          )}

          <p className="mt-4 text-xs text-gray-400">{summaryText}</p>
        </div>
      </aside>

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
                <article key={article.id} className="h-full">
                  <Link
                    href={`/${locale}/news/${article.slug}`}
                    className="group flex gap-4 rounded-2xl border border-white/10 bg-zinc-950/40 p-4 transition-all duration-300 hover:border-yellow-500/40 hover:bg-zinc-900/40"
                  >
                    <img
                      src={article.imageSrc}
                      alt={article.title}
                      className="h-28 w-36 shrink-0 rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-yellow-500/15 px-2.5 py-1 text-[11px] font-medium text-yellow-400">
                          {article.displayCategory}
                        </span>

                        <span className="text-[11px] text-zinc-500">
                          {formatLocaleDateTime(article.publishedAt, locale)}
                        </span>
                      </div>

                      <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-yellow-400">
                        {article.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                        {article.summary}
                      </p>

                      <div className="mt-auto pt-3">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-yellow-400">
                          {browserLabels.readArticle}
                          <span className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.04] p-6">
            <h2 className="text-xl font-bold text-white">
              {labels.emptyTitle}
            </h2>
            <p className="mt-2 text-sm text-gray-400">{emptyBodyText}</p>
          </div>
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

      {isFilterModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
          onClick={handleCloseFilterModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-filter-title"
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#090909]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                  <FontAwesomeIcon icon={["fas", "sliders"]} />
                </div>

                <div>
                  <h3
                    id="news-filter-title"
                    className="text-lg font-semibold text-white"
                  >
                    {filterModalLabels.title}
                  </h3>

                  <p className="text-sm text-zinc-500">
                    {filterModalLabels.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label={filterModalLabels.close}
                onClick={handleCloseFilterModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Sort */}
              <div>
                <p className="mb-3 text-sm font-semibold text-yellow-400">
                  {filterModalLabels.sortBy}
                </p>

                <div className="grid gap-3">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDraftSort(option.value)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                        draftSort === option.value
                          ? "border-yellow-500 bg-yellow-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <span className="text-sm text-white">{option.label}</span>

                      <div
                        className={`h-5 w-5 rounded-full border-2 transition ${
                          draftSort === option.value
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Period */}
              <div>
                <p className="mb-3 text-sm font-semibold text-yellow-400">
                  {filterModalLabels.period}
                </p>

                <div className="grid gap-3">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDraftPeriod(option.value)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                        draftPeriod === option.value
                          ? "border-yellow-500 bg-yellow-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <span className="text-sm text-white">{option.label}</span>

                      <div
                        className={`h-5 w-5 rounded-full border-2 transition ${
                          draftPeriod === option.value
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full rounded-xl bg-yellow-500 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
              >
                {filterModalLabels.apply}
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-3 w-full rounded-xl border border-white/10 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
              >
                {filterModalLabels.reset}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
