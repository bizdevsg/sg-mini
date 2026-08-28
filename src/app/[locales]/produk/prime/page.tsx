import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import { PUBLIC_REGISTER_URL } from "@/lib/env";
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
            <ButtonLink
              href={PUBLIC_REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              size="lg"
              className="w-full sm:min-w-[220px] sm:w-auto"
            >
              {page.hero.primaryCta}
            </ButtonLink>
          </ScrollReveal>

          <ScrollReveal effect="fade-up" delay={180}>
            <ButtonLink
              href={`/${locales}/contact-us`}
              variant="ghost"
              size="lg"
              className="w-full sm:min-w-[220px] sm:w-auto"
            >
              {page.hero.secondaryCta}
            </ButtonLink>
          </ScrollReveal>
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
          <div className="mx-auto rounded-[2rem] border border-line bg-[linear-gradient(160deg,rgba(205,161,58,0.18),rgba(10,10,10,0.92)_42%,rgba(10,10,10,0.98))] p-8 text-center sm:p-12">
            <SectionIntro
              align="center"
              title={page.cta.title}
              description={page.cta.description}
              titleClassName="mx-auto max-w-2xl tracking-[-0.03em] sm:text-4xl"
              descriptionClassName="mx-auto max-w-xl text-foreground/78"
            />

            <div className="mt-8 flex justify-center">
              <ButtonLink
                href={PUBLIC_REGISTER_URL}
                target="_blank"
                rel="noreferrer"
                size="lg"
              >
                {page.cta.buttonLabel}
              </ButtonLink>
            </div>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </main>
  );
}
