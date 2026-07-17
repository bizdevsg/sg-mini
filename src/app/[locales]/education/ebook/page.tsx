import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppDownloadModalTriggerButton } from "@/components/molecules/AppDownloadModalTriggerButton";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { EbookCategoryCard } from "@/components/molecules/EbookCategoryCard";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import {
  buildEbookCategoryCardDescription,
  formatEbookCount,
  getEbookEmptyState,
} from "@/lib/ebook.shared";
import { getEbookCategories } from "@/lib/ebook";
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

export const revalidate = 300;

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
  const categories = await getEbookCategories();
  const emptyState = getEbookEmptyState(locales);
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
          <AppDownloadModalTriggerButton
            locale={locales}
            label={messages.hero.primaryCta}
            size="lg"
            visualVariant="qr"
            className="w-full sm:min-w-[220px] sm:w-auto cursor-pointer"
          />

          <AppDownloadModalTriggerButton
            locale={locales}
            label={messages.hero.secondaryCta}
            variant="ghost"
            size="lg"
            visualVariant="qr"
            className="w-full sm:min-w-[220px] sm:w-auto cursor-pointer"
          />
        </div>
      </PageHeroBanner>

      <SectionContainer className="py-16 md:py-20 relative">
        <div className="absolute top-0 left-1/2 h-25 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent" />

        <div className="mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              {messages.benefitsTitle}
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-8">
            {messages.benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="group flex items-center gap-4 rounded-2xl border border-line/40 bg-linear-to-r from-yellow-500/5 to-amber-500/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/5 sm:gap-6 sm:p-8"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-yellow-500 to-amber-600">
                  <span className="text-sm font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                <p className="text-base text-foreground/80 sm:text-lg">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="pb-16 md:pb-20">
        <div className="mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              {messages.libraryTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-300">
              {messages.librarySubtitle}
            </p>
          </div>

          {categories.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <EbookCategoryCard
                  key={category.slug}
                  countLabel={formatEbookCount(category.ebooksCount, locales)}
                  ctaLabel={messages.detailCta}
                  description={buildEbookCategoryCardDescription(
                    category.name,
                    category.ebooksCount,
                    locales,
                  )}
                  href={`/${locales}/education/ebook/${category.slug}`}
                  title={category.name}
                />
              ))}
            </div>
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
        </div>
      </SectionContainer>
    </main>
  );
}
