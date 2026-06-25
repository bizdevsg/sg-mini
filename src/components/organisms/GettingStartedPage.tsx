import { PUBLIC_REGISTER_URL } from "@/lib/env";
import type { AppLocale } from "@/locales";
import { getGettingStartedPageContent, getMessages } from "@/locales";
import { ButtonLink } from "../atoms/ButtonLink";
import { GettingStartedChecklistSection } from "./GettingStartedChecklistSection";
import { GettingStartedFinalSection } from "./GettingStartedFinalSection";
import { PageHeroBanner } from "./PageHeroBanner";
import { GettingStartedStepsSection } from "./GettingStartedStepsSection";

type GettingStartedPageProps = {
  page: ReturnType<typeof getGettingStartedPageContent>;
  messages: ReturnType<typeof getMessages>;
  locales: AppLocale;
};

export function GettingStartedPage({
  page,
  messages,
  locales,
}: GettingStartedPageProps) {
  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={messages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        breadcrumbs={[
          {
            label: page.breadcrumb.education,
            href: `/${locales}/education/cara-memulai`,
            tone: "accent",
          },
          {
            label: page.breadcrumb.current,
            tone: "current",
          },
        ]}
      >
        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:gap-6">
          <ButtonLink
            href={PUBLIC_REGISTER_URL}
            target="_blank"
            rel="noreferrer"
            size="lg"
            className="w-full sm:min-w-[220px] sm:w-auto"
          >
            {page.hero.primaryCta}
          </ButtonLink>

          <ButtonLink
            href={`/${locales}/education/ebook`}
            variant="ghost"
            size="lg"
            className="w-full border-white/15 text-white backdrop-blur-md sm:min-w-[220px] sm:w-auto"
          >
            {page.hero.secondaryCta}
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3 lg:gap-4">
          {page.hero.badges.map((badge) => (
            <div
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </PageHeroBanner>

      <GettingStartedStepsSection
        eyebrow={page.sections.stepsEyebrow}
        title={page.sections.stepsTitle}
        subtitle={page.sections.stepsSubtitle}
        steps={page.steps}
      />

      <GettingStartedChecklistSection
        checklistEyebrow={page.sections.checklistEyebrow}
        checklistTitle={page.sections.checklistTitle}
        checklistSubtitle={page.sections.checklistSubtitle}
        checklist={page.checklist}
        supportEyebrow={page.sections.supportEyebrow}
        supportTitle={page.sections.supportTitle}
        supportSubtitle={page.sections.supportSubtitle}
        supportCards={page.supportCards}
      />

      <GettingStartedFinalSection
        eyebrow={page.sections.ctaEyebrow}
        title={page.sections.ctaTitle}
        description={page.sections.ctaDescription}
        primaryLabel={page.sections.ctaPrimary}
        primaryHref={PUBLIC_REGISTER_URL}
        secondaryLabel={page.sections.ctaSecondary}
        secondaryHref={`/${locales}/contact-us`}
      />
    </main>
  );
}
