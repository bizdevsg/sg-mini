import { NewsDetailSidebarSection } from "@/components/molecules/NewsDetailSidebarSection";
import type { NewsFeedArticle } from "@/lib/news.shared";
import type { AppLocale } from "@/locales";

type NewsDetailSidebarProps = {
  hrefBasePath?: string;
  locale: AppLocale;
  relatedArticles: NewsFeedArticle[];
  labels: {
    relatedNews: string;
  };
};

export function NewsDetailSidebar({
  hrefBasePath,
  locale,
  relatedArticles,
  labels,
}: NewsDetailSidebarProps) {
  return (
    <aside className="space-y-4">
      <NewsDetailSidebarSection
        title={labels.relatedNews}
        articles={relatedArticles}
        hrefBasePath={hrefBasePath}
        locale={locale}
      />
    </aside>
  );
}
