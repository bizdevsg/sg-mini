import { Newspaper } from "lucide-react";

import { ClientAreaArticleCard } from "@/components/molecules/ClientAreaArticleCard";
import type { ArticleItem } from "@/components/organisms/client-area.shared";
import type { AppLocale } from "@/locales";

type ClientAreaMarketSignalNewsSectionProps = {
  items: ArticleItem[];
  locale: AppLocale;
  title: string;
};

export function ClientAreaMarketSignalNewsSection({
  items,
  locale,
  title,
}: ClientAreaMarketSignalNewsSectionProps) {
  return (
    <div className="mt-6">
      <div className="grid gap-3">
        {items.map((article) => (
          <ClientAreaArticleCard
            key={article.id ?? article.title}
            article={article}
            href={
              article.slug
                ? `/${locale}/client-area/news/${article.slug}`
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
