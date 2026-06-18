import { getCdnAssetUrl } from "@/lib/env";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { getMessages, type AppLocale, type AppMessages } from "@/locales";

type ContactPageHeroProps = {
  locale: AppLocale;
  copy: AppMessages["contactPage"];
};

export function ContactPageHero({ locale, copy }: ContactPageHeroProps) {
  const homeLabel = getMessages(locale).app.homeLabel;

  return (
    <div
      className="bg-cover bg-bottom bg-no-repeat py-20 md:py-24"
      style={{
        backgroundImage: `url('${getCdnAssetUrl("bg-hero1.avif")}')`,
      }}
    >
      <SectionContainer className="relative z-10">
        <BreadcrumbTrail
          locale={locale}
          homeLabel={homeLabel}
          className="mb-6"
          items={[
            {
              label: copy.breadcrumbs.supportCenter,
              tone: "default",
            },
            {
              label: copy.breadcrumb,
              tone: "current",
            },
          ]}
        />

        <SectionIntro
          align="center"
          titleAs="h1"
          eyebrow={copy.hero.eyebrow}
          title={copy.hero.title}
          description={copy.hero.description}
          eyebrowClassName="uppercase tracking-[0.24em] text-yellow-500"
          titleClassName="tracking-[-0.02em] sm:text-4xl md:text-5xl"
          descriptionClassName="mx-auto max-w-2xl leading-relaxed text-gray-300"
        />
      </SectionContainer>
    </div>
  );
}
