import Link from "next/link";

import type { NewsFeedArticle } from "@/lib/news.shared";
import { formatLocaleDateTime, type AppLocale } from "@/locales";

type NewsFeedArticleCardProps = {
  article: NewsFeedArticle;
  locale: AppLocale;
  readMoreLabel: string;
  prioritizeImage?: boolean;
};

export function NewsFeedArticleCard({
  article,
  locale,
  readMoreLabel,
  prioritizeImage = false,
}: NewsFeedArticleCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/${locale}/news/${article.slug}`}
        prefetch={false}
        className="group grid h-full min-h-[202px] grid-cols-1 items-start gap-4 rounded-2xl border border-white/10 bg-zinc-950/40 p-4 transition-all duration-300 hover:border-yellow-500/40 hover:bg-zinc-900/40 sm:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[11rem_minmax(0,1fr)]"
      >
        <div
          role="img"
          aria-label={article.title}
          className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 sm:h-full sm:min-h-[180px] sm:aspect-auto"
          style={{
            backgroundImage: `url('${article.imageSrc}')`,
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-9 flex-wrap items-start gap-2">
            <span className="line-clamp-1 inline-flex min-w-0 max-w-full rounded-full bg-yellow-500/15 px-2.5 py-1 text-[11px] font-medium text-yellow-400 sm:max-w-[150px]">
              {article.displayCategory}
            </span>

            <span className="pt-1 text-[11px] text-zinc-500 sm:ml-auto sm:shrink-0 sm:whitespace-nowrap">
              {formatLocaleDateTime(article.publishedAt, locale)}
            </span>
          </div>

          <h2 className="mt-3 line-clamp-2 pr-2 pb-0.5 text-base font-bold leading-[1.4] text-white transition-colors group-hover:text-yellow-400 sm:text-lg sm:leading-[1.45]">
            {article.title}
          </h2>

          <p className="mt-2 line-clamp-2 pr-2 text-sm leading-6 text-zinc-400 sm:leading-7">
            {article.summary}
          </p>

          <div className="mt-auto pt-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-yellow-400">
              {readMoreLabel}
              <span className="transition-transform group-hover:translate-x-1">
                {">"}
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
