import { NewsSidebarArticleCard } from "@/components/molecules/NewsSidebarArticleCard";
import { ClientAreaSectionHeader } from "@/components/molecules/ClientAreaSectionHeader";
import type { NewsFeedArticle } from "@/lib/news.shared";
import type { AppLocale } from "@/locales";

type NewsDetailSidebarSectionProps = {
  hrefBasePath?: string;
  title: string;
  articles: NewsFeedArticle[];
  locale: AppLocale;
};

export function NewsDetailSidebarSection({
  title,
  articles,
  hrefBasePath,
  locale,
}: NewsDetailSidebarSectionProps) {
  return (
    <div>
      <ClientAreaSectionHeader title={title} />
      <div className="mt-4 space-y-4">
        {articles.length ? (
          articles.map((article) => (
            <NewsSidebarArticleCard
              key={article.slug}
              article={article}
              hrefBasePath={hrefBasePath}
              locale={locale}
            />
          ))
        ) : (
          <p className="text-sm text-zinc-300">-</p>
        )}
      </div>
    </div>
  );
}
