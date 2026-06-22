import { SectionContainer } from "@/components/atoms/SectionContainer";
import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import type { AppLocale } from "@/locales";

type PageHeroBannerProps = {
  locale: AppLocale;
  homeLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
    tone?: "default" | "accent" | "current";
  }>;
  className?: string;
  breadcrumbClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function PageHeroBanner({
  locale,
  homeLabel,
  eyebrow,
  title,
  description,
  breadcrumbs,
  className = "py-20 md:py-24",
  breadcrumbClassName = "mb-6",
  titleClassName = "tracking-[-0.02em] sm:text-4xl md:text-5xl",
  descriptionClassName = "mx-auto max-w-2xl leading-relaxed text-gray-300",
}: PageHeroBannerProps) {
  return (
    <div
      className={`bg-cover bg-bottom bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url('/assets/bg-hero1.png')",
      }}
    >
      <SectionContainer className="relative z-10">
        <BreadcrumbTrail
          locale={locale}
          homeLabel={homeLabel}
          className={breadcrumbClassName}
          items={breadcrumbs}
        />

        <SectionIntro
          align="center"
          titleAs="h1"
          eyebrow={eyebrow}
          title={title}
          description={description}
          eyebrowClassName="uppercase tracking-[0.24em] text-yellow-500"
          titleClassName={titleClassName}
          descriptionClassName={descriptionClassName}
        />
      </SectionContainer>
    </div>
  );
}
