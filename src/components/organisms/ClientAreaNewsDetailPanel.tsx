import type { NewsArticleDetail, NewsFeedArticle } from "@/lib/news.shared";
import { getMessages, type AppLocale } from "@/locales";
import { NewsFeedArticleCard } from "@/components/molecules/NewsFeedArticleCard";
import { NewsDetailArticleBody } from "@/components/organisms/NewsDetailArticleBody";
import { NewsDetailHeader } from "@/components/organisms/NewsDetailHeader";
import { NewsDetailSidebar } from "@/components/organisms/NewsDetailSidebar";

type ClientAreaNewsDetailPanelProps = {
  article: NewsArticleDetail;
  latestArticles: NewsFeedArticle[];
  locale: AppLocale;
  newsLabel: string;
  relatedArticles: NewsFeedArticle[];
};

const CLIENT_AREA_NEWS_BASE_PATH = "/client-area/news";

export function ClientAreaNewsDetailPanel({
  article,
  latestArticles,
  locale,
  newsLabel,
  relatedArticles,
}: ClientAreaNewsDetailPanelProps) {
  const messages = getMessages(locale);
  const labels = messages.newsDetailPage;

  return (
    <div className="space-y-8 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8">
      <NewsDetailHeader
        locale={locale}
        publishedAt={article.publishedAt}
        sharePathBase={CLIENT_AREA_NEWS_BASE_PATH}
        slug={article.slug}
        title={article.title}
      />

      <div className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-zinc-950/40">
        <img
          src={article.imageSrc}
          alt={article.title}
          width={1280}
          height={720}
          decoding="async"
          className="block max-h-[520px] w-full object-cover"
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <NewsDetailArticleBody bodyHtml={article.bodyHtml} />

        <NewsDetailSidebar
          hrefBasePath={CLIENT_AREA_NEWS_BASE_PATH}
          relatedArticles={relatedArticles}
          locale={locale}
          labels={labels}
        />
      </div>

      {latestArticles.length ? (
        <section className="border-t border-white/10 pt-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {labels.latestNews}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:auto-rows-fr sm:grid-cols-2">
            {latestArticles.map((latestArticle, index) => (
              <NewsFeedArticleCard
                key={latestArticle.slug}
                article={latestArticle}
                hrefBasePath={CLIENT_AREA_NEWS_BASE_PATH}
                locale={locale}
                readMoreLabel={messages.newsBrowser.readArticle}
                prioritizeImage={index < 2}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
