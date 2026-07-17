"use client";

import { useEffect, useState } from "react";

import { EmptyStatePanel } from "@/components/molecules/EmptyStatePanel";
import { HistoricalDataMetricCard } from "@/components/molecules/HistoricalDataMetricCard";
import { HistoricalDataRecordCard } from "@/components/molecules/HistoricalDataRecordCard";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
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

type HistoricalDataMetricCardItem = {
  label: string;
  value: string;
  valueClassName?: string;
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
  const metricCards: HistoricalDataMetricCardItem[] = [
    {
      label: labels.records,
      value: String(filteredRecords.length),
    },
    {
      label: labels.categories,
      value: String(categories.length),
    },
    {
      label: labels.latestDate,
      value: latestDate ? formatHistoricalDate(latestDate, locale) : "-",
      valueClassName: "text-lg font-bold text-yellow-500",
    },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {metricCards.map((metricCard) => (
          <ScrollReveal
            key={metricCard.label}
            effect="fade-up"
          >
            <HistoricalDataMetricCard
              label={metricCard.label}
              value={metricCard.value}
              valueClassName={metricCard.valueClassName}
            />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal effect="fade-up">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category}
              effect="fade-left"
              delay={index * 100}
            >
              <button
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${selectedCategory === category
                  ? "border-yellow-500 bg-yellow-500 text-black"
                  : "border-line bg-white/5 text-foreground/78 hover:border-yellow-500/60 hover:text-yellow-400"
                  }`}
              >
                {category}
              </button>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {visibleRecords.length === 0 ? (
        <EmptyStatePanel body={labels.empty} />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {visibleRecords.map((record, index) => (
              <ScrollReveal
                key={record.id}
                effect="fade-up"
                delay={index * 150}
              >
                <HistoricalDataRecordCard
                  locale={locale}
                  record={record}
                  labels={labels}
                  formatDate={formatHistoricalDate}
                />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
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
          </ScrollReveal>

          <PaginationControls
            previousLabel={labels.previous}
            nextLabel={labels.next}
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPrevious={() =>
              setCurrentPage((currentPageValue) =>
                Math.max(1, currentPageValue - 1),
              )
            }
            onNext={() =>
              setCurrentPage((currentPageValue) =>
                Math.min(totalPages, currentPageValue + 1),
              )
            }
            summary={
              <>
                {labels.showing} {startIndex + 1} {labels.to}{" "}
                {startIndex + visibleRecords.length} {labels.ofRecords}{" "}
                {filteredRecords.length}
              </>
            }
            centerContent={
              <div className="rounded-full border border-line px-4 py-2 text-sm text-foreground/72">
                {labels.page} {safeCurrentPage} {labels.of} {totalPages}
              </div>
            }
          />
        </>
      )
      }
    </div >
  );
}
