import { IndexSymbolsContractExampleSection } from "./IndexSymbolsContractExampleSection";
import { IndexSymbolsContractMonthsSection } from "./IndexSymbolsContractMonthsSection";
import { IndexSymbolsOverviewSection } from "./IndexSymbolsOverviewSection";
import { IndexSymbolsPageHero } from "./IndexSymbolsPageHero";
import {
  getIndexSymbolsPageContent,
  getMessages,
  type AppLocale,
} from "@/locales";

type IndexSymbolsPageProps = {
  page: ReturnType<typeof getIndexSymbolsPageContent>;
  messages: ReturnType<typeof getMessages>;
  locales: AppLocale;
};

export function IndexSymbolsPage({
  page,
  messages,
  locales,
}: IndexSymbolsPageProps) {
  return (
    <main>
      <IndexSymbolsPageHero
        locale={locales}
        homeLabel={messages.app.homeLabel}
        breadcrumb={page.breadcrumb}
        hero={page.hero}
      />

      <IndexSymbolsOverviewSection
        title={page.sections.symbolsTitle}
        subtitle={page.sections.symbolsSubtitle}
        items={page.symbols}
      />

      <IndexSymbolsContractMonthsSection
        title={page.sections.contractMonthsTitle}
        subtitle={page.sections.contractMonthsSubtitle}
        groups={page.contractMonths}
      />

      <IndexSymbolsContractExampleSection
        title={page.sections.contractExampleTitle}
        subtitle={page.sections.contractExampleSubtitle}
        items={page.contractExample}
      />
    </main>
  );
}
