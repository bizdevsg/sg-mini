import Link from "next/link";

import type { ArticleItem } from "@/components/organisms/client-area.types";

type ClientAreaArticleCardProps = {
  article: ArticleItem;
  href?: string;
};

export function ClientAreaArticleCard({
  article,
  href,
}: ClientAreaArticleCardProps) {
  const content = (
    <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 transition-colors duration-300 group-hover:border-yellow-500/40 group-hover:bg-zinc-900">
      <div className="w-fit rounded-full mb-5 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-500">
        {article.category}
      </div>
      <h3 className="text-base font-bold text-zinc-200 line-clamp-1 group-hover:text-yellow-400">
        {article.title}
      </h3>
      <p className="text-sm text-zinc-400 line-clamp-3">{article.excerpt}</p>
      <span className="block text-[10px] text-zinc-500">{article.timeAgo}</span>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} prefetch={false} className="group block">
      {content}
    </Link>
  );
}
