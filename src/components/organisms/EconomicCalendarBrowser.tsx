"use client";

import { useState } from "react";

import {
  ECONOMIC_CALENDAR_RANGE_KEYS,
  type EconomicCalendarEvent,
  type EconomicCalendarOverview,
  type EconomicCalendarRangeKey,
} from "@/lib/economic-calendar";
import {
  formatLocaleDateTime,
  getMessages,
  getLocaleConfig,
  type AppLocale,
} from "@/locales";

type EconomicCalendarBrowserProps = {
  locale: AppLocale;
  overview: EconomicCalendarOverview;
};

const PAGE_SIZE = 20;

function formatCalendarDate(value: string, locale: AppLocale) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(getLocaleConfig(locale).intl, {
    dateStyle: "medium",
    timeZone: getLocaleConfig(locale).timeZone,
  }).format(parsedDate);
}

function getEventGroupDateLabel(
  value: string | null,
  locale: AppLocale,
  fallbackLabel: string,
) {
  if (!value) {
    return fallbackLabel;
  }

  return formatCalendarDate(value, locale);
}

function getCountryBadge(currency: string) {
  const normalizedCurrency = currency.toUpperCase().replace(/\./g, "");

  const badges: Record<string, string> = {
    US: "US",
    USD: "US",
    EUR: "EU",
    GBP: "GB",
    JPN: "JP",
    AUD: "AU",
    NZD: "NZ",
    CAD: "CA",
    CHF: "CH",
    CHN: "CN",
  };

  return badges[normalizedCurrency] ?? currency.slice(0, 2).toUpperCase();
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

function EventDetailList({
  event,
  labels,
}: {
  event: EconomicCalendarEvent;
  labels: {
    source: string;
    measures: string;
    effect: string;
    frequency: string;
    nextRelease: string;
    notes: string;
    whyCare: string;
  };
}) {
  const detailItems = [
    { label: labels.source, value: event.details.sources },
    { label: labels.measures, value: event.details.measures },
    { label: labels.effect, value: event.details.usualEffect },
    { label: labels.frequency, value: event.details.frequency },
    { label: labels.nextRelease, value: event.details.nextReleased },
    { label: labels.notes, value: event.details.notes },
    { label: labels.whyCare, value: event.details.whyTraderCare },
  ];

  return (
    <div className="rounded-xl border border-line bg-black/20 p-5">
      <div className="space-y-5">
        {detailItems.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
              {item.label}:
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/78">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventHistoryTable({
  event,
  locale,
  labels,
}: {
  event: EconomicCalendarEvent;
  locale: AppLocale;
  labels: {
    date: string;
    previous: string;
    forecast: string;
    actual: string;
    noHistory: string;
  };
}) {
  if (event.details.history.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-white/5 px-4 py-4 text-sm text-foreground/58">
        {labels.noHistory}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white/5">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-white/5">
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.date}
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.previous}
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.forecast}
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.actual}
            </th>
          </tr>
        </thead>
        <tbody>
          {event.details.history.map((historyEntry, index) => (
            <tr
              key={`${event.id}-${historyEntry.date}`}
              className={
                index % 2 === 0 ? "bg-white/[0.08]" : "bg-white/[0.03]"
              }
            >
              <td className="px-4 py-3 text-sm text-foreground/78">
                {formatCalendarDate(historyEntry.date, locale)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-foreground/78">
                {historyEntry.previous}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-foreground/78">
                {historyEntry.forecast}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-foreground/78">
                {historyEntry.actual}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExpandedEventPanel({
  event,
  locale,
  labels,
}: {
  event: EconomicCalendarEvent;
  locale: AppLocale;
  labels: {
    source: string;
    measures: string;
    effect: string;
    frequency: string;
    nextRelease: string;
    notes: string;
    whyCare: string;
    date: string;
    previous: string;
    forecast: string;
    actual: string;
    noHistory: string;
  };
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.96fr)]">
      <EventDetailList event={event} labels={labels} />
      <EventHistoryTable event={event} locale={locale} labels={labels} />
    </div>
  );
}

export function EconomicCalendarBrowser({
  locale,
  overview,
}: EconomicCalendarBrowserProps) {
  const labels = getMessages(locale).economicCalendarBrowser;

  const [activeRange, setActiveRange] =
    useState<EconomicCalendarRangeKey>("today");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const activeData = overview[activeRange];
  const activeEvents = activeData.events;
  const totalPages = Math.max(1, Math.ceil(activeEvents.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleEvents = activeEvents.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {ECONOMIC_CALENDAR_RANGE_KEYS.map((rangeKey) => {
          const range = overview[rangeKey];
          const isActive = activeRange === rangeKey;

          return (
            <button
              key={rangeKey}
              type="button"
              onClick={() => {
                setActiveRange(rangeKey);
                setSelectedEventId(null);
                setCurrentPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "border-yellow-500 bg-yellow-500 text-black"
                  : "border-line bg-white/5 text-foreground/78 hover:border-yellow-500/60 hover:text-yellow-400"
              }`}
            >
              {labels.tabs[rangeKey]}{" "}
              <span
                className={isActive ? "text-black/70" : "text-foreground/55"}
              >
                ({range.total})
              </span>
              {range.status !== "success"
                ? ` - ${labels.statusUnavailable}`
                : ""}
            </button>
          );
        })}
      </div>

      {activeData.status !== "success" ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-8 text-sm text-rose-200">
          {labels.unavailable}
        </div>
      ) : activeEvents.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/5 px-5 py-8 text-sm text-foreground/58">
          {labels.empty}
        </div>
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
                    className={`overflow-hidden rounded-2xl border transition-colors ${
                      isSelected
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
                            {getCountryBadge(event.currency)}
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
                            {labels.actual}: {event.actual}
                          </p>
                        </div>
                      </div>
                    </button>

                    {isSelected ? (
                      <div className="border-t border-line px-4 py-4">
                        <ExpandedEventPanel
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
            <div className="grid grid-cols-[120px_150px_110px_minmax(0,1fr)_110px] gap-3 px-4 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
              <div>{labels.time}</div>
              <div>{labels.country}</div>
              <div>{labels.impact}</div>
              <div>{labels.event}</div>
              <div className="text-right">{labels.expand}</div>
            </div>

            <div className="space-y-3">
              {visibleEvents.map((event, index) => {
                const isSelected = selectedEventId === event.id;
                const previousEvent = visibleEvents[index - 1];
                const hasDateGroupChanged =
                  index === 0 || previousEvent?.date !== event.date;

                return (
                  <div key={event.id} className="space-y-3">
                    {hasDateGroupChanged ? (
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-line" />
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
                      className={`overflow-hidden rounded-2xl border transition-colors ${
                        isSelected
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
                          <span className="inline-flex min-w-12 justify-center rounded-md border border-line bg-white/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/72">
                            {getCountryBadge(event.currency)}
                          </span>
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
                            {labels.actual}: {event.actual}
                          </p>
                        </div>

                        <div className="text-right text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">
                          {isSelected ? labels.collapse : labels.expand}
                        </div>
                      </button>

                      {isSelected ? (
                        <div className="border-t border-line px-4 py-4">
                          <ExpandedEventPanel
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
          </div>

          {activeEvents.length > PAGE_SIZE ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-foreground/58">
                {labels.page} {safeCurrentPage} {labels.of} {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((pageValue) => Math.max(1, pageValue - 1));
                    setSelectedEventId(null);
                  }}
                  disabled={safeCurrentPage === 1}
                  className="rounded-full border border-line px-4 py-2 text-sm text-foreground/78 transition-colors hover:border-yellow-500/60 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {labels.previousPage}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((pageValue) =>
                      Math.min(totalPages, pageValue + 1),
                    );
                    setSelectedEventId(null);
                  }}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded-full border border-line px-4 py-2 text-sm text-foreground/78 transition-colors hover:border-yellow-500/60 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {labels.nextPage}
                </button>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-foreground/62">
            {activeData.updatedAt
              ? formatLocaleDateTime(activeData.updatedAt, locale)
              : ""}
          </div>
        </>
      )}
    </div>
  );
}
