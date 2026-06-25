import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { OnlineTradingTermsArticleList } from "./OnlineTradingTermsArticleList";
import { PageHeroBanner } from "./PageHeroBanner";
import {
  getMessages,
  getOnlineTradingTermsPageContent,
  type AppLocale,
} from "@/locales";

type OnlineTradingTermsPageProps = {
  page: ReturnType<typeof getOnlineTradingTermsPageContent>;
  messages: ReturnType<typeof getMessages>;
  locales: AppLocale;
};

export function OnlineTradingTermsPage({
  page,
  messages,
  locales,
}: OnlineTradingTermsPageProps) {
  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={messages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        breadcrumbs={[
          {
            label: page.breadcrumb.education,
            href: `/${locales}/education/cara-memulai`,
            tone: "accent",
          },
          {
            label: page.breadcrumb.current,
            tone: "current",
          },
        ]}
      >
        <div className="flex justify-center">
          <ButtonLink
            href="#terms-article"
            size="lg"
            className="group w-full sm:min-w-[220px] sm:w-auto"
          >
            <FontAwesomeIcon icon={["fas", "book"]} />
            {page.hero.primaryCta}
            <FontAwesomeIcon
              icon={["fas", "arrow-right"]}
              className="transition-transform group-hover:translate-x-1"
            />
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3 lg:gap-4">
          {page.hero.badges.map((badge) => (
            <div
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-zinc-200 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </PageHeroBanner>

      <OnlineTradingTermsArticleList
        articleTitle={page.sections.articleTitle}
        articleSubtitle={page.sections.articleSubtitle}
        terms={page.terms}
      />
    </main>
  );
}
