import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ResilientImage } from "@/components/atoms/ResilientImage";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import {
  AppDownloadModalTriggerButton,
} from "@/components/molecules/AppDownloadModalTriggerButton";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { getPrimeProductCatalog } from "@/lib/products";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type ProdukPrimePageProps = {
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
}: ProdukPrimePageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const page = getMessages(locales).produkPrimePage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locales}/produk/prime`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/produk/prime`,
        ]),
      ),
    },
  };
}

export default async function ProdukPrimePage({
  params,
}: ProdukPrimePageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const appMessages = getMessages(locales);
  const page = appMessages.produkPrimePage;
  const primeProducts = await getPrimeProductCatalog(
    locales,
    page.productShowcase.fallbackItem,
  );
  const productLabel =
    appMessages.navbar.menuGroups.find((group) =>
      group.items?.some((item) => item.href === "/produk/prime"),
    )?.label ?? appMessages.productPage.productsLabel;

  return (
    <main>
      <PageHeroBanner
        locale={locales}
        homeLabel={appMessages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        breadcrumbs={[
          {
            label: productLabel,
            tone: "accent",
          },
          {
            label: page.breadcrumb,
            tone: "current",
          },
        ]}
      >
        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:gap-6">
          <ScrollReveal effect="fade-up" delay={80}>
            <AppDownloadModalTriggerButton
              locale={locales}
              label={page.hero.primaryCta}
              size="lg"
              visualVariant="qr"
            />
          </ScrollReveal>

          {/* <ScrollReveal effect="fade-up" delay={180}>
            <ButtonLink
              href={`/${locales}/contact-us`}
              variant="ghost"
              size="lg"
              className="w-full sm:min-w-[220px] sm:w-auto"
            >
              {page.hero.secondaryCta}
            </ButtonLink>
          </ScrollReveal> */}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:gap-4">
          {page.hero.badges.map((badge) => (
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

      <SectionContainer className="relative py-16 md:py-20">
        <div className="pointer-events-none absolute top-0 left-1/2 h-48 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent" />

        <div className="relative z-10 mx-auto grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-12">
          <ScrollReveal effect="fade-right">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">
              {page.productShowcase.eyebrow}
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
              {page.productShowcase.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              {page.productShowcase.description}
            </p>
          </ScrollReveal>
        </div>

        <div className="relative z-10 mx-auto mt-9 grid gap-4 md:grid-cols-2">
          {primeProducts.data.map((product, index) => (
            <ScrollReveal
              key={`${product.id}-${product.slug}`}
              className="h-full"
              effect="fade-up"
              delay={Math.min(index * 100, 300)}
            >
              <Link
                href={`/${locales}/produk/prime/${product.slug}`}
                className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                aria-label={`${appMessages.productPage.viewDetailCta}: ${product.name}`}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(24,24,24,0.96),rgba(8,8,8,0.98))] shadow-[0_14px_38px_rgba(0,0,0,0.22)] transition duration-300 group-hover:-translate-y-1 group-hover:border-amber-400/30 group-hover:shadow-[0_18px_42px_rgba(205,161,58,0.1)]">
                  <div className="relative h-40 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(245,194,66,0.2),transparent_45%),linear-gradient(145deg,#201b10,#0a0a0a_72%)] sm:h-44">
                    {product.imageSrc ? (
                      <ResilientImage
                        src={product.imageSrc}
                        alt={product.name}
                        className="block w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        style={{
                          height: "100%",
                          objectPosition: "center 58%",
                        }}
                        fallback={
                          <div className="flex h-full items-center justify-center font-mono text-3xl font-black tracking-[-0.06em] text-amber-300/80 sm:text-4xl">
                            {product.name}
                          </div>
                        }
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-mono text-3xl font-black tracking-[-0.06em] text-amber-300/80 sm:text-4xl">
                        {product.name}
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full border border-amber-300/25 bg-black/65 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-300 backdrop-blur-md">
                      {product.sourceCategory}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="text-xl font-bold tracking-[-0.02em] text-white transition-colors group-hover:text-amber-300">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                      {product.description}
                    </p>

                    <hr className="rounded-full my-4 border-zinc-800" />

                    <div className="mt-auto flex items-end justify-between gap-4 border-white/10">
                      <div>
                        <p className="text-[10px] text-zinc-500">
                          {page.productShowcase.sizeLabel}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-amber-300">
                          {page.productShowcase.sizeValue}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                        <span>{appMessages.productPage.viewDetailCta}</span>
                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </SectionContainer>

      <div className="relative">
        <div className="absolute h-100 w-full bg-linear-to-b from-black to-transparent" />

        <SectionContainer className="py-16 md:py-20">
          <div className="mx-auto grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
            <ScrollReveal effect="fade-right">
              <div className="lg:sticky lg:top-10">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {page.benefitsTitle}
                </h2>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  {page.benefitsDescription}
                </p>
                <Link
                  href={`/${locales}${page.specsLink.href}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300"
                >
                  {page.specsLink.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </ScrollReveal>

            <div className="divide-y divide-zinc-800/60">
              {page.benefits.map((benefit, index) => (
                <ScrollReveal
                  key={benefit.title}
                  delay={index * 150}
                  className="group flex items-start gap-6 py-6 transition-all first:pt-0 last:pb-0"
                >
                  <span className="pt-1 font-mono text-sm font-semibold text-amber-500">
                    ({String(index + 1).padStart(2, "0")})
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white transition-colors duration-200 group-hover:text-amber-400">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {benefit.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="pb-16 md:pb-20">
        <ScrollReveal effect="fade-up">
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-zinc-200">
                <tr>
                  <th className="px-4 py-3">{page.tradingTable.headers.specification}</th>
                  <th className="px-4 py-3 font-mono text-yellow-400">
                    {page.tradingTable.headers.xul10}
                  </th>
                  <th className="px-4 py-3 font-mono text-yellow-400">
                    {page.tradingTable.headers.bco10}
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.tradingTable.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-white/10 text-zinc-300"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {row.label}
                    </td>
                    <td className="px-4 py-3">{row.xul10}</td>
                    <td className="px-4 py-3">{row.bco10}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </SectionContainer>

      <SectionContainer className="pb-16 md:pb-20">
        <ScrollReveal effect="fade-up">
          <div className="mx-auto rounded-[2rem] border border-line bg-[linear-gradient(160deg,rgba(205,161,58,0.18),rgba(10,10,10,0.92)_42%,rgba(10,10,10,0.98))] p-8 text-center sm:p-12">
            <SectionIntro
              align="center"
              title={page.cta.title}
              description={page.cta.description}
              titleClassName="mx-auto max-w-2xl tracking-[-0.03em] sm:text-4xl"
              descriptionClassName="mx-auto max-w-xl text-foreground/78"
            />

            <div className="mt-8 flex justify-center">
              <AppDownloadModalTriggerButton
                locale={locales}
                label={page.cta.buttonLabel}
                size="lg"
                visualVariant="qr"
              />
            </div>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </main>
  );
}
