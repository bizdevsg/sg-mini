import type { AppLocale } from "@/locales";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { AppDownloadModalTriggerButton } from "@/components/molecules/AppDownloadModalTriggerButton";
import { SectionIntro } from "@/components/molecules/SectionIntro";

type GettingStartedFinalSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  locale: AppLocale;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export function GettingStartedFinalSection({
  eyebrow,
  title,
  description,
  locale,
  primaryLabel,
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
            <AppDownloadModalTriggerButton
              locale={locale}
              label={primaryLabel}
              size="lg"
              className="w-full sm:min-w-[220px] sm:w-auto"
            />

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
