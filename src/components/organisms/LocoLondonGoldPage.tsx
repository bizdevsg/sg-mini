import { LocoLondonGoldAnalysisSection } from "./LocoLondonGoldAnalysisSection";
import { LocoLondonGoldDerivativeSection } from "./LocoLondonGoldDerivativeSection";
import { LocoLondonGoldHistorySection } from "./LocoLondonGoldHistorySection";
import { LocoLondonGoldMarketsSection } from "./LocoLondonGoldMarketsSection";
import { PageHeroBanner } from "./PageHeroBanner";
import type { AppLocale } from "@/locales";
import type { LocoLondonGoldPageContent } from "@/locales/loco-london-gold-page";

type LocoLondonGoldPageProps = {
  page: LocoLondonGoldPageContent;
  locale: AppLocale;
  homeLabel: string;
};

export function LocoLondonGoldPage({
  page,
  locale,
  homeLabel,
}: LocoLondonGoldPageProps) {
  return (
    <main>
      <PageHeroBanner
        locale={locale}
        homeLabel={homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        breadcrumbs={[
          {
            label: page.breadcrumb.education,
            href: `/${locale}/education/cara-memulai`,
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

      <LocoLondonGoldHistorySection
        title={page.sections.historyTitle}
        subtitle={page.sections.historySubtitle}
        items={page.history}
      />

      <LocoLondonGoldMarketsSection
        title={page.sections.marketTitle}
        subtitle={page.sections.marketSubtitle}
        items={page.markets}
      />

      <LocoLondonGoldAnalysisSection
        title={page.sections.analysisTitle}
        subtitle={page.sections.analysisSubtitle}
        items={page.analysis}
      />

      {/* <LocoLondonGoldDerivativeSection
        title={page.sections.derivativeTitle}
        subtitle={page.sections.derivativeSubtitle}
        derivative={page.derivative}
      /> */}
    </main>
  );
}
