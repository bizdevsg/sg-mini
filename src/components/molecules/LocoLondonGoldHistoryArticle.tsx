import type { LocoLondonGoldArticleSection } from "@/locales/loco-london-gold-page";

type LocoLondonGoldHistoryArticleProps = {
  item: LocoLondonGoldArticleSection;
};

export function LocoLondonGoldHistoryArticle({
  item,
}: LocoLondonGoldHistoryArticleProps) {
  return (
    <article className="rounded-[1.75rem] border border-line bg-black/20 p-6 sm:p-8">
      <h3 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500 sm:text-3xl">
        {item.title}
      </h3>

      <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
        {item.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {item.highlight ? (
        <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.05] p-4 text-sm leading-7 text-zinc-200">
          {item.highlight}
        </div>
      ) : null}

      {item.subsections?.length ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {item.subsections.map((subsection) => (
            <section
              key={subsection.title}
              className="rounded-2xl border border-white/8 bg-black/[0.24] p-5"
            >
              <h4 className="font-mono text-lg font-bold tracking-[-0.03em] text-white sm:text-xl">
                {subsection.title}
              </h4>

              <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-300">
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
