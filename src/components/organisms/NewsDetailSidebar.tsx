import type { NewsFeedArticle } from "@/lib/news.shared";
import type { AppLocale } from "@/locales";
import { NewsSidebarArticleCard } from "@/components/molecules/NewsSidebarArticleCard";

type NewsDetailSidebarProps = {
  hrefBasePath?: string;
  locale: AppLocale;
  relatedArticles: NewsFeedArticle[];
  labels: {
    relatedNews: string;
  };
};

type SidebarSectionProps = {
  hrefBasePath?: string;
  title: string;
  articles: NewsFeedArticle[];
  locale: AppLocale;
};

function SidebarSection({
  title,
  articles,
  hrefBasePath,
  locale,
}: SidebarSectionProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-100">
        {title}
      </p>
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

export function NewsDetailSidebar({
  hrefBasePath,
  locale,
  relatedArticles,
  labels,
}: NewsDetailSidebarProps) {
  return (
    <aside className="space-y-4">
      <SidebarSection
        title={labels.relatedNews}
        articles={relatedArticles}
        hrefBasePath={hrefBasePath}
        locale={locale}
      />
    </aside>
  );
}
