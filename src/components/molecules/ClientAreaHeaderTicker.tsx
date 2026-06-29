import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type {
  BreakingNewsItem,
  DashboardCopy,
} from "@/components/organisms/client-area.types";

type ClientAreaHeaderTickerProps = {
  copy: DashboardCopy;
  currentNews: BreakingNewsItem;
  clockLabel: string;
};

export function ClientAreaHeaderTicker({
  copy,
  currentNews,
  clockLabel,
}: ClientAreaHeaderTickerProps) {
  return (
    <header className="rounded-[2rem] border border-zinc-800/80 bg-black/80 px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.32)] backdrop-blur-md">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5">
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-yellow-500">
            {copy.breakingLabel}
          </span>
          <div className="h-3 w-px shrink-0 bg-zinc-700" />
          <div className="min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 whitespace-nowrap text-xs text-zinc-300 transition-all duration-500">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              <span className="truncate">
                {currentNews.title} | {currentNews.timeAgo}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-4 text-xs text-zinc-400 md:flex">
          <span>
            <FontAwesomeIcon icon={["far", "clock"]} className="mr-1" />
            {clockLabel}
          </span>
          <div className="rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-300">
            {copy.languageLabel}
          </div>
        </div>
      </div>
    </header>
  );
}
