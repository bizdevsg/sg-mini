"use client";

import { useEffect, useRef, useState } from "react";

import { EmptyStatePanel } from "@/components/molecules/EmptyStatePanel";
import { EconomicCalendarExpandedEventPanel } from "@/components/molecules/EconomicCalendarExpandedEventPanel";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import {
  formatCalendarDate,
  getActualValueColorClassName,
  getEventGroupDateLabel,
} from "@/components/organisms/economic-calendar-browser.shared";
import {
  createEmptyEconomicCalendarRange,
  ECONOMIC_CALENDAR_RANGE_KEYS,
  type EconomicCalendarOverview,
  type EconomicCalendarRangeData,
  type EconomicCalendarRangeKey,
} from "@/lib/economic-calendar.shared";
import {
  hydrateEconomicCalendarStoreFromSessionStorage,
  readEconomicCalendarStoreEntry,
  writeEconomicCalendarStoreEntry,
} from "@/lib/economic-calendar-client-store";
import {
  formatLocaleDateTime,
  getMessages,
  type AppLocale,
} from "@/locales";
import { ScrollReveal } from "../molecules/ScrollReveal";

type EconomicCalendarBrowserProps = {
  locale: AppLocale;
  overview: EconomicCalendarOverview;
};

const PAGE_SIZE = 20;
const ECONOMIC_CALENDAR_CLIENT_STALE_MS = 30_000;
const ECONOMIC_CALENDAR_REFRESH_INTERVAL_MS = 30_000;
type PaginationItem = number | "...";

async function fetchEconomicCalendarRange(
  rangeKey: EconomicCalendarRangeKey,
): Promise<EconomicCalendarRangeData> {
  const response = await fetch(`/api/economic-calendar/${rangeKey}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch economic calendar ${rangeKey}: ${response.status}`,
    );
  }

  return (await response.json()) as EconomicCalendarRangeData;
}

function getVisiblePaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function isRangeDataReady(rangeData: EconomicCalendarRangeData) {
  return rangeData.status === "success";
}

function isStoreEntryFresh(fetchedAt: number) {
  return Date.now() - fetchedAt < ECONOMIC_CALENDAR_CLIENT_STALE_MS;
}

function getCountryFlagCode(currency: string) {
  const normalizedCurrency = currency.toUpperCase().replace(/\./g, "");

  const countryCodes: Record<string, string> = {
    US: "us",
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPN: "jp",
    JPY: "jp",
    AUD: "au",
    NZD: "nz",
    CAD: "ca",
    CHF: "ch",
    CHN: "cn",
    CNY: "cn",
    CNH: "cn",
  };

  return countryCodes[normalizedCurrency] ?? "xx";
}

function getImpactColorClassName(impactScore: number) {
  if (impactScore >= 3) {
    return "text-rose-400";
  }

  if (impactScore === 2) {
    return "text-amber-400";
  }

  return "text-emerald-400";
}

function getImpactSurfaceClassName(impactScore: number) {
  if (impactScore >= 3) {
    return "border-rose-500/25 bg-rose-500/10";
  }

  if (impactScore === 2) {
    return "border-amber-500/25 bg-amber-500/10";
  }

  return "border-emerald-500/25 bg-emerald-500/10";
}

export function EconomicCalendarBrowser({
  locale,
  overview,
}: EconomicCalendarBrowserProps) {
  const labels = getMessages(locale).economicCalendarBrowser;
  const browserRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const activeRangeRef = useRef<EconomicCalendarRangeKey>("today");

  const [activeRange, setActiveRange] =
    useState<EconomicCalendarRangeKey>("today");
  const [rangeOverview, setRangeOverview] = useState(overview);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    activeRangeRef.current = activeRange;
  }, [activeRange]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    hydrateEconomicCalendarStoreFromSessionStorage();

    setRangeOverview((currentOverview) => {
      const nextOverview = { ...currentOverview };
      let hasChanged = false;

      for (const rangeKey of ECONOMIC_CALENDAR_RANGE_KEYS) {
        const currentRange = currentOverview[rangeKey];
        const storedEntry = readEconomicCalendarStoreEntry(rangeKey);

        if (!storedEntry) {
          if (isRangeDataReady(currentRange)) {
            writeEconomicCalendarStoreEntry(rangeKey, currentRange);
          }

          continue;
        }

        if (
          currentRange.status !== "success" ||
          currentRange.updatedAt !== storedEntry.data.updatedAt
        ) {
          nextOverview[rangeKey] = storedEntry.data;
          hasChanged = true;
        }
      }

      return hasChanged ? nextOverview : currentOverview;
    });
  }, []);

  useEffect(() => {
    for (const rangeKey of ECONOMIC_CALENDAR_RANGE_KEYS) {
      const rangeData = overview[rangeKey];

      if (isRangeDataReady(rangeData)) {
        writeEconomicCalendarStoreEntry(rangeKey, rangeData);
      }
    }
  }, [overview]);

  const activeRangeStatus = rangeOverview[activeRange].status;

  useEffect(() => {
    const currentRangeData = rangeOverview[activeRange];
    const storedEntry = readEconomicCalendarStoreEntry(activeRange);
    const hasFreshStoredData =
      storedEntry !== null && isStoreEntryFresh(storedEntry.fetchedAt);
    const shouldShowLoadingState =
      currentRangeData.status === "idle" && !hasFreshStoredData;
    const shouldSkipFetch =
      isRangeDataReady(currentRangeData) &&
      storedEntry !== null &&
      storedEntry.data.updatedAt === currentRangeData.updatedAt &&
      isStoreEntryFresh(storedEntry.fetchedAt);

    if (shouldSkipFetch) {
      return;
    }

    if (shouldShowLoadingState) {
      setRangeOverview((currentOverview) => ({
        ...currentOverview,
        [activeRange]: createEmptyEconomicCalendarRange(activeRange, "loading"),
      }));
    }

    void fetchEconomicCalendarRange(activeRange)
      .then((data) => {
        if (!isMountedRef.current) {
          return;
        }

        writeEconomicCalendarStoreEntry(activeRange, data);
        setRangeOverview((currentOverview) => ({
          ...currentOverview,
          [activeRange]: data,
        }));
      })
      .catch(() => {
        if (!isMountedRef.current) {
          return;
        }

        setRangeOverview((currentOverview) => ({
          ...currentOverview,
          [activeRange]:
            currentOverview[activeRange].status === "success"
              ? currentOverview[activeRange]
              : createEmptyEconomicCalendarRange(activeRange),
        }));
      });
  }, [activeRange, activeRangeStatus, rangeOverview]);

  useEffect(() => {
    function refreshActiveRange() {
      if (document.visibilityState !== "visible") {
        return;
      }

      const rangeKey = activeRangeRef.current;

      void fetchEconomicCalendarRange(rangeKey)
        .then((data) => {
          if (!isMountedRef.current) {
            return;
          }

          writeEconomicCalendarStoreEntry(rangeKey, data);
          setRangeOverview((currentOverview) => ({
            ...currentOverview,
            [rangeKey]: data,
          }));
        })
        .catch(() => {
          // Keep the current snapshot if background refresh fails.
        });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshActiveRange();
      }
    }

    const intervalId = window.setInterval(
      refreshActiveRange,
      ECONOMIC_CALENDAR_REFRESH_INTERVAL_MS,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  const activeData = rangeOverview[activeRange];
  const activeEvents = activeData.events;
  const totalPages = Math.max(1, Math.ceil(activeEvents.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleEvents = activeEvents.slice(startIndex, startIndex + PAGE_SIZE);
  const paginationItems = getVisiblePaginationItems(safeCurrentPage, totalPages);

  function scrollToBrowserTop() {
    if (typeof window === "undefined") {
      return;
    }

    const browserTop = browserRef.current?.getBoundingClientRect().top;

    if (typeof browserTop !== "number") {
      return;
    }

    window.scrollTo({
      top: Math.max(0, window.scrollY + browserTop - 96),
      behavior: "smooth",
    });
  }

  return (
    <div ref={browserRef} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ECONOMIC_CALENDAR_RANGE_KEYS.map((rangeKey, index) => {
          const range = rangeOverview[rangeKey];
          const isActive = activeRange === rangeKey;

          return (
            <ScrollReveal key={rangeKey} effect="fade-left" delay={index * 100}>
              <button
                type="button"
                onClick={() => {
                  setActiveRange(rangeKey);
                  setSelectedEventId(null);
                  setCurrentPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${isActive
                  ? "border-yellow-500 bg-yellow-500 text-black"
                  : "border-line bg-white/5 text-foreground/78 hover:border-yellow-500/60 hover:text-yellow-400"
                  }`}
              >
                {labels.tabs[rangeKey]}
              </button>
            </ScrollReveal>
          );
        })}
      </div>

      {activeData.status === "idle" || activeData.status === "loading" ? (
        <EmptyStatePanel body={labels.loading} />
      ) : activeData.status !== "success" ? (
        <EmptyStatePanel body={labels.unavailable} variant="warning" />
      ) : activeEvents.length === 0 ? (
        <EmptyStatePanel body={labels.empty} />
      ) : (
        <>
          <div className="grid gap-4 md:hidden">
            {visibleEvents.map((event, index) => {
              const isSelected = selectedEventId === event.id;
              const previousEvent = visibleEvents[index - 1];
              const hasDateGroupChanged =
                index === 0 || previousEvent?.date !== event.date;

              return (
                <div key={event.id} className="">
                  {hasDateGroupChanged ? (
                    <div className="flex items-center gap-3 px-1">
                      <div className="rounded-full border border-line bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/72">
                        {getEventGroupDateLabel(
                          event.date,
                          locale,
                          labels.today,
                        )}
                      </div>
                      <div className="h-px flex-1 bg-line" />
                    </div>
                  ) : null}

                  <article
                    className={`overflow-hidden rounded-2xl border transition-colors ${isSelected
                      ? "border-yellow-500/50 bg-white/[0.06] shadow-[0_16px_36px_rgba(0,0,0,0.2)]"
                      : "border-line bg-white/[0.03]"
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEventId((currentEventId) =>
                          currentEventId === event.id ? null : event.id,
                        )
                      }
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-line bg-white/5 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg font-semibold text-foreground/88">
                            {event.displayTime}
                          </span>
                          <span className="inline-flex min-w-10 justify-center rounded-md border border-line bg-white/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/72">
                            <span
                              aria-hidden="true"
                              className={`fib fi-${getCountryFlagCode(event.currency)} h-3 w-4 overflow-hidden rounded-[2px]`}
                            />
                          </span>
                          <span className="text-sm font-semibold text-foreground/78">
                            {event.currency}
                          </span>
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
                          {isSelected ? labels.collapse : labels.expand}
                        </span>
                      </div>

                      <div className="grid grid-cols-[0.8fr_2.2fr] gap-3 px-4 py-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/62">
                            {labels.impact}
                          </p>
                          <span
                            className={`mt-2 inline-flex min-w-16 justify-center rounded-full border px-3 py-1 text-sm font-bold ${getImpactColorClassName(event.impactScore)} ${getImpactSurfaceClassName(event.impactScore)}`}
                          >
                            {event.impact}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/62">
                            {labels.event}
                          </p>
                          <p className="mt-2 text-base font-bold text-foreground">
                            {event.event}
                          </p>
                          <p className="mt-1 text-sm text-foreground/62">
                            {labels.previous}: {event.previous}
                          </p>
                          <p className="text-sm text-foreground/62">
                            {labels.forecast}: {event.forecast} |{" "}
                            {labels.actual}:{" "}
                            <span
                              className={`font-semibold ${getActualValueColorClassName(event.actual, event.previous)}`}
                            >
                              {event.actual}
                            </span>
                          </p>
                        </div>
                      </div>
                    </button>

                    {isSelected ? (
                      <div className="border-t border-line px-4 py-4">
                        <EconomicCalendarExpandedEventPanel
                          event={event}
                          locale={locale}
                          labels={labels}
                        />
                      </div>
                    ) : null}
                  </article>
                </div>
              );
            })}
          </div>

          <div className="hidden md:block">
            <ScrollReveal>
              <div className="grid grid-cols-[120px_150px_110px_minmax(0,1fr)_110px] gap-3 px-4 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
                <div>{labels.time}</div>
                <div>{labels.country}</div>
                <div>{labels.impact}</div>
                <div>{labels.event}</div>
                <div className="text-right">{labels.expand}</div>
              </div>
            </ScrollReveal>

            <div className="space-y-3">
              {visibleEvents.map((event, index) => {
                const isSelected = selectedEventId === event.id;
                const previousEvent = visibleEvents[index - 1];
                const hasDateGroupChanged =
                  index === 0 || previousEvent?.date !== event.date;

                return (
                  <div key={event.id} className="space-y-3">
                    <ScrollReveal>
                      {hasDateGroupChanged ? (
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 border border-line border-dashed" />
                          <div className="rounded-full border border-line bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/72">
                            {getEventGroupDateLabel(
                              event.date,
                              locale,
                              labels.today,
                            )}
                          </div>
                          <div className="h-px flex-1 border border-line border-dashed" />
                        </div>
                      ) : null}
                    </ScrollReveal>

                    <ScrollReveal>
                      <article
                        className={`overflow-hidden rounded-2xl border transition-colors ${isSelected
                          ? "border-yellow-500/50 bg-white/[0.06] shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                          : "border-line bg-white/[0.03] hover:border-yellow-500/25 hover:bg-white/[0.05]"
                          }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedEventId((currentEventId) =>
                              currentEventId === event.id ? null : event.id,
                            )
                          }
                          className="grid w-full grid-cols-[120px_150px_110px_minmax(0,1fr)_110px] items-center gap-3 px-4 py-4 text-left"
                        >
                          <div className="font-mono text-base font-semibold text-foreground/88">
                            {event.displayTime}
                          </div>

                          <div className="flex items-center gap-3 text-sm font-semibold text-foreground/88">
                            <span
                              aria-hidden="true"
                              className={`fib fi-${getCountryFlagCode(event.currency)} h-4 w-5 overflow-hidden rounded-[2px]`}
                            />
                            <span>{event.currency}</span>
                          </div>

                          <div>
                            <span
                              className={`inline-flex min-w-16 justify-center rounded-full border px-3 py-1 text-sm font-bold ${getImpactColorClassName(event.impactScore)} ${getImpactSurfaceClassName(event.impactScore)}`}
                            >
                              {event.impact}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-base font-bold text-foreground">
                              {event.event}
                            </p>
                            <p className="mt-1 truncate text-sm text-foreground/62">
                              {labels.previous}: {event.previous} |{" "}
                              {labels.forecast}: {event.forecast} |{" "}
                              {labels.actual}:{" "}
                              <span
                                className={`font-semibold ${getActualValueColorClassName(event.actual, event.previous)}`}
                              >
                                {event.actual}
                              </span>
                            </p>
                          </div>

                          <div className="text-right text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">
                            {isSelected ? labels.collapse : labels.expand}
                          </div>
                        </button>

                        {isSelected ? (
                          <div className="border-t border-line px-4 py-4">
                            <EconomicCalendarExpandedEventPanel
                              event={event}
                              locale={locale}
                              labels={labels}
                            />
                          </div>
                        ) : null}
                      </article>
                    </ScrollReveal>
                  </div>
                );
              })}
            </div>
          </div>

          {activeEvents.length > PAGE_SIZE ? (
            <PaginationControls
              centerControls
              previousLabel={labels.previousPage}
              nextLabel={labels.nextPage}
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPrevious={() => {
                setCurrentPage((pageValue) => Math.max(1, pageValue - 1));
                setSelectedEventId(null);
                scrollToBrowserTop();
              }}
              onNext={() => {
                setCurrentPage((pageValue) =>
                  Math.min(totalPages, pageValue + 1),
                );
                setSelectedEventId(null);
                scrollToBrowserTop();
              }}
              summary={
                <>
                  {labels.page} {safeCurrentPage} {labels.of} {totalPages}
                </>
              }
              centerContent={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {paginationItems.map((item, index) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${safeCurrentPage}-${index}`}
                        className="px-1 text-sm text-foreground/45"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setCurrentPage(item);
                          setSelectedEventId(null);
                          scrollToBrowserTop();
                        }}
                        aria-current={item === safeCurrentPage ? "page" : undefined}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors ${item === safeCurrentPage
                          ? "border-yellow-500 bg-yellow-500 text-black"
                          : "border-line text-foreground/78 hover:border-yellow-500/60 hover:text-yellow-400"
                          }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              }
            />
          ) : null}

          <ScrollReveal delay={700} effect="zoom-in">
            <div className="rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-foreground/62">
              {activeData.updatedAt
                ? formatLocaleDateTime(activeData.updatedAt, locale)
                : ""}
            </div>
          </ScrollReveal>
        </>
      )}
    </div>
  );
}
