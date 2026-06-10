import type { NewsFeedArticle } from "@/lib/news";
import type { AppLocale } from "@/locales";
import { NewsSidebarArticleCard } from "@/components/molecules/NewsSidebarArticleCard";

type NewsDetailSidebarProps = {
  latestArticles: NewsFeedArticle[];
  locale: AppLocale;
  relatedArticles: NewsFeedArticle[];
  labels: {
    relatedNews: string;
    latestNews: string;
  };
};

type SidebarSectionProps = {
  title: string;
  articles: NewsFeedArticle[];
  locale: AppLocale;
};

function SidebarSection({ title, articles, locale }: SidebarSectionProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {title}
      </p>
      <div className="mt-4 space-y-4">
        {articles.length ? (
          articles.map((article) => (
            <NewsSidebarArticleCard
              key={article.slug}
              article={article}
              locale={locale}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400">-</p>
        )}
      </div>
    </div>
  );
}

export function NewsDetailSidebar({
  latestArticles,
  locale,
  relatedArticles,
  labels,
}: NewsDetailSidebarProps) {
  return (
    <aside className="space-y-4">
      <SidebarSection
        title={labels.relatedNews}
        articles={relatedArticles}
        locale={locale}
      />

      <div className="mx-auto my-10 h-0.5 w-full rounded-full bg-yellow-500/50" />

      <SidebarSection
        title={labels.latestNews}
        articles={latestArticles}
        locale={locale}
      />
    </aside>
  );
}
