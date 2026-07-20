import { SectionContainer } from "@/components/atoms/SectionContainer";
import { AboutBusinessLegalityCard } from "@/components/molecules/AboutBusinessLegalityCard";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { LegalitasRecord } from "@/lib/legalitas";
import { getMessages, type AppLocale } from "@/locales";

import { PageHeroBanner } from "./PageHeroBanner";

type AboutBusinessLegalityMainSectionProps = {
  locale: AppLocale;
  items?: LegalitasRecord[];
};

export function AboutBusinessLegalityMainSection({
  locale,
  items,
}: AboutBusinessLegalityMainSectionProps) {
  const messages = getMessages(locale);
  const page = messages.aboutBusinessLegalityPage;
  const legalitasItems =
    items && items.length > 0
      ? items.map((item) => ({
        title: item.title,
        body: item.description,
        nomor: item.nomor,
      }))
      : page.overview.cards.map((card) => ({
        title: card.title,
        body: card.body,
        nomor: "",
      }));

  return (
    <>
      <PageHeroBanner
        locale={locale}
        homeLabel={messages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        className="pb-32 pt-20 md:pb-36 md:pt-24"
        titleClassName="mx-auto max-w-4xl tracking-[-0.02em] sm:text-4xl md:text-5xl"
        descriptionClassName="mx-auto max-w-3xl leading-relaxed text-gray-300"
        breadcrumbs={[
          {
            label: page.parentLabel,
            href: `/${locale}/about`,
            tone: "accent",
          },
          {
            label: page.breadcrumb,
            tone: "current",
          },
        ]}
      />

      <SectionContainer className="py-16 sm:py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {legalitasItems.map((card, index) => {
            const desktopRevealDelay = (index % 3) * 250;

            return (
              <ScrollReveal
                key={`${card.title}-${card.nomor || "overview"}`}
                delay={0}
                desktopDelay={desktopRevealDelay}
                className="h-full"
              >
                <AboutBusinessLegalityCard
                  title={card.title}
                  body={card.body}
                  icon="file-lines"
                  metaLabel={card.nomor ? page.numberLabel : undefined}
                  metaValue={card.nomor || undefined}
                />
              </ScrollReveal>
            );
          })}
        </div>
      </SectionContainer>
    </>
  );
}
