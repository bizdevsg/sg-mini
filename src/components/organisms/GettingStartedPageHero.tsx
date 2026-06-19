import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import type { AppLocale } from "@/locales";
import type { GettingStartedPageContent } from "@/locales/getting-started-page";

type GettingStartedPageHeroProps = {
  locale: AppLocale;
  homeLabel: string;
  breadcrumb: GettingStartedPageContent["breadcrumb"];
  hero: GettingStartedPageContent["hero"];
  primaryCtaHref: string;
  secondaryCtaHref: string;
};

export function GettingStartedPageHero({
  locale,
  homeLabel,
  breadcrumb,
  hero,
  primaryCtaHref,
  secondaryCtaHref,
}: GettingStartedPageHeroProps) {
  const titleWords = hero.title.split(" ");
  const leadTitle = titleWords.slice(0, 2).join(" ");
  const tailTitle = titleWords.slice(2).join(" ");

  return (
    <section
      className="relative overflow-hidden bg-cover bg-bottom bg-no-repeat pt-10"
      style={{
        backgroundImage: "url('/assets/bg-hero1.png')",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 via-transparent to-yellow-500/5" />
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-black/30 to-black/85" />

      <SectionContainer className="relative py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <BreadcrumbTrail
            locale={locale}
            homeLabel={homeLabel}
            items={[
              { label: breadcrumb.education, tone: "default" },
              { label: breadcrumb.current },
            ]}
            className="justify-center"
          />

          <div className="mt-8">
            <SectionEyebrow align="center">{hero.eyebrow}</SectionEyebrow>
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
              {leadTitle}
            </span>
            {tailTitle ? <span className="block text-white">{tailTitle}</span> : null}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center lg:gap-6">
            <ButtonLink
              href={primaryCtaHref}
              target="_blank"
              rel="noreferrer"
              size="lg"
              className="w-full sm:min-w-[220px] sm:w-auto"
            >
              {hero.primaryCta}
            </ButtonLink>

            <ButtonLink
              href={secondaryCtaHref}
              variant="ghost"
              size="lg"
              className="w-full border-white/15 text-white backdrop-blur-md sm:min-w-[220px] sm:w-auto"
            >
              {hero.secondaryCta}
            </ButtonLink>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3 lg:gap-4">
            {hero.badges.map((badge) => (
              <div
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
