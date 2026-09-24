import { OnlineTradingTermsArticle } from "@/components/molecules/OnlineTradingTermsArticle";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { OnlineTradingTermSection } from "@/locales/online-trading-terms-page";

type OnlineTradingTermsArticleListProps = {
  articleTitle: string;
  articleSubtitle: string;
  terms: OnlineTradingTermSection[];
};

export function OnlineTradingTermsArticleList({
  articleTitle,
  articleSubtitle,
  terms,
}: OnlineTradingTermsArticleListProps) {
  return (
    <SectionContainer className="py-16 md:py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

      <div className="mx-auto">
        <ScrollReveal effect="fade-up" delay={120}>
          <section className="rounded-[2rem] border border-line bg-black/20 p-6 sm:p-8 lg:p-10 overflow-hidden">
            <div className="space-y-8 sm:space-y-10">
              {terms.map((term, index) => (
                <ScrollReveal
                  key={term.title}
                  effect={index % 2 === 0 ? "fade-left" : "fade-right"}
                  delay={Math.min(index * 120, 360)}
                >
                  <OnlineTradingTermsArticle term={term} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </SectionContainer>
  );
}
