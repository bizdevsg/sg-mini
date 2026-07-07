import Image from "next/image";
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
  const imageUrl = article.imageUrl ?? "/assets/img-card.png";
  const imageAlt = article.title;

  const content = (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-colors duration-300 group-hover:border-yellow-500/40 group-hover:bg-zinc-900">
      <div className="flex items-stretch gap-4 p-4 sm:p-5">
        <div className="relative aspect-3/4 min-h-44 w-25 shrink-0 rounded-xl overflow-hidden border-r border-zinc-800/80 bg-zinc-950 sm:w-44">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="300"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between ">
          <div className="space-y-2">
            <div className="mb-4 w-fit rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-500">
              {article.category}
            </div>
            <h3 className="line-clamp-2 text-sm font-bold text-zinc-200 group-hover:text-yellow-400 sm:text-base">
              {article.title}
            </h3>
            <p className="line-clamp-3 text-xs leading-5 text-zinc-400 sm:text-sm sm:leading-6">
              {article.excerpt}
            </p>
          </div>
          <span className="mt-4 block text-xs text-zinc-500">{article.timeAgo}</span>
        </div>
      </div>
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
