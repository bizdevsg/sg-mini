"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShieldX,
  Target,
  TrendingDown,
  TriangleAlert,
} from "lucide-react";

import { ClientAreaTradePilotPerformanceInsight } from "@/components/atoms/ClientAreaTradePilotPerformanceInsight";
import { ClientAreaTradePilotStatCard } from "@/components/atoms/ClientAreaTradePilotStatCard";
import { ClientAreaTradePilotInstrumentPerformance } from "@/components/molecules/ClientAreaTradePilotInstrumentPerformance";
import { ClientAreaTradePilotTimeframePerformanceTable } from "@/components/molecules/ClientAreaTradePilotTimeframePerformanceTable";
import type {
  ClientAreaTradePilotPerformanceHistoryCopy,
  ClientAreaTradePilotTimeframePerformance,
} from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotHistoryItem,
  TradePilotHistoryStatus,
} from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPlaceholderPanelProps = {
  analysisHref?: string;
  dateLocale?: string;
  description: string;
  performanceCopy?: ClientAreaTradePilotPerformanceHistoryCopy;
  title: string;
  histories?: TradePilotHistoryItem[];
  timeframePerformance?: ClientAreaTradePilotTimeframePerformance[];
};

type HistoryStatusFilter = "all" | TradePilotHistoryStatus;

const HISTORY_PAGE_SIZE = 5;
const HISTORY_STATUSES: TradePilotHistoryStatus[] = [
  "still_valid",
  "expired",
  "stop_loss",
  "take_profit_1",
  "take_profit_2",
  "invalid",
];

const HISTORY_STATUS_TONES: Record<TradePilotHistoryStatus, string> = {
  still_valid: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  expired: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  stop_loss: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  take_profit_1: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  take_profit_2: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  invalid: "border-orange-400/25 bg-orange-400/10 text-orange-300",
};

function interpolate(
  template: string,
  values: Record<string, number | string>,
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function historyStatusLabel(
  status: TradePilotHistoryStatus,
  copy: ClientAreaTradePilotPerformanceHistoryCopy,
): string {
  const labels: Record<TradePilotHistoryStatus, string> = {
    still_valid: copy.stats.stillValid,
    expired: copy.stats.expired,
    stop_loss: copy.stats.stopLoss,
    take_profit_1: copy.stats.takeProfitOne,
    take_profit_2: copy.stats.takeProfitTwo,
    invalid: copy.stats.invalid,
  };

  return labels[status];
}

function formatHistoryDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { date: value, time: "" };
  }

  return {
    date: new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      timeZone: "Asia/Jakarta",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date),
  };
}

export function ClientAreaTradePilotPlaceholderPanel({
  analysisHref = "../analisis",
  dateLocale = "id-ID",
  description,
  performanceCopy,
  title,
  histories = [],
  timeframePerformance = [],
}: ClientAreaTradePilotPlaceholderPanelProps) {
  const [activeTab, setActiveTab] = useState<"history" | "summary">("history");
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyStatus, setHistoryStatus] = useState<HistoryStatusFilter>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

  const countStatus = (status: TradePilotHistoryItem["status"]) =>
    histories.filter((item) => item.status === status).length;
  const stopLossCount = countStatus("stop_loss");
  const takeProfitCount = countStatus("take_profit_1") + countStatus("take_profit_2");
  const strongestWinRate = timeframePerformance
    .filter((row) => row.winRate !== null)
    .sort((left, right) => (right.winRate ?? 0) - (left.winRate ?? 0))[0];
  const mostExpired = [...timeframePerformance].sort(
    (left, right) => right.expired - left.expired,
  )[0];
  const mostStopLoss = [...timeframePerformance].sort(
    (left, right) => right.stopLoss - left.stopLoss,
  )[0];
  const statistics = performanceCopy
    ? [
        {
          featured: false,
          icon: Target,
          label: performanceCopy.stats.totalAnalysis,
          tone: "amber" as const,
          value: String(histories.length),
        },
        {
          featured: false,
          icon: Clock3,
          label: performanceCopy.stats.stillValid,
          tone: "sky" as const,
          value: String(countStatus("still_valid")),
        },
        {
          featured: false,
          icon: ShieldX,
          label: performanceCopy.stats.expired,
          tone: "orange" as const,
          value: String(countStatus("expired")),
        },
        {
          featured: false,
          icon: TrendingDown,
          label: performanceCopy.stats.stopLoss,
          tone: "rose" as const,
          value: String(stopLossCount),
        },
        {
          featured: false,
          icon: ShieldCheck,
          label: performanceCopy.stats.takeProfitOne,
          tone: "emerald" as const,
          value: String(countStatus("take_profit_1")),
        },
        {
          featured: false,
          icon: ShieldCheck,
          label: performanceCopy.stats.takeProfitTwo,
          tone: "teal" as const,
          value: String(countStatus("take_profit_2")),
        },
        {
          featured: false,
          icon: TriangleAlert,
          label: performanceCopy.stats.invalid,
          tone: "orange" as const,
          value: String(countStatus("invalid")),
        },
      ]
    : [];

  const filteredHistories = useMemo(() => {
    if (!performanceCopy) return [];

    const normalizedQuery = historyQuery.trim().toLocaleLowerCase(dateLocale);

    return [...histories]
      .filter((item) => historyStatus === "all" || item.status === historyStatus)
      .filter((item) => {
        if (!normalizedQuery) return true;

        const searchValue = [
          item.instrumentLabel,
          item.timeframeLabel,
          historyStatusLabel(item.status, performanceCopy),
          item.mode,
        ]
          .join(" ")
          .toLocaleLowerCase(dateLocale);

        return searchValue.includes(normalizedQuery);
      })
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
  }, [dateLocale, histories, historyQuery, historyStatus, performanceCopy]);

  if (!performanceCopy) {
    return (
      <section className="space-y-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-white sm:text-xl">{title}</h1>
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-[#101113] p-5 text-sm leading-6 text-zinc-400 sm:p-7">
          {description}
        </div>
      </section>
    );
  }

  const pageCount = Math.max(1, Math.ceil(filteredHistories.length / HISTORY_PAGE_SIZE));
  const safePage = Math.min(historyPage, pageCount);
  const pageStart = (safePage - 1) * HISTORY_PAGE_SIZE;
  const visibleHistories = filteredHistories.slice(
    pageStart,
    pageStart + HISTORY_PAGE_SIZE,
  );
  const resultStart = filteredHistories.length === 0 ? 0 : pageStart + 1;
  const resultEnd = Math.min(pageStart + HISTORY_PAGE_SIZE, filteredHistories.length);

  const selectHistoryStatus = (status: HistoryStatusFilter) => {
    setHistoryStatus(status);
    setHistoryPage(1);
  };

  return (
    <section className="space-y-4" aria-labelledby="trade-pilot-history-title">
      <div className="min-w-0">
        <h1
          id="trade-pilot-history-title"
          className="text-lg font-bold text-white sm:text-xl"
        >
          {title}
        </h1>
        <p className="mt-1 text-sm font-medium text-amber-300">
          {interpolate(performanceCopy.totalSummary, { count: histories.length })}
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-400 sm:text-sm">{description}</p>
      </div>

      <div
        className="grid grid-cols-2 rounded-xl border border-zinc-700/80 bg-[#101113]/70 p-1 backdrop-blur-xl"
        role="tablist"
        aria-label={title}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "summary"}
          onClick={() => setActiveTab("summary")}
          className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "summary"
              ? "border-amber-400/60 bg-amber-400/10 text-amber-300"
              : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {performanceCopy.summaryTabLabel}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "history"}
          onClick={() => setActiveTab("history")}
          className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "history"
              ? "border-amber-400/60 bg-amber-400/10 text-amber-300"
              : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {performanceCopy.historyTabLabel}
        </button>
      </div>

      {activeTab === "summary" ? (
        <div className="space-y-3" role="tabpanel">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[performanceCopy.allPeriodLabel, "7D", "30D", "90D"].map(
              (period, index) => (
                <button
                  key={period}
                  type="button"
                  className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    index === 0
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-zinc-700 text-zinc-400"
                  }`}
                >
                  {period}
                </button>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 xl:grid-cols-7">
            {statistics.map((statistic) => (
              <ClientAreaTradePilotStatCard
                key={statistic.label}
                featured={statistic.featured}
                icon={statistic.icon}
                label={statistic.label}
                tone={statistic.tone}
                value={statistic.value}
              />
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <ClientAreaTradePilotPerformanceInsight
              label={performanceCopy.consistentTimeframeLabel}
              value={
                strongestWinRate
                  ? `${strongestWinRate.timeframe} · ${strongestWinRate.winRate}%`
                  : "—"
              }
            />
            <ClientAreaTradePilotPerformanceInsight
              label={performanceCopy.mostExpiredLabel}
              value={mostExpired ? `${mostExpired.timeframe} · ${mostExpired.expired}` : "—"}
            />
            <ClientAreaTradePilotPerformanceInsight
              label={performanceCopy.mostStopLossLabel}
              value={mostStopLoss ? `${mostStopLoss.timeframe} · ${mostStopLoss.stopLoss}` : "—"}
            />
          </div>

          <ClientAreaTradePilotInstrumentPerformance
            copy={performanceCopy}
            sample={histories.length}
            stopLoss={stopLossCount}
            takeProfit={takeProfitCount}
          />
          <ClientAreaTradePilotTimeframePerformanceTable
            copy={performanceCopy}
            rows={timeframePerformance}
          />
        </div>
      ) : (
        <div className="space-y-4" role="tabpanel">
          <div className="overflow-hidden rounded-xl border border-zinc-700/80 bg-[#101113]/75 backdrop-blur-xl">
            <div className="flex min-h-11 items-stretch">
              <label className="flex min-w-0 flex-1 items-center gap-2 px-3 sm:px-4">
                <Search className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
                <span className="sr-only">{performanceCopy.history.searchPlaceholder}</span>
                <input
                  type="search"
                  value={historyQuery}
                  onChange={(event) => {
                    setHistoryQuery(event.target.value);
                    setHistoryPage(1);
                  }}
                  placeholder={performanceCopy.history.searchPlaceholder}
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </label>
              <button
                type="button"
                aria-expanded={isFilterOpen}
                aria-controls="trade-pilot-history-filters"
                onClick={() => setIsFilterOpen((current) => !current)}
                className={`flex shrink-0 items-center gap-2 border-l border-zinc-700/80 px-3 text-sm font-semibold transition-colors sm:px-5 ${
                  isFilterOpen || historyStatus !== "all"
                    ? "bg-amber-400/10 text-amber-300"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Filter className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{performanceCopy.history.filterLabel}</span>
                {historyStatus !== "all" ? (
                  <span className="size-1.5 rounded-full bg-amber-300" aria-hidden="true" />
                ) : null}
              </button>
            </div>

            {isFilterOpen ? (
              <div
                id="trade-pilot-history-filters"
                className="border-t border-zinc-700/80 p-3 sm:p-4"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  {performanceCopy.history.filterTitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["all", ...HISTORY_STATUSES] as HistoryStatusFilter[]).map((status) => {
                    const isActive = historyStatus === status;
                    const label =
                      status === "all"
                        ? performanceCopy.history.allStatusLabel
                        : historyStatusLabel(status, performanceCopy);

                    return (
                      <button
                        key={status}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => selectHistoryStatus(status)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                          isActive
                            ? "border-amber-400 bg-amber-400/15 text-amber-300"
                            : "border-zinc-700 bg-zinc-900/60 text-zinc-400 hover:border-zinc-500 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {visibleHistories.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {visibleHistories.map((item) => {
                const timestamp = formatHistoryDate(item.createdAt, dateLocale);

                return (
                  <article
                    key={item.id}
                    className="group flex min-h-44 flex-col rounded-2xl border border-zinc-700/80 bg-[#101113]/75 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-colors hover:border-amber-400/35 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-white">
                            {item.instrumentLabel}
                          </h2>
                          <span className="rounded-md bg-zinc-800 px-2 py-1 text-[11px] font-semibold text-zinc-300">
                            {item.timeframeLabel}
                          </span>
                          <span className="rounded-md border border-zinc-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                            {item.mode}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={analysisHref}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:border-amber-300 hover:bg-amber-400/15"
                      >
                        <RefreshCcw className="size-3.5" aria-hidden="true" />
                        {performanceCopy.history.reanalyzeLabel}
                      </Link>
                    </div>

                    <div className="mt-5">
                      <span
                        className={`inline-flex rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${HISTORY_STATUS_TONES[item.status]}`}
                      >
                        {historyStatusLabel(item.status, performanceCopy)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div className="flex items-start gap-2 text-xs text-zinc-400">
                        <CalendarClock
                          className="mt-0.5 size-3.5 shrink-0 text-zinc-500"
                          aria-hidden="true"
                        />
                        <span>
                          <span className="block">{timestamp.date}</span>
                          <span className="mt-0.5 block text-zinc-500">{timestamp.time} WIB</span>
                        </span>
                      </div>
                      <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/60 transition-all group-hover:w-20" />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-[#101113]/70 px-5 py-12 text-center backdrop-blur-xl">
              <Search className="mx-auto size-8 text-zinc-600" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-white">
                {performanceCopy.history.emptyTitle}
              </h2>
              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-zinc-500">
                {performanceCopy.history.emptyDescription}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-zinc-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-white">
                {interpolate(performanceCopy.history.pageLabel, {
                  current: safePage,
                  total: pageCount,
                })}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {interpolate(performanceCopy.history.showingLabel, {
                  end: resultEnd,
                  start: resultStart,
                  total: filteredHistories.length,
                })}
              </p>
            </div>

            <nav
              className="grid grid-cols-2 gap-2 sm:flex"
              aria-label={interpolate(performanceCopy.history.pageLabel, {
                current: safePage,
                total: pageCount,
              })}
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setHistoryPage((current) => Math.max(1, current - 1))}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 text-xs font-semibold text-zinc-300 transition-colors hover:border-amber-400/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                {performanceCopy.history.previousLabel}
              </button>
              <div className="hidden items-center gap-1 sm:flex">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    aria-current={page === safePage ? "page" : undefined}
                    onClick={() => setHistoryPage(page)}
                    className={`size-10 rounded-lg border text-xs font-semibold transition-colors ${
                      page === safePage
                        ? "border-amber-400 bg-amber-400 text-black"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={safePage >= pageCount}
                onClick={() => setHistoryPage((current) => Math.min(pageCount, current + 1))}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-400/60 px-4 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500 disabled:opacity-40"
              >
                {performanceCopy.history.nextLabel}
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </section>
  );
}
