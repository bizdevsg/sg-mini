import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { EmptyStatePanel } from "@/components/molecules/EmptyStatePanel";
import { NewsFeedArticleCard } from "@/components/molecules/NewsFeedArticleCard";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { getNewsFeed } from "@/lib/news";
import { getNewsPageContent } from "@/locales/news-page-content";
import { getMessages, type AppLocale } from "@/locales";
import { ScrollReveal } from "../molecules/ScrollReveal";

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
    <section className="bg-transparent pb-20 text-white">
      <SectionContainer>
        <ScrollReveal
          effect="fade-up"
        >
          <SectionIntro
            eyebrow={latestSection.eyebrow}
            title={latestSection.title}
            description={latestSection.subtitle}
            align="center"
            className="mx-auto max-w-3xl"
            eyebrowClassName="text-yellow-500"
          />
        </ScrollReveal>

        <ScrollReveal effect="fade-up">
          {articles.length ? (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:auto-rows-fr sm:grid-cols-2">
              {articles.map((article, index) => (
                <ScrollReveal
                  key={article.id}
                  effect={(index + 1) % 2 === 1 ? "fade-right" : "fade-left"}
                  delay={index * 150}
                >
                  <NewsFeedArticleCard
                    article={article}
                    locale={locale}
                    readMoreLabel={messages.newsBrowser.readArticle}
                    prioritizeImage={index < 2}
                  />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyStatePanel body={messages.newsPage.emptyBody} />
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal effect="zoom-in">
          <div className="mt-8 flex justify-center">
            <ButtonLink href={`/${locale}/news`} size="sm" variant="dark" className="mx-auto">
              {newsPageContent.newsPage.hero.primaryCta}
            </ButtonLink>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </section>
  );
}
