import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import type { AppLocale } from "@/locales";
import type { OnlineTradingTermsPageContent } from "@/locales/online-trading-terms-page";
import { getCdnAssetUrl } from "@/lib/env";

type OnlineTradingTermsPageHeroProps = {
  locale: AppLocale;
  homeLabel: string;
  breadcrumb: OnlineTradingTermsPageContent["breadcrumb"];
  hero: OnlineTradingTermsPageContent["hero"];
};

export function OnlineTradingTermsPageHero({
  locale,
  homeLabel,
  breadcrumb,
  hero,
}: OnlineTradingTermsPageHeroProps) {
  const titleWords = hero.title.split(" ");
  const leadTitle = titleWords.slice(0, 2).join(" ");
  const trailingTitle = titleWords.slice(2).join(" ");

  return (
    <section
      className="relative overflow-hidden bg-cover bg-bottom bg-no-repeat pt-10"
      style={{
        backgroundImage: `url('${getCdnAssetUrl("bg-hero1.avif")}')`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 via-transparent to-purple-500/10" />
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-black/20 to-black/80" />

      <SectionContainer className="relative py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow align="center">{hero.eyebrow}</SectionEyebrow>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
              {leadTitle}
            </span>
            {trailingTitle ? (
              <>
                <br />
                <span className="block text-white">{trailingTitle}</span>
              </>
            ) : null}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center lg:gap-6">
            <ButtonLink
              href="#terms-article"
              size="lg"
              className="group w-full sm:min-w-[220px] sm:w-auto"
            >
              <FontAwesomeIcon icon={["fas", "book"]} />
              {hero.primaryCta}
              <FontAwesomeIcon
                icon={["fas", "arrow-right"]}
                className="transition-transform group-hover:translate-x-1"
              />
            </ButtonLink>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3 lg:gap-4">
            {hero.badges.map((badge) => (
              <div
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-zinc-200 backdrop-blur-md"
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
