import { OnlineTradingTermsArticle } from "@/components/molecules/OnlineTradingTermsArticle";
import { SectionContainer } from "@/components/atoms/SectionContainer";
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
        <div className="mb-12 text-center">
          <h2
            id="terms-article"
            className="text-3xl font-bold leading-tight text-white sm:text-4xl"
          >
            {articleTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            {articleSubtitle}
          </p>
        </div>

        <section className="rounded-[2rem] border border-line bg-black/20 p-6 sm:p-8 lg:p-10">
          <div className="space-y-8 sm:space-y-10">
            {terms.map((term) => (
              <OnlineTradingTermsArticle key={term.title} term={term} />
            ))}
          </div>
        </section>
      </div>
    </SectionContainer>
  );
}
