import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { OnlineTradingTermSection } from "@/locales/online-trading-terms-page";

type OnlineTradingTermsArticleListProps = {
  articleTitle: string;
  articleSubtitle: string;
  terms: OnlineTradingTermSection[];
};

function TermArticle({ term }: { term: OnlineTradingTermSection }) {
  return (
    <article className="border-b border-white/8 pb-8 last:border-b-0 last:pb-0 sm:pb-10">
      <h3 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500 sm:text-3xl">
        {term.title}
      </h3>

      <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
        {term.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {term.highlight ? (
        <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] p-4 text-sm leading-7 text-zinc-200">
          {term.highlight}
        </div>
      ) : null}

      {term.subsections?.length ? (
        <div className="mt-8 space-y-8">
          {term.subsections.map((subsection) => (
            <section key={subsection.title}>
              <h4 className="font-mono text-xl font-bold tracking-[-0.03em] text-white sm:text-2xl">
                {subsection.title}
              </h4>

              <div className="mt-3 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
                {subsection.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function OnlineTradingTermsArticleList({
  articleTitle,
  articleSubtitle,
  terms,
}: OnlineTradingTermsArticleListProps) {
  return (
    <SectionContainer className="py-16 md:py-20">
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
              <TermArticle key={term.title} term={term} />
            ))}
          </div>
        </section>
      </div>
    </SectionContainer>
  );
}
