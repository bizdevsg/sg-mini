"use client";

import { memo } from "react";

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

      <div className="flex min-w-0 flex-col gap-2 w-full overflow-hidden rounded-full border border-zinc-800 bg-linear-to-b from-zinc-500/20 to-zinc-500/10 py-3 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:py-2">
        <div className="relative min-w-0 flex-1 rounded-full overflow-hidden py-0.5">
          <div className="client-area-header-news-track text-sm text-zinc-300">
            {[false, true].map((isDuplicate) => (
              <div
                key={isDuplicate ? "duplicate" : "primary"}
                aria-hidden={isDuplicate || undefined}
                className="client-area-header-news-group"
              >
                {breakingNews.map((news, index) => (
                  <div
                    key={`${news.id ?? news.title}-${index}`}
                    className="flex shrink-0 items-center gap-2 pr-8"
                  >
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    <span className="whitespace-nowrap leading-none">
                      {news.title}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-[11px] leading-none text-zinc-500 sm:text-xs">
                      {news.timeAgo}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
