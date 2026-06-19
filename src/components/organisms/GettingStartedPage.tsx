import { PUBLIC_REGISTER_URL } from "@/lib/env";
import type { AppLocale } from "@/locales";
import { getGettingStartedPageContent, getMessages } from "@/locales";
import { GettingStartedChecklistSection } from "./GettingStartedChecklistSection";
import { GettingStartedFinalSection } from "./GettingStartedFinalSection";
import { GettingStartedPageHero } from "./GettingStartedPageHero";
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
      <GettingStartedPageHero
        locale={locales}
        homeLabel={messages.app.homeLabel}
        breadcrumb={page.breadcrumb}
        hero={page.hero}
        primaryCtaHref={PUBLIC_REGISTER_URL}
        secondaryCtaHref={`/${locales}/education/ebook`}
      />

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
