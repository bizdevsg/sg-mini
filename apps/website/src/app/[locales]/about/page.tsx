import { AboutCompanyProfileSection } from "@/components/organisms/AboutCompanyProfileSection";
import { AboutShowcaseSection } from "@/components/organisms/AboutShowcaseSection";
import RegulasiSection from "@/components/organisms/RegulasiSection";
import VisiMisiSection from "@/components/organisms/VisiMisiSection";
import { getCompanyProfile } from "@/lib/company-profile";
import { getPenghargaanRecords } from "@/lib/penghargaan";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type AboutPageProps = {
  params: Promise<{ locales: string }>;
};

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locales: locale,
  }));
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).aboutPage;

  return {
    title:
      locales === "id"
        ? `Tentang ${page.companyProfile.title}`
        : `About ${page.companyProfile.title}`,
    description: page.hero.description,
    alternates: {
      canonical: `/${locales}/about`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/about`,
        ]),
      ),
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  const messages = getMessages(locales);
  const { awards } = messages.aboutPage;
  const fallbackAwardImageSrc =
    awards.items[0]?.imageSrc || "/assets/security-awards.svg";
  const [companyProfile, penghargaanRecords] = await Promise.all([
    getCompanyProfile(locales),
    getPenghargaanRecords(),
  ]);
  const showcaseItems =
    penghargaanRecords.length > 0
      ? penghargaanRecords.map((item) => ({
        title: item.title,
        subtitle: item.subtitle,
        imageSrc: item.imageUrl || fallbackAwardImageSrc,
        imageAlt: item.title,
      }))
      : awards.items;

  return (
    <main>
      <AboutCompanyProfileSection
        locale={locales}
        companyName={companyProfile.companyName}
        paragraphs={companyProfile.descriptionParagraphs}
      />

      <div className="bg-black/10 relative">
        <div className="absolute top-0 left-0 w-full h-25 bg-linear-to-b from-black to-transparent" />

        <VisiMisiSection
          locale={locales}
          missionItems={companyProfile.mission}
          visionItems={companyProfile.vision}
        />
      </div>

      <div className="border-y border-white/6">
        <AboutShowcaseSection
          eyebrow={awards.eyebrow}
          title={awards.title}
          description={awards.description}
          items={showcaseItems}
        />
      </div>

      <div>
        <RegulasiSection locale={locales} />
      </div>
    </main>
  );
}
