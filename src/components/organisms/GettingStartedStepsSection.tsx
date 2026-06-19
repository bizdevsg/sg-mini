import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import type { GettingStartedStep } from "@/locales/getting-started-page";

type GettingStartedStepsSectionProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: GettingStartedStep[];
};

export function GettingStartedStepsSection({
  eyebrow,
  title,
  subtitle,
  steps,
}: GettingStartedStepsSectionProps) {
  return (
    <section id="getting-started-steps" className="py-16 sm:py-20 lg:py-24">
      <SectionContainer>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
          <div className="max-w-lg">
            <SectionIntro
              eyebrow={eyebrow}
              title={title}
              description={subtitle}
              titleClassName="text-balance"
            />
          </div>

          <div className="overflow-hidden rounded-[28px] border border-line/40 bg-linear-to-b from-white/[0.04] to-white/[0.02] backdrop-blur-sm">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-4 border-b border-white/10 p-6 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-6 sm:p-8"
              >
                <div className="flex items-start">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600 text-sm font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="max-w-2xl">
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    {step.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">
                    {step.description}
                  </p>

                  <ul className="mt-5 grid gap-3 text-sm text-zinc-200 sm:text-base">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
