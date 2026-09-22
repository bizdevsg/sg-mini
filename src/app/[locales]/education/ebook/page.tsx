import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScrollReveal } from "@/components/molecules/ScrollReveal";
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
        titleClassName="max-w-4xl mx-auto tracking-[-0.035em] sm:text-5xl md:text-6xl"
        descriptionClassName="mx-auto max-w-2xl leading-8 text-zinc-200"
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
        <div className="flex justify-center">
          <ScrollReveal effect="fade-up" delay={80}>
            <a
              href="#ebook-library"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-yellow-500 px-6 text-sm font-bold text-black transition hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            >
              {messages.hero.primaryCta}
            </a>
          </ScrollReveal>
        </div>
      </PageHeroBanner>

      <div className="relative">
        <div className="absolute top-0 w-full h-50 bg-linear-to-b from-black to-transparent" />

        <section id="ebook-library" className="scroll-mt-24 z-10">
          <SectionContainer className="pb-16 pt-8 md:pb-24 md:pt-12">
            {categories.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category, index) => (
                  <ScrollReveal
                    key={category.slug}
                    effect="fade-up"
                    delay={index * 160}
                  >
                    <EbookCategoryCard
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
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <ScrollReveal effect="fade-up">
                <div className="rounded-[28px] border border-white/10 bg-[rgba(8,8,8,0.78)] px-6 py-12 text-center shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
                  <h3 className="text-2xl font-bold text-white">
                    {emptyState.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                    {emptyState.body}
                  </p>
                </div>
              </ScrollReveal>
            )}
          </SectionContainer>
        </section>
      </div>
    </main>
  );
}
