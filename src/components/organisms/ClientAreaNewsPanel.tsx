"use client";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaArticleCard } from "@/components/molecules/ClientAreaArticleCard";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import type {
  ArticleItem,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

const CLIENT_AREA_NEWS_PAGE_SIZE = 6;

type ClientAreaNewsPanelProps = {
  articles?: ArticleItem[];
  copy: DashboardCopy;
  locale: AppLocale;
};

export function ClientAreaNewsPanel({
  articles,
  copy,
  locale,
}: ClientAreaNewsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const resolvedArticles = articles && articles.length > 0 ? articles : copy.articles;
  const totalPages = Math.max(
    1,
    Math.ceil(resolvedArticles.length / CLIENT_AREA_NEWS_PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * CLIENT_AREA_NEWS_PAGE_SIZE;
  const visibleArticles = resolvedArticles.slice(
    pageStartIndex,
    pageStartIndex + CLIENT_AREA_NEWS_PAGE_SIZE,
  );
  const paginationLabels = getMessages(locale).newsPage.pagination;

  useEffect(() => {
    setCurrentPage(1);
  }, [resolvedArticles.length]);

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "newspaper"]} />
        {copy.newsTitle}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleArticles.map((article) => (
          <ClientAreaArticleCard
            key={article.id ?? article.title}
            article={article}
            href={
              article.slug ? `/${locale}/client-area/news/${article.slug}` : undefined
            }
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <PaginationControls
          className="border-t border-zinc-800 pt-4"
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          nextLabel={paginationLabels.next}
          onNext={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
          onPrevious={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          previousLabel={paginationLabels.previous}
          summary={`${paginationLabels.summary} ${safeCurrentPage} / ${totalPages}`}
        />
      ) : null}
    </div>
  );
}
