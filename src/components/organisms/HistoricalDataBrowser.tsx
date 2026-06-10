"use client";

import { useEffect, useState } from "react";

import { type HistoricalDataRecord } from "@/lib/historical-data";
import {
  formatLocaleNumber,
  getLocaleConfig,
  getMessages,
  type AppLocale,
} from "@/locales";

type HistoricalDataBrowserProps = {
  locale: AppLocale;
  records: HistoricalDataRecord[];
};

const PAGE_SIZE = 25;
const PRIORITY_CATEGORY = "LGD Daily";

function getCategorySortPriority(category: string) {
  if (category === PRIORITY_CATEGORY) {
    return 0;
  }

  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("daily")) {
    return 1;
  }

  const commodityKeywords = [
    "commodity",
    "commodit",
    "gold",
    "silver",
    "oil",
    "crude",
    "brent",
    "metal",
    "bullion",
    "lgd",
  ];
  const currencyKeywords = [
    "currenc",
    "forex",
    "fx",
    "aud",
    "eur",
    "gbp",
    "usd",
    "jpy",
    "cad",
    "chf",
    "nzd",
  ];

  if (
    commodityKeywords.some((keyword) => normalizedCategory.includes(keyword))
  ) {
    return 2;
  }

  if (
    currencyKeywords.some((keyword) => normalizedCategory.includes(keyword))
  ) {
    return 3;
  }

  return 4;
}

function formatHistoricalDate(value: string, locale: AppLocale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    dateStyle: "medium",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(date);
}

export function HistoricalDataBrowser({
  locale,
  records,
}: HistoricalDataBrowserProps) {
  const labels = getMessages(locale).historicalDataBrowser;

  const categories = Array.from(
    new Set(records.map((record) => record.category)),
  ).sort((left, right) => {
    const priorityDiff =
      getCategorySortPriority(left) - getCategorySortPriority(right);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return left.localeCompare(right);
  });
  const [selectedCategory, setSelectedCategory] = useState(
    categories.includes(PRIORITY_CATEGORY)
      ? PRIORITY_CATEGORY
      : (categories[0] ?? ""),
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (categories.length === 0) {
      if (selectedCategory !== "") {
        setSelectedCategory("");
      }
      return;
    }

    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(
        categories.includes(PRIORITY_CATEGORY)
          ? PRIORITY_CATEGORY
          : categories[0],
      );
      setCurrentPage(1);
    }
  }, [categories, selectedCategory]);

  const filteredRecords = records.filter(
    (record) => record.category === selectedCategory,
  );
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );
  const latestDate = records[0]?.tanggal;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
            {labels.records}
          </p>
          <p className="mt-2 text-2xl font-bold text-yellow-500">
            {filteredRecords.length}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
            {labels.categories}
          </p>
          <p className="mt-2 text-2xl font-bold text-yellow-500">
            {categories.length}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
            {labels.latestDate}
          </p>
          <p className="mt-2 text-lg font-bold text-yellow-500">
            {latestDate ? formatHistoricalDate(latestDate, locale) : "-"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryChange(category)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              selectedCategory === category
                ? "border-yellow-500 bg-yellow-500 text-black"
                : "border-line bg-white/5 text-foreground/78 hover:border-yellow-500/60 hover:text-yellow-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleRecords.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/5 px-5 py-8 text-sm text-foreground/58">
          {labels.empty}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {visibleRecords.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-line bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
                      {labels.category}
                    </p>
                    <p className="mt-1 text-base font-bold text-yellow-500">
                      {record.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
                      {labels.date}
                    </p>
                    <p className="mt-1 text-sm text-foreground/78">
                      {formatHistoricalDate(record.tanggal, locale)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-line bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                      {labels.open}
                    </p>
                    <p className="mt-1 font-mono text-foreground/78">
                      {formatLocaleNumber(record.open, locale)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                      {labels.high}
                    </p>
                    <p className="mt-1 font-mono text-foreground/78">
                      {formatLocaleNumber(record.high, locale)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                      {labels.low}
                    </p>
                    <p className="mt-1 font-mono text-foreground/78">
                      {formatLocaleNumber(record.low, locale)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-black/20 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                      {labels.close}
                    </p>
                    <p className="mt-1 font-mono text-foreground/78">
                      {formatLocaleNumber(record.close, locale)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-line bg-black/20 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                    {labels.note}
                  </p>
                  <p className="mt-1 text-sm text-foreground/72">
                    {record.isBankHoliday
                      ? labels.bankHoliday
                      : record.description || labels.noNote}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-line md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {labels.date}
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {labels.category}
                    </th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {labels.open}
                    </th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {labels.high}
                    </th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {labels.low}
                    </th>
                    <th className="px-4 py-3 text-center text-xs uppercase tracking-[0.14em] text-foreground/55">
                      {labels.close}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-line align-middle odd:bg-white/0 even:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 text-sm text-foreground/78">
                        {formatHistoricalDate(record.tanggal, locale)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-yellow-500">
                        {record.category}
                      </td>
                      {record.isBankHoliday ? (
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-center font-semibold text-foreground/62"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm">
                              ~ {labels.bankHoliday} ~
                            </span>
                            <span className="text-xs">
                              {record.description}
                            </span>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(record.open, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(record.high, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(record.low, locale)}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-sm text-foreground/78">
                            {formatLocaleNumber(record.close, locale)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground/58">
              {labels.showing} {startIndex + 1} {labels.to}{" "}
              {startIndex + visibleRecords.length} {labels.ofRecords}{" "}
              {filteredRecords.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((currentPageValue) =>
                    Math.max(1, currentPageValue - 1),
                  )
                }
                disabled={safeCurrentPage === 1}
                className="rounded-full border border-line px-4 py-2 text-sm text-foreground/78 transition-colors hover:border-yellow-500/60 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.previous}
              </button>

              <div className="rounded-full border border-line px-4 py-2 text-sm text-foreground/72">
                {labels.page} {safeCurrentPage} {labels.of} {totalPages}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((currentPageValue) =>
                    Math.min(totalPages, currentPageValue + 1),
                  )
                }
                disabled={safeCurrentPage === totalPages}
                className="rounded-full border border-line px-4 py-2 text-sm text-foreground/78 transition-colors hover:border-yellow-500/60 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.next}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
