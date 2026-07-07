import Image from "next/image";
import Link from "next/link";

import type { NewsFeedArticle } from "@/lib/news.shared";
import { formatLocaleDateTime, type AppLocale } from "@/locales";

type NewsFeedArticleCardProps = {
  article: NewsFeedArticle;
  hrefBasePath?: string;
  locale: AppLocale;
  readMoreLabel: string;
  prioritizeImage?: boolean;
  variant?: "default" | "featured";
  appearance?: "legacy" | "news";
};

export function NewsFeedArticleCard({
  article,
  hrefBasePath = "/news",
  locale,
  readMoreLabel,
  prioritizeImage = false,
  variant = "default",
  appearance = "legacy",
}: NewsFeedArticleCardProps) {
  const isNewsAppearance = appearance === "news";
  const isFeatured = variant === "featured";
  const articleHref = `/${locale}${hrefBasePath}/${article.slug}`;

  if (!isNewsAppearance) {
    return (
      <article className="h-full">
        <Link
          href={articleHref}
          prefetch={false}
          className="group grid h-full min-h-[202px] grid-cols-1 items-start gap-4 rounded-2xl border border-white/10 bg-zinc-950/40 p-4 transition-all duration-300 hover:border-yellow-500/40 hover:bg-zinc-900/40 sm:grid-cols-[10rem_minmax(0,1fr)] lg:grid-cols-[11rem_minmax(0,1fr)]"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:h-full sm:min-h-[180px] sm:aspect-auto">
            <Image
              src={article.imageSrc}
              alt={article.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 10rem, 11rem"
              loading={prioritizeImage ? "eager" : "lazy"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

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

  return (
    <article className={isFeatured ? "h-full sm:col-span-2" : "h-full"}>
      <Link
        href={articleHref}
        prefetch={false}
        className={
          isFeatured
            ? "group relative flex min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/60 transition-all duration-300 hover:border-yellow-500/35 hover:shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:min-h-[430px]"
            : "group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950/40 transition-all duration-300 hover:border-yellow-500/35 hover:bg-zinc-900/55 hover:shadow-[0_20px_60px_rgba(0,0,0,0.24)]"
        }
      >
        {isFeatured ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={article.imageSrc}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 70vw, 860px"
                loading={prioritizeImage ? "eager" : "lazy"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.58)_42%,rgba(0,0,0,0.88))]" />

            <div className="relative flex h-full min-w-0 flex-1 flex-col justify-end p-5 sm:p-8">
              <div className="flex min-h-9 flex-wrap items-start gap-2">
                <span className="inline-flex min-w-0 max-w-full rounded-full border border-yellow-500/20 bg-yellow-500/12 px-3 py-1 text-[11px] font-medium text-yellow-300">
                  {article.displayCategory}
                </span>

                <span className="pt-1 text-[11px] text-zinc-300 sm:ml-auto sm:whitespace-nowrap">
                  {formatLocaleDateTime(article.publishedAt, locale)}
                </span>
              </div>

              <h2 className="mt-4 max-w-3xl text-2xl font-bold leading-tight text-white transition-colors group-hover:text-yellow-300 sm:text-[2rem]">
                {article.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-200/82 sm:text-[15px]">
                {article.summary}
              </p>

              <div className="mt-5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-yellow-300">
                  {readMoreLabel}
                  <span className="transition-transform group-hover:translate-x-1">
                    {">"}
                  </span>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={article.imageSrc}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 420px"
                loading={prioritizeImage ? "eager" : "lazy"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col p-5">
              <div className="flex min-h-9 flex-wrap items-start gap-2">
                <span className="line-clamp-1 inline-flex min-w-0 max-w-full rounded-full border border-yellow-500/15 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-medium text-yellow-400 sm:max-w-[180px]">
                  {article.displayCategory}
                </span>

                <span className="pt-1 text-[11px] text-zinc-500 sm:ml-auto sm:shrink-0 sm:whitespace-nowrap">
                  {formatLocaleDateTime(article.publishedAt, locale)}
                </span>
              </div>

              <h2 className="mt-4 line-clamp-2 pr-2 text-lg font-bold leading-[1.45] text-white transition-colors group-hover:text-yellow-400">
                {article.title}
              </h2>

              <p className="mt-3 line-clamp-3 pr-2 text-sm leading-7 text-zinc-400">
                {article.summary}
              </p>

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-yellow-400">
                  {readMoreLabel}
                  <span className="transition-transform group-hover:translate-x-1">
                    {">"}
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </Link>
    </article>
  );
}
