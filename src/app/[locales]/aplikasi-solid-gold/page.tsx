import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { SolidGoldAppDownloadSection } from "@/components/organisms/SolidGoldAppDownloadSection";
import {
  getSolidGoldAppPageContent,
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type SolidGoldAppPageProps = {
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
}: SolidGoldAppPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const pageContent = getSolidGoldAppPageContent(locales);

  return {
    title: pageContent.meta.title,
    description: pageContent.meta.description,
    alternates: {
      canonical: `/${locales}/aplikasi-solid-gold`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/aplikasi-solid-gold`,
        ]),
      ),
    },
  };
}

export default async function SolidGoldAppPage({
  params,
}: SolidGoldAppPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);
  const pageContent = getSolidGoldAppPageContent(locales);
  const productLabel =
    messages.navbar.menuGroups.find((group) =>
      group.items?.some((item) => item.href === "/aplikasi-solid-gold"),
    )?.label ?? messages.productPage.productsLabel;
  const currentLabel =
    messages.navbar.menuGroups
      .flatMap((group) => group.items ?? [])
      .find((item) => item.href === "/aplikasi-solid-gold")?.label ??
    pageContent.meta.title;

  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={messages.app.homeLabel}
        eyebrow={pageContent.hero.eyebrow}
        title={pageContent.hero.title}
        description={pageContent.hero.description}
        breadcrumbs={[
          {
            label: productLabel,
            tone: "accent",
          },
          {
            label: currentLabel,
            tone: "current",
          },
        ]}
      >
        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:gap-6">
          <ButtonLink
            href={pageContent.platforms.items[0]?.stores[0]?.href ?? "#"}
            target="_blank"
            rel="noreferrer"
            size="lg"
            className="group w-full sm:min-w-[220px] sm:w-auto"
          >
            <FontAwesomeIcon icon={["fab", "google-play"]} />
            {pageContent.hero.primaryCta}
            <FontAwesomeIcon
              icon={["fas", "arrow-right"]}
              className="transition-transform group-hover:translate-x-1"
            />
          </ButtonLink>

          <ButtonLink
            href={pageContent.platforms.items[0]?.stores[1]?.href ?? "#"}
            target="_blank"
            rel="noreferrer"
            variant="ghost"
            size="lg"
            className="group w-full border-white/15 text-white backdrop-blur-md sm:min-w-[220px] sm:w-auto"
          >
            <FontAwesomeIcon icon={["fab", "apple"]} />
            {pageContent.hero.secondaryCta}
            <FontAwesomeIcon
              icon={["fas", "arrow-right"]}
              className="transition-transform group-hover:translate-x-1"
            />
          </ButtonLink>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3 lg:gap-4">
          {pageContent.hero.badges.map((badge) => (
            <div
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-medium text-zinc-200 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </PageHeroBanner>

      <SolidGoldAppDownloadSection
        title={pageContent.platforms.title}
        subtitle={pageContent.platforms.subtitle}
        platforms={pageContent.platforms.items}
        benefitsTitle={pageContent.benefits.title}
        benefits={pageContent.benefits.items}
      />
    </main>
  );
}
