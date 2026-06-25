import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getPengumuman } from "@/lib/pengumuman";
import { getMessages, type AppLocale } from "@/locales";
import { AboutInformationAnnouncements } from "./AboutInformationAnnouncements";
import { PageHeroBanner } from "./PageHeroBanner";

type AboutInformationMainSectionProps = {
  locale: AppLocale;
};

export async function AboutInformationMainSection({
  locale,
}: AboutInformationMainSectionProps) {
  const messages = getMessages(locale);
  const page = messages.aboutInformationPage;

  const { items: pengumuman } = await getPengumuman();

  return (
    <>
      <PageHeroBanner
        locale={locale}
        homeLabel={messages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        className="pb-10 pt-20 md:pb-36 md:pt-24"
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

      <SectionContainer className="relative py-16 sm:py-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

        <AboutInformationAnnouncements
          items={pengumuman}
          locale={locale}
          labels={page.announcements}
        />
      </SectionContainer>
    </>
  );
}
