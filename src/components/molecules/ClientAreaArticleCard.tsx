import type { ArticleItem } from "@/components/organisms/client-area.types";

type ClientAreaArticleCardProps = {
  article: ArticleItem;
};

export function ClientAreaArticleCard({
  article,
}: ClientAreaArticleCardProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
      <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
        {article.category}
      </span>
      <h3 className="text-sm font-bold text-zinc-200">{article.title}</h3>
      <p className="text-xs text-zinc-400">{article.excerpt}</p>
      <span className="block text-[10px] text-zinc-500">{article.timeAgo}</span>
    </div>
  );
}
