import { ArrowUpRight, Clock3, type LucideIcon } from "lucide-react";

import type { TradePilotGuideArticle } from "@/locales/trade-pilot-guide-page";

type ClientAreaTradePilotGuideArticleCardProps = {
  article: TradePilotGuideArticle;
  categoryLabel: string;
  featured?: boolean;
  icon: LucideIcon;
  index?: number;
  onSelect: () => void;
  readLabel: string;
};

export function ClientAreaTradePilotGuideArticleCard({
  article,
  categoryLabel,
  featured = false,
  icon: Icon,
  index,
  onSelect,
  readLabel,
}: ClientAreaTradePilotGuideArticleCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex h-full min-w-0 flex-col text-left transition ${featured
        ? "rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 hover:border-yellow-500/60"
        : "rounded-xl border border-zinc-800 bg-[#101113]/50 p-4 hover:border-zinc-700 hover:bg-[#141517]/50"
        }`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${featured
            ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
            : "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
            }`}
        >
          {featured && typeof index === "number" ? (
            <span className="text-sm font-black">{index + 1}</span>
          ) : (
            <Icon className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-yellow-400"
          aria-hidden="true"
        />
      </div>

      <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-500/80">
        {categoryLabel}
      </span>
      <h3 className="mt-1.5 text-sm font-bold leading-5 text-white sm:text-[15px]">
        {article.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
        {article.summary}
      </p>

      <div className="mt-auto flex w-full items-center justify-between gap-3 pt-5 text-[11px]">
        <span className="flex items-center gap-1.5 text-zinc-500">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {article.readingTime}
        </span>
        <span className="font-semibold text-yellow-400">{readLabel}</span>
      </div>
    </button>
  );
}
