import type { OnlineTradingTermSection } from "@/locales/online-trading-terms-page";

type OnlineTradingTermsArticleProps = {
  term: OnlineTradingTermSection;
};

export function OnlineTradingTermsArticle({
  term,
}: OnlineTradingTermsArticleProps) {
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
