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
      </PageHeroBanner>

      <div className="relative">
        <div className=" absolute top-0 left-0 h-50 w-full bg-linear-to-b from-black to-transparent" />

        <SectionContainer className="relative py-16 sm:py-20 z-10">
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
      </div>
    </main>
  );
}
