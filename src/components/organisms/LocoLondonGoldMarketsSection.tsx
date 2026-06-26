import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { LocoLondonGoldMarketCard } from "@/locales/loco-london-gold-page";

type LocoLondonGoldMarketsSectionProps = {
  title: string;
  subtitle: string;
  items: LocoLondonGoldMarketCard[];
};

export function LocoLondonGoldMarketsSection({
  title,
  subtitle,
  items,
}: LocoLondonGoldMarketsSectionProps) {
  return (
    <SectionContainer className="pb-16 md:pb-20">
      <div className="mx-auto">
        <div className="grid gap-6 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-line bg-black/20 p-6 sm:p-8"
            >
              <h3 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500">
                {item.title}
              </h3>

              <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base">
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {item.details.map((detail) => (
                  <div
                    key={detail}
                    className="rounded-2xl border border-white/8 bg-black/[0.24] px-4 py-3 text-sm text-zinc-200"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
