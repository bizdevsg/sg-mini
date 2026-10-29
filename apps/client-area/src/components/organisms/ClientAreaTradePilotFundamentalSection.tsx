"use client";

import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { ClientAreaEconomicCalendarCard } from "@/components/molecules/ClientAreaEconomicCalendarCard";
import { ClientAreaTradePilotFundamentalNewsItem } from "@/components/molecules/ClientAreaTradePilotFundamentalNewsItem";
import type { ClientAreaTradePilotFundamentalContextCopy } from "@/lib/client-area-trade-pilot.shared";
import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";
import type {
  TradePilotFundamentalNews,
  TradePilotFundamentalNewsItem,
  TradePilotInstrumentId,
} from "@/lib/trade-pilot/trade-pilot.types";
import { getMessages, type AppLocale } from "@/locales";

type FundamentalTab = "news" | "calendar";

type ClientAreaTradePilotFundamentalSectionProps = {
  copy: ClientAreaTradePilotFundamentalContextCopy;
  events: EconomicCalendarEvent[];
  /** Diisi hanya saat sumber data TradePilot = api; berita diambil dari backend. */
  instrumentId?: TradePilotInstrumentId;
  locale: AppLocale;
};

export function ClientAreaTradePilotFundamentalSection({
  copy,
  events,
  instrumentId,
  locale,
}: ClientAreaTradePilotFundamentalSectionProps) {
  const [apiNews, setApiNews] = useState<TradePilotFundamentalNewsItem[] | null>(null);
  const [newsReloadKey, setNewsReloadKey] = useState(0);

  useEffect(() => {
    if (!instrumentId) return;
    const controller = new AbortController();
    void fetch(
      `/api/client-area/trade-pilot/fundamental-news?instrumentId=${instrumentId}&limit=5`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error("fundamental_news_failed");
        return response.json() as Promise<TradePilotFundamentalNews>;
      })
      .then((news) => setApiNews(news.items))
      .catch(() => undefined);
    return () => controller.abort();
  }, [instrumentId, newsReloadKey]);

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FundamentalTab>("news");
  const [isRefreshing, startRefreshTransition] = useTransition();
  const newsHref = `/${locale}/client-area/news`;
  const economicCalendarHref = `/${locale}/economic-calendar`;
  const calendarCopy = getMessages(locale).economicCalendarBrowser;
  const isNewsTabActive = activeTab === "news";

  const handleRefresh = () => {
    startRefreshTransition(() => {
      setNewsReloadKey((value) => value + 1);
      router.refresh();
    });
  };

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            {copy.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            {copy.description}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm px-5 py-2.5 font-semibold text-zinc-300 transition hover:border-amber-500/60 hover:text-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw
            className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {copy.refreshLabel}
        </button>
      </div>

      <div
        className="mt-6 grid gap-3 md:grid-cols-2"
        role="tablist"
        aria-label={copy.title}
      >
        <button
          type="button"
          role="tab"
          aria-selected={isNewsTabActive}
          onClick={() => setActiveTab("news")}
          className={`flex items-center justify-center gap-3 rounded-2xl px-5 py-5 font-bold text-zinc-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            isNewsTabActive
              ? "border-2 border-amber-500 bg-amber-500/10"
              : "border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm hover:border-amber-500/60"
          }`}
        >
          <Newspaper className="h-5 w-5" />
          <span>{copy.latestNewsLabel}</span>
          <ChevronDown
            className={`ml-auto h-5 w-5 transition-transform ${
              isNewsTabActive ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isNewsTabActive}
          onClick={() => setActiveTab("calendar")}
          className={`flex items-center justify-center gap-3 rounded-2xl px-5 py-5 font-bold text-zinc-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            !isNewsTabActive
              ? "border-2 border-amber-500 bg-amber-500/10"
              : "border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm hover:border-amber-500/60"
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>{copy.economicCalendarLabel}</span>
          <ChevronRight
            className={`ml-auto h-5 w-5 transition-transform ${
              !isNewsTabActive ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <div className="mt-7" role="tabpanel">
        {isNewsTabActive ? (
          <div className="space-y-7">
            {instrumentId && apiNews && apiNews.length > 0
              ? apiNews.map((item) => (
                  <ClientAreaTradePilotFundamentalNewsItem
                    key={item.id}
                    external
                    href={item.url}
                    publishedAt={formatPublishedAt(item.publishedAt, locale)}
                    source={item.source}
                    title={item.title}
                  />
                ))
              : copy.items.map((item, index) => (
                  <ClientAreaTradePilotFundamentalNewsItem
                    key={`${item.source}-${index}`}
                    href={newsHref}
                    publishedAt={item.publishedAt}
                    source={item.source}
                    title={item.title}
                  />
                ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-3">
            {events.slice(0, 5).map((event) => (
              <ClientAreaEconomicCalendarCard
                key={event.id}
                actualLabel={calendarCopy.actual}
                event={event}
                forecastLabel={calendarCopy.forecast}
                previousLabel={calendarCopy.previous}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-8 text-center text-sm text-zinc-400">
            {calendarCopy.empty}
          </div>
        )}
      </div>

      <Link
        href={isNewsTabActive ? newsHref : economicCalendarHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-300"
      >
        <BookOpen className="h-4 w-4" />
        {copy.learnLabel}
      </Link>
    </section>
  );
}

function formatPublishedAt(value: string, locale: AppLocale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
