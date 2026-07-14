import type { ReactNode } from "react";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import type { AppLocale } from "@/locales";

type PageHeroBannerProps = {
  locale: AppLocale;
  homeLabel: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
    tone?: "default" | "accent" | "current";
  }>;
  className?: string;
  breadcrumbClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
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
  children,
}: PageHeroBannerProps) {
  return (
    <div
      className={`relative bg-cover bg-top bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url('/assets/BCG.png')",
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent" />

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

        {children ? <div className="mt-10">{children}</div> : null}
      </SectionContainer>
    </div>
  );
}
