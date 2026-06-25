import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { EbookLibrarySection } from "@/components/organisms/EbookLibrarySection";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type EbookPageProps = {
  params: Promise<{ locales: string }>;
};

const EBOOK_LOGIN_URL = "https://ebook.newsmaker.id/login";
const EBOOK_REGISTER_URL = "https://ebook.newsmaker.id/register";

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
}: EbookPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales).ebookPage;

  return {
    title: messages.title,
    description: messages.description,
    alternates: {
      canonical: `/${locales}/education/ebook`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/education/ebook`,
        ]),
      ),
    },
  };
}

export default async function EbookPage({ params }: EbookPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const appMessages = getMessages(locales);
  const messages = appMessages.ebookPage;
  const educationLabel =
    appMessages.navbar.menuGroups.find((group) =>
      group.items?.some((item) => item.href === "/education/ebook"),
    )?.label ?? messages.parentLabel;

  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={appMessages.app.homeLabel}
        eyebrow={messages.hero.eyebrow}
        title={messages.hero.title}
        description={messages.hero.description}
        breadcrumbs={[
          {
            label: educationLabel,
            href: `/${locales}/education/cara-memulai`,
            tone: "accent",
          },
          {
            label: messages.breadcrumb,
            tone: "current",
          },
        ]}
      >
        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:gap-6">
          <ButtonLink
            href={EBOOK_REGISTER_URL}
            size="lg"
            className="group w-full sm:min-w-[220px] sm:w-auto"
          >
            <FontAwesomeIcon icon={["fas", "book"]} />
            {messages.hero.primaryCta}
            <FontAwesomeIcon
              icon={["fas", "arrow-right"]}
              className="transition-transform group-hover:translate-x-1"
            />
          </ButtonLink>

          <ButtonLink
            href={EBOOK_LOGIN_URL}
            variant="ghost"
            size="lg"
            className="group w-full border-white/15 text-white backdrop-blur-md sm:min-w-[220px] sm:w-auto"
          >
            {messages.hero.secondaryCta}
            <FontAwesomeIcon
              icon={["fas", "arrow-right"]}
              className="transition-transform group-hover:translate-x-1"
            />
          </ButtonLink>
        </div>
      </PageHeroBanner>

      <EbookLibrarySection
        title={messages.libraryTitle}
        subtitle={messages.librarySubtitle}
        items={messages.items}
        detailCtaLabel={messages.detailCta}
        benefitsTitle={messages.benefitsTitle}
        benefits={messages.benefits}
      />
    </main>
  );
}
