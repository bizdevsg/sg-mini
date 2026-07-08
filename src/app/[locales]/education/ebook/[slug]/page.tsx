import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { EbookResourceLibrary } from "@/components/organisms/EbookResourceLibrary";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { getEbookCategoryDetail } from "@/lib/ebook";
import {
  buildEbookCategoryPageDescription,
  getEbookEmptyState,
} from "@/lib/ebook.shared";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type EbookCategoryDetailPageProps = {
  params: Promise<{ locales: string; slug: string }>;
};

export const revalidate = 300;

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: EbookCategoryDetailPageProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const detail = await getEbookCategoryDetail(slug);

  if (!detail) {
    notFound();
  }

  return {
    title: `${detail.category.name} | ${getMessages(locales).ebookPage.title}`,
    description: buildEbookCategoryPageDescription(
      detail.category.name,
      detail.category.ebooksCount,
      locales,
    ),
    alternates: {
      canonical: `/${locales}/education/ebook/${detail.category.slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/education/ebook/${detail.category.slug}`,
        ]),
      ),
    },
  };
}

export default async function EbookCategoryDetailPage({
  params,
}: EbookCategoryDetailPageProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const appMessages = getMessages(locales);
  const messages = appMessages.ebookPage;
  const detail = await getEbookCategoryDetail(slug);
  const emptyState = getEbookEmptyState(locales);
  const educationLabel =
    appMessages.navbar.menuGroups.find((group) =>
      group.items?.some((item) => item.href === "/education/ebook"),
    )?.label ?? messages.parentLabel;

  if (!detail) {
    notFound();
  }

  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={appMessages.app.homeLabel}
        eyebrow={messages.hero.eyebrow}
        title={detail.category.name}
        description={buildEbookCategoryPageDescription(
          detail.category.name,
          detail.category.ebooksCount,
          locales,
        )}
        breadcrumbs={[
          {
            label: educationLabel,
            href: `/${locales}/education/cara-memulai`,
            tone: "accent",
          },
          {
            label: messages.breadcrumb,
            href: `/${locales}/education/ebook`,
          },
          {
            label: detail.category.name,
            tone: "current",
          },
        ]}
      >
        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:gap-6">
          <ButtonLink
            href={`/${locales}/education/ebook`}
            variant="ghost"
            size="lg"
            className="group w-full border-white/15 text-white backdrop-blur-md sm:min-w-[240px] sm:w-auto"
          >
            <FontAwesomeIcon
              icon={["fas", "arrow-left"]}
              className="transition-transform group-hover:-translate-x-1"
            />
            {messages.backToCategoriesCta}
          </ButtonLink>
        </div>
      </PageHeroBanner>

      <SectionContainer className="py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            {detail.category.name}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            {buildEbookCategoryPageDescription(
              detail.category.name,
              detail.category.ebooksCount,
              locales,
            )}
          </p>
        </div>

        {detail.items.length ? (
          <EbookResourceLibrary
            closeLabel={messages.closeCta}
            downloadCtaLabel={messages.downloadCta}
            items={detail.items}
            previewCtaLabel={messages.previewCta}
          />
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[rgba(8,8,8,0.78)] px-6 py-12 text-center shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            <h3 className="text-2xl font-bold text-white">
              {emptyState.title}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              {emptyState.body}
            </p>
          </div>
        )}
      </SectionContainer>
    </main>
  );
}
