"use client";

import { memo, useEffect, useState } from "react";

import type {
  BreakingNewsItem,
} from "@/components/organisms/client-area.types";

type ClientAreaHeaderTickerProps = {
  breakingLabel: string;
  breakingNews: BreakingNewsItem[];
};

export const ClientAreaHeaderTicker = memo(function ClientAreaHeaderTicker({
  breakingLabel,
  breakingNews,
}: ClientAreaHeaderTickerProps) {
  if (breakingNews.length === 0) {
    return null;
  }

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (breakingNews.length <= 1) {
      return;
    }

    const rotationTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % breakingNews.length);
    }, 4500);

    return () => {
      window.clearInterval(rotationTimer);
    };
  }, [breakingNews.length]);

  const activeNews = breakingNews[activeIndex];

  return (
    <div className="rounded-[28px] bg-yellow-500/10 p-2 sm:rounded-full select-none">
      <div className="flex min-w-0 flex-col gap-2 overflow-hidden rounded-[24px] border border-zinc-800 bg-zinc-900/60 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-4 sm:py-1.5">
        <div className="flex items-center gap-3 sm:shrink-0">
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-yellow-500">
            {breakingLabel}
          </span>
          <div className="h-3 w-px shrink-0 bg-zinc-700 sm:block" />
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden py-0.5">
          <div
            key={`${activeNews.id ?? activeNews.title}-${activeIndex}`}
            className="flex items-start gap-2 text-sm text-zinc-300 animate-[ticker-slide-left-in_320ms_cubic-bezier(0.22,1,0.36,1)] sm:items-center"
          >
            <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500 sm:mt-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <span className="block truncate leading-snug sm:leading-none">
                  {activeNews.title}
                </span>
              </div>

              <span className="shrink-0 text-xs leading-none text-zinc-500">
                {activeNews.timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
