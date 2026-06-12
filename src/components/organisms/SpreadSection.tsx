import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { EmptyStatePanel } from "@/components/molecules/EmptyStatePanel";
import { NewsFeedArticleCard } from "@/components/molecules/NewsFeedArticleCard";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { getNewsPageContent } from "@/components/content/news-content";
import { getNewsFeed } from "@/lib/news";
import { getMessages, type AppLocale } from "@/locales";

type SpreadSectionProps = {
  locale: AppLocale;
};

const LATEST_NEWS_LIMIT = 4;

export async function SpreadSection({ locale }: SpreadSectionProps) {
  const messages = getMessages(locale);
  const newsPageContent = getNewsPageContent(locale);
  const latestSection = newsPageContent.latest;
  const { articles } = await getNewsFeed(locale, LATEST_NEWS_LIMIT);

  return (
    <section className="border-b border-line bg-transparent py-20 text-white">
      <SectionContainer>
        <SectionIntro
          eyebrow={latestSection.eyebrow}
          title={latestSection.title}
          description={latestSection.subtitle}
          align="center"
          className="mx-auto max-w-3xl"
          eyebrowClassName="text-yellow-500"
        />

        {articles.length ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:auto-rows-fr sm:grid-cols-2">
            {articles.map((article, index) => (
              <NewsFeedArticleCard
                key={article.id}
                article={article}
                locale={locale}
                readMoreLabel={messages.newsBrowser.readArticle}
                prioritizeImage={index < 2}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyStatePanel body={messages.newsPage.emptyBody} />
          </div>
        )}

        <div className="mt-8 w-full">
          <ButtonLink href={`/${locale}/news`} size="lg" className="mx-auto">
            {newsPageContent.newsPage.hero.primaryCta}
          </ButtonLink>
        </div>
      </SectionContainer>
    </section>
  );
}
