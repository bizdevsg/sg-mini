"use client";

import { memo, useEffect, useState } from "react";

import type {
  BreakingNewsItem,
} from "@/components/organisms/client-area.types";
import { Zap } from "lucide-react";

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
    <div className="select-none flex items-center gap-2">
      <div className="items-center gap-3 sm:shrink-0 hidden md:flex">
        <div className="bg-yellow-500 rounded-full p-1">
          <Zap className="text-black h-4 w-4" />
        </div>

        <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-yellow-500">
          {breakingLabel}
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-2 w-full overflow-hidden rounded-[20px] border border-zinc-800 bg-linear-to-b from-zinc-500/20 to-zinc-500/10 px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-3 sm:py-2">
        <div className="relative min-w-0 flex-1 overflow-hidden py-0.5">
          <div
            key={`${activeNews.id ?? activeNews.title}-${activeIndex}`}
            className="flex items-start gap-2 text-sm text-zinc-300 animate-[ticker-slide-left-in_320ms_cubic-bezier(0.22,1,0.36,1)] sm:items-center"
          >
            <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500 sm:mt-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <span className="block line-clamp-2 leading-snug sm:line-clamp-1 sm:leading-none">
                  {activeNews.title}
                </span>
              </div>

              <span className="shrink-0 text-[11px] leading-none text-zinc-500 sm:text-xs">
                {activeNews.timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
