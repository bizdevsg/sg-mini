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
    <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-md sm:p-8">
      <div className="flex items-start gap-2 sm:items-center">
        <Newspaper className="h-5 w-5 text-yellow-500" />
        <p className="text-lg font-semibold text-white sm:text-xl">{title}</p>
      </div>

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
