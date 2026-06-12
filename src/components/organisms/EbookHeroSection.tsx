import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { getCdnAssetUrl } from "@/lib/env";

type EbookHeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export function EbookHeroSection({
  eyebrow,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: EbookHeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-bottom bg-no-repeat pt-10"
      style={{
        backgroundImage: `url('${getCdnAssetUrl("bg-hero1.avif")}')`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 via-transparent to-purple-500/10" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-black/20 to-black/80" />

      <SectionContainer className="relative py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionEyebrow align="center">{eyebrow}</SectionEyebrow>

          {/* Main Title */}
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
              {title.split(" ").slice(0, 2).join(" ")}
            </span>
            <br />
            <span className="block text-white">
              {title.split(" ").slice(2).join(" ")}
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center lg:gap-6">
            <ButtonLink
              href={primaryCtaHref}
              size="lg"
              className="group sm:min-w-[220px]"
            >
              <FontAwesomeIcon icon={["fas", "book"]} />
              {primaryCtaLabel}
              <FontAwesomeIcon
                icon={["fas", "arrow-right"]}
                className="transition-transform group-hover:translate-x-1"
              />
            </ButtonLink>

            <ButtonLink
              href={secondaryCtaHref}
              variant="ghost"
              size="lg"
              className="group border-white/15 text-white backdrop-blur-md sm:min-w-[220px]"
            >
              {secondaryCtaLabel}
              <FontAwesomeIcon
                icon={["fas", "arrow-right"]}
                className="transition-transform group-hover:translate-x-1"
              />
            </ButtonLink>
          </div>

          {/* Feature Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-3 lg:gap-4">
            {[
              "Materi Terstruktur",
              "Fokus Relevan",
              "Akses 24/7",
            ].map((badge, index) => (
              <div
                key={index}
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
