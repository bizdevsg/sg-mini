import Image from "next/image";
import Link from "next/link";

import type { NewsFeedArticle } from "@/lib/news";
import {
  formatLocaleArticleDateTime,
  type AppLocale,
} from "@/locales";

type NewsSidebarArticleCardProps = {
  article: NewsFeedArticle;
  locale: AppLocale;
};

export function NewsSidebarArticleCard({
  article,
  locale,
}: NewsSidebarArticleCardProps) {
  return (
    <Link
      href={`/${locale}/news/${article.slug}`}
      className="group block rounded-2xl border border-white/10 bg-zinc-900/40 p-3 transition-all duration-300 hover:border-yellow-400/40 hover:bg-zinc-900/70"
    >
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={article.imageSrc}
            alt={article.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <h3 className="line-clamp-3 text-sm font-semibold leading-relaxed text-white group-hover:text-yellow-400">
            {article.title}
          </h3>

          <span className="mt-3 text-xs text-zinc-500">
            {formatLocaleArticleDateTime(article.publishedAt, locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
