import { OnlineTradingTermsArticleList } from "./OnlineTradingTermsArticleList";
import { OnlineTradingTermsPageHero } from "./OnlineTradingTermsPageHero";
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
      <OnlineTradingTermsPageHero
        locale={locales}
        homeLabel={messages.app.homeLabel}
        breadcrumb={page.breadcrumb}
        hero={page.hero}
      />

      <OnlineTradingTermsArticleList
        articleTitle={page.sections.articleTitle}
        articleSubtitle={page.sections.articleSubtitle}
        terms={page.terms}
      />
    </main>
  );
}
