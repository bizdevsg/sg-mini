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
    <section
      id="getting-started-steps"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute top-0 left-1/2 h-25 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent" />

      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div className="max-w-lg lg:sticky lg:top-25">
            <SectionIntro
              eyebrow={eyebrow}
              title={title}
              description={subtitle}
              titleClassName="text-balance"
            />
          </div>

          <div className="divide-y divide-zinc-800/60">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="group flex gap-6 py-6 transition-all first:pt-0 last:pb-0"
              >
                <span className="pt-1 font-mono text-sm font-semibold text-amber-500">
                  ({String(index + 1).padStart(2, "0")})
                </span>

                <div className="max-w-2xl">
                  <h2 className="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-amber-400">
                    {step.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>

                  <ul className="mt-4 grid gap-3 text-sm text-zinc-200">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                        <span className="leading-6 text-zinc-300">{bullet}</span>
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
