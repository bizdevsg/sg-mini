import { LocoLondonGoldAnalysisSection } from "./LocoLondonGoldAnalysisSection";
import { LocoLondonGoldDerivativeSection } from "./LocoLondonGoldDerivativeSection";
import { LocoLondonGoldHistorySection } from "./LocoLondonGoldHistorySection";
import { LocoLondonGoldMarketsSection } from "./LocoLondonGoldMarketsSection";
import { LocoLondonGoldPageHero } from "./LocoLondonGoldPageHero";
import type { LocoLondonGoldPageContent } from "@/locales/loco-london-gold-page";

type LocoLondonGoldPageProps = {
  page: LocoLondonGoldPageContent;
};

export function LocoLondonGoldPage({ page }: LocoLondonGoldPageProps) {
  return (
    <main>
      <LocoLondonGoldPageHero hero={page.hero} />

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

      <LocoLondonGoldDerivativeSection
        title={page.sections.derivativeTitle}
        subtitle={page.sections.derivativeSubtitle}
        derivative={page.derivative}
      />
    </main>
  );
}
