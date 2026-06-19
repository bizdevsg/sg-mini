import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import type { GettingStartedSupportCard } from "@/locales/getting-started-page";

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
    <section className="py-16 sm:py-20 lg:py-24">
      <SectionContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-12">
          <div className="max-w-lg">
            <SectionIntro
              eyebrow={checklistEyebrow}
              title={checklistTitle}
              description={checklistSubtitle}
              titleClassName="text-balance"
            />
          </div>

          <div className="rounded-[28px] border border-line/40 bg-white/[0.03] p-6 sm:p-8">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-400/90">
                  {checklistEyebrow}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                  {checklistTitle}
                </h2>

                <ul className="mt-6 grid gap-4 text-sm text-zinc-200 sm:text-base">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-400/90">
                  {supportEyebrow}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                  {supportTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">
                  {supportSubtitle}
                </p>

                <div className="mt-6 space-y-5">
                  {supportCards.map((card, index) => (
                    <article key={card.title}>
                      <div className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-400/80">
                        0{index + 1}
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-white sm:text-lg">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        {card.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
