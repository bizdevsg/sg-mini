import { IndexSymbolsContractExampleSection } from "./IndexSymbolsContractExampleSection";
import { IndexSymbolsContractMonthsSection } from "./IndexSymbolsContractMonthsSection";
import { IndexSymbolsOverviewSection } from "./IndexSymbolsOverviewSection";
import { PageHeroBanner } from "./PageHeroBanner";
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
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
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
