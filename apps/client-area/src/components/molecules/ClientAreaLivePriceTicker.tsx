"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, Newspaper } from "lucide-react";

import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import type { LiveQuotePayload, LiveQuoteTick } from "@/lib/live-quotes";
import type { NewsFeedArticle } from "@/lib/news.shared";
import type { AppLocale } from "@/locales";

type ClientAreaLivePriceTickerProps = {
  label: string;
  latestNews: NewsFeedArticle[];
  locale: AppLocale;
  newsLabel: string;
};

type TickerInstrument = {
  label: string;
  symbols: string[];
};

const TICKER_INSTRUMENTS: TickerInstrument[] = [
  {
    label: "XUL10",
    symbols: ["XUL10", "XUL10_BBJ"],
  },
  {
    label: "BCO10",
    symbols: ["BCO10", "BCO10_BBJ"],
  },
  {
    label: "HKK50",
    symbols: ["HKK50", "HKK50_BBJ"],
  },
  {
    label: "JPK50",
    symbols: ["JPK50", "JPK50_BBJ"],
  },
];

function resolveTickerTick(
  quotes: LiveQuotePayload,
  instrument: TickerInstrument,
): LiveQuoteTick | undefined {
  for (const symbol of instrument.symbols) {
    if (quotes[symbol]) {
      return quotes[symbol];
    }
  }
}

function resolveTickerPrice(tick?: LiveQuoteTick) {
  return tick?.price || "--";
}

function parseTickerPrice(value?: string) {
  if (!value) {
    return null;
  }

  const parsedValue = Number.parseFloat(value.replace(/,/g, "").trim());
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function resolveTickerDirection(tick?: LiveQuoteTick) {
  const currentPrice = parseTickerPrice(resolveTickerPrice(tick));
  const openPrice = parseTickerPrice(tick?.oprice);

  if (currentPrice === null || openPrice === null) {
    return null;
  }

  const isUp = currentPrice > openPrice;

  if (isUp) {
    return {
      Icon: ArrowUp,
      className: "text-emerald-400",
    };
  }

  return {
    Icon: ArrowDown,
    className: "text-rose-400",
  };
}

export function ClientAreaLivePriceTicker({
  label,
  latestNews,
  locale,
  newsLabel,
}: ClientAreaLivePriceTickerProps) {
  const { quotes } = useLiveQuoteStream();
  const priceItems = TICKER_INSTRUMENTS.map((instrument) => ({
    ...instrument,
    tick: resolveTickerTick(quotes, instrument),
  }));
  const newsItems = latestNews.slice(0, 5);

  return (
    <section
      aria-label={label}
      className="flex min-w-0 items-stretch overflow-hidden border-y border-white/8 shadow-lg shadow-black/10"
    >
      <div className="min-w-0 flex-1 overflow-hidden py-2.5">
        <div className="client-area-live-price-track">
          {[0, 1].map((groupIndex) => (
            <div
              key={groupIndex}
              aria-hidden={groupIndex === 1}
              className="client-area-live-price-group"
            >
              {[0, 1].map((sequenceIndex) => (
                <div
                  aria-hidden={sequenceIndex === 1}
                  className="contents"
                  key={`${groupIndex}-${sequenceIndex}`}
                >
                  {priceItems.map(({ label: symbolLabel, tick }) => {
                    const direction = resolveTickerDirection(tick);
                    const DirectionIcon = direction?.Icon;

                    return (
                      <div
                        key={`${groupIndex}-${sequenceIndex}-${symbolLabel}`}
                        className="flex shrink-0 items-center gap-2 px-5 sm:px-8"
                      >
                        <span className="text-xs font-black tracking-wide text-zinc-100 sm:text-sm">
                          {symbolLabel}
                        </span>
                        <span
                          className={`font-mono text-xs font-bold tabular-nums sm:text-sm ${direction?.className ?? "text-zinc-500"}`}
                        >
                          {resolveTickerPrice(tick)}
                        </span>
                        {DirectionIcon ? (
                          <DirectionIcon
                            aria-hidden="true"
                            className={`h-3.5 w-3.5 ${direction?.className ?? ""}`}
                          />
                        ) : null}
                      </div>
                    );
                  })}

                  {newsItems.map((article) => (
                    <Link
                      className="flex max-w-md shrink-0 items-center gap-2 border-l border-white/10 px-5 text-xs text-zinc-300 transition hover:text-amber-400 sm:px-8 sm:text-sm"
                      href={`/${locale}/client-area/news/${article.slug}`}
                      key={`${groupIndex}-${sequenceIndex}-${article.id}`}
                      prefetch={false}
                      tabIndex={
                        groupIndex === 1 || sequenceIndex === 1 ? -1 : undefined
                      }
                    >
                      <Newspaper
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-amber-400"
                      />
                      <span className="shrink-0 font-bold uppercase tracking-wide text-amber-400">
                        {newsLabel}
                      </span>
                      <span className="truncate">{article.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
