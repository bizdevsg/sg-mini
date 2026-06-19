import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionIntro } from "@/components/molecules/SectionIntro";

type GettingStartedFinalSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export function GettingStartedFinalSection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: GettingStartedFinalSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <SectionContainer>
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(242,207,120,0.08),rgba(255,255,255,0.02))] px-6 py-10 text-center sm:px-8 sm:py-12">
          <SectionIntro
            eyebrow={eyebrow}
            title={title}
            description={description}
            align="center"
            className="mx-auto max-w-3xl"
            titleClassName="text-balance"
            descriptionClassName="mx-auto max-w-2xl"
          />

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <ButtonLink
              href={primaryHref}
              target="_blank"
              rel="noreferrer"
              size="lg"
              className="w-full sm:min-w-[220px] sm:w-auto"
            >
              {primaryLabel}
            </ButtonLink>

            <ButtonLink
              href={secondaryHref}
              variant="ghost"
              size="lg"
              className="w-full border-white/15 text-white backdrop-blur-md sm:min-w-[220px] sm:w-auto"
            >
              {secondaryLabel}
            </ButtonLink>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
