import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { ResilientImage } from "@/components/atoms/ResilientImage";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { getPrimeProductBySlug } from "@/lib/products";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type PrimeProductDetailPageProps = {
  params: Promise<{ locales: string; slug: string }>;
};

const specificationContentClassName = [
  "overflow-x-auto text-sm leading-6 text-zinc-200 sm:text-[15px]",
  "[scrollbar-color:rgba(234,179,8,0.55)_rgba(255,255,255,0.08)] [scrollbar-width:thin]",
  "[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/[0.08]",
  "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-yellow-500/55",
  "[&_table]:w-full [&_table]:min-w-[640px] [&_table]:border-collapse",
  "[&_td]:border [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-zinc-300",
  "[&_strong]:font-semibold [&_strong]:text-white",
  "[&_p]:m-0",
].join(" ");

function assertValidLocale(value: string): asserts value is AppLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

async function getPrimeProduct(locale: AppLocale, slug: string) {
  const page = getMessages(locale).produkPrimePage;
  const product = await getPrimeProductBySlug(
    locale,
    slug,
    page.productShowcase.fallbackItem,
  );

  return product.data;
}

export async function generateMetadata({
  params,
}: PrimeProductDetailPageProps): Promise<Metadata> {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const product = await getPrimeProduct(locales, slug);

  if (!product) {
    notFound();
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/${locales}/produk/prime/${product.slug}`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/produk/prime/${product.slug}`,
        ]),
      ),
    },
  };
}

export default async function PrimeProductDetailPage({
  params,
}: PrimeProductDetailPageProps) {
  const { locales, slug } = await params;
  assertValidLocale(locales);

  const appMessages = getMessages(locales);
  const page = appMessages.produkPrimePage;
  const product = await getPrimeProduct(locales, slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={appMessages.app.homeLabel}
        eyebrow={page.productShowcase.eyebrow}
        title={product.name}
        description={product.description}
        className="py-16 md:py-20"
        titleClassName="tracking-[-0.02em] sm:text-4xl md:text-5xl"
        breadcrumbs={[
          {
            label: page.breadcrumb,
            href: `/${locales}/produk/prime`,
            tone: "accent",
          },
          {
            label: product.name,
            tone: "current",
          },
        ]}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-6 border-t border-white/10 pt-8 text-left sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-32 w-full shrink-0 items-center justify-center sm:w-44">
              {product.imageSrc ? (
                <ResilientImage
                  src={product.imageSrc}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  fallback={
                    <div className="flex h-full items-center justify-center font-mono text-3xl font-black text-amber-300/80">
                      {product.name}
                    </div>
                  }
                />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-3xl font-black text-amber-300/80">
                  {product.name}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                  {product.sourceCategory}
                </span>
                <span className="text-zinc-700">/</span>
                <span className="font-mono text-xs uppercase text-zinc-500">
                  {product.slug}
                </span>
              </div>

              <dl className="mt-5">
                <div className="flex items-baseline gap-3">
                  <dt className="text-xs text-zinc-500">
                    {page.productShowcase.sizeLabel}
                  </dt>
                  <dd className="text-sm font-semibold text-amber-300">
                    {page.productShowcase.sizeValue}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <ButtonLink
            href={`/${locales}/produk/prime`}
            variant="ghost"
            size="sm"
            className="self-start sm:self-auto"
          >
            <span aria-hidden="true">{"\u2190"}</span>
            {appMessages.productPage.backToCatalogCta}
          </ButtonLink>
        </div>
      </PageHeroBanner>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-black via-black/70 to-transparent" />

        <SectionContainer className="relative z-10 py-12 sm:py-16">
          <ScrollReveal effect="fade-up">
            <section className="rounded-[24px] border border-white/10 bg-[rgba(9,9,9,0.9)] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.26)] sm:p-7 lg:p-8">
              <div className="border-b border-white/10 pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                  {product.name}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
                  {appMessages.productPage.specificationTitle}
                </h2>
              </div>

              <div className="mt-6">
                {product.specsHtml ? (
                  <div
                    className={specificationContentClassName}
                    dangerouslySetInnerHTML={{ __html: product.specsHtml }}
                  />
                ) : (
                  <p className="text-sm text-zinc-400">
                    {appMessages.productPage.emptyBody}
                  </p>
                )}
              </div>
            </section>
          </ScrollReveal>
        </SectionContainer>
      </div>
    </main>
  );
}
