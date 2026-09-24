import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import type { GettingStartedSupportCard } from "@/locales/getting-started-page";
import { ScrollReveal } from "../molecules/ScrollReveal";

type GettingStartedChecklistSectionProps = {
  checklistEyebrow: string;
  checklistTitle: string;
  checklistSubtitle: string;
  checklist: string[];
  supportEyebrow: string;
  supportTitle: string;
  supportSubtitle: string;
  supportCards: GettingStartedSupportCard[];
};

export function GettingStartedChecklistSection({
  checklistEyebrow,
  checklistTitle,
  checklistSubtitle,
  checklist,
  supportEyebrow,
  supportTitle,
  supportSubtitle,
  supportCards,
}: GettingStartedChecklistSectionProps) {
  return (
    <section className="py-16 sm:py-20a">
      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div className="max-w-lg lg:sticky lg:top-25">
            <ScrollReveal effect="fade-right">
              <SectionIntro
                eyebrow={checklistEyebrow}
                title={checklistTitle}
                description={checklistSubtitle}
                titleClassName="text-balance"
              />
            </ScrollReveal>
          </div>

          <div className="space-y-12">
            <div>
              <ScrollReveal effect="fade-up">
                <div className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-400/90">
                  {checklistEyebrow}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                  {checklistTitle}
                </h2>
              </ScrollReveal>

              <div className="mt-6 divide-y divide-zinc-800/60">
                {checklist.map((item, index) => (
                  <ScrollReveal
                    key={item}
                    className="group flex gap-6 py-5 first:pt-0 last:pb-0"
                  >
                    <span className="pt-1 font-mono text-sm font-semibold text-amber-500">
                      ({String(index + 1).padStart(2, "0")})
                    </span>
                    <p className="text-sm leading-7 text-zinc-300 transition-colors duration-200 group-hover:text-zinc-100 sm:text-base">
                      {item}
                    </p>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div>
              <ScrollReveal effect="fade-up">
                <div className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-400/90">
                  {supportEyebrow}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                  {supportTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  {supportSubtitle}
                </p>
              </ScrollReveal>

              <div className="mt-6 divide-y divide-zinc-800/60">
                {supportCards.map((card, index) => (
                  <ScrollReveal
                    key={card.title}
                    className="group flex gap-6 py-6 first:pt-0 last:pb-0"
                  >
                    <span className="pt-1 font-mono text-sm font-semibold text-amber-500">
                      ({String(index + 1).padStart(2, "0")})
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-amber-400">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {card.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
