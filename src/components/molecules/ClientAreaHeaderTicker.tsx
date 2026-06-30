import type {
  BreakingNewsItem,
  DashboardCopy,
} from "@/components/organisms/client-area.types";

type ClientAreaHeaderTickerProps = {
  breakingNews: BreakingNewsItem[];
  copy: DashboardCopy;
};

export function ClientAreaHeaderTicker({
  breakingNews,
  copy,
}: ClientAreaHeaderTickerProps) {
  if (breakingNews.length === 0) {
    return null;
  }

  const marqueeItems = [...breakingNews, ...breakingNews];

  return (
    <div className="rounded-full p-2 bg-black">
      <div className="flex min-w-0 items-center gap-3 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-1.5">
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-yellow-500">
          {copy.breakingLabel}
        </span>
        <div className="h-3 w-px shrink-0 bg-zinc-700" />
        <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div
            className="flex w-max min-w-max items-center whitespace-nowrap py-0.5 text-xs text-zinc-300"
            style={{
              animation: "regulator-marquee 32s linear infinite",
              willChange: "transform",
            }}
          >
            {marqueeItems.map((news, index) => (
              <span
                key={`${news.id ?? news.title}-${index}`}
                className="flex shrink-0 items-center gap-2 pr-10"
                aria-hidden={index >= breakingNews.length}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                <span>
                  {news.title} | {news.timeAgo}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
