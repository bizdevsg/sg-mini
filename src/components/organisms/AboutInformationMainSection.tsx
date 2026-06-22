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
  const sectionLabels = {
    management: locale === "id" ? "Manajemen" : "Management",
    latest: locale === "id" ? "Terbaru" : "Latest",
    emptyTitle:
      locale === "id"
        ? "Belum ada pengumuman saat ini"
        : "No announcements at this time",
    emptyBody:
      locale === "id"
        ? "Silakan kunjungi kembali halaman ini nanti."
        : "Please check back later.",
    readDetail: locale === "id" ? "Lihat Detail" : "View Details",
    close: locale === "id" ? "Tutup modal" : "Close modal",
  };

  const { items: pengumuman } = await getPengumuman();

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

      <SectionContainer className="py-16 sm:py-20">
        <AboutInformationAnnouncements
          items={pengumuman}
          locale={locale}
          labels={sectionLabels}
        />
      </SectionContainer>
    </>
  );
}
