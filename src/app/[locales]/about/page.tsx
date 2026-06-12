import { AboutCompanyProfileSection } from "@/components/organisms/AboutCompanyProfileSection";
import { AboutShowcaseSection } from "@/components/organisms/AboutShowcaseSection";
import RegulasiSection from "@/components/organisms/RegulasiSection";
import VisiMisiSection from "@/components/organisms/VisiMisiSection";
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

  return (
    <main>
      <div className="mt-10 border-b border-white/6">
        <AboutCompanyProfileSection locale={locales} />
      </div>

      <div className="bg-black/10">
        <VisiMisiSection locale={locales} />
      </div>

      <div className="border-y border-white/6">
        <AboutShowcaseSection
          eyebrow={awards.eyebrow}
          title={awards.title}
          description={awards.description}
          items={awards.items}
        />
      </div>

      <div>
        <RegulasiSection locale={locales} />
      </div>
    </main>
  );
}
