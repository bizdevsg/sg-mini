import Link from "next/link";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { AppMessages, AppLocale } from "@/locales";

import { PageHeroBanner } from "./PageHeroBanner";

type FaqMainSectionProps = {
  locale: AppLocale;
  copy: AppMessages["faqPage"];
  homeLabel: string;
};

export function FaqMainSection({
  locale,
  copy,
  homeLabel,
}: FaqMainSectionProps) {
  return (
    <>
      <PageHeroBanner
        locale={locale}
        homeLabel={homeLabel}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
        className="pb-20 pt-20 md:pb-28 md:pt-24"
        titleClassName="mx-auto max-w-4xl tracking-[-0.02em] sm:text-4xl md:text-5xl"
        descriptionClassName="mx-auto max-w-3xl leading-relaxed text-gray-300"
        breadcrumbs={[
          {
            label: copy.breadcrumb,
            tone: "current",
          },
        ]}
      />

      <SectionContainer className="relative py-16 sm:py-20">
        <div className="absolute top-0 left-1/2 h-25 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent" />

        <div className="grid gap-6 xl:grid-cols-3">
          {copy.sections.map((section, sectionIndex) => (
            <ScrollReveal
              key={section.title}
              delay={0}
              desktopDelay={(sectionIndex % 3) * 250}
              className="h-full"
            >
              <section className="h-full rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.24))] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-7">
                <div className="rounded-2xl border border-yellow-500/16 bg-yellow-500/[0.06] px-4 py-3">
                  <h2 className="font-mono text-2xl font-bold tracking-[-0.03em] text-white">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">
                    {section.description}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {section.items.map((item) => (
                    <details
                      key={item.question}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4 transition-colors"
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                        <span className="text-base font-semibold leading-7 text-white">
                          {item.question}
                        </span>
                        <span className="mt-1 shrink-0 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-xs font-bold text-yellow-400 transition">
                          Q
                        </span>
                      </summary>

                      <p className="mt-4 border-t border-white/8 pt-4 text-sm leading-7 text-zinc-300">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal effect="fade-up" className="mt-8">
          <section className="rounded-[32px] border border-yellow-500/18 bg-[linear-gradient(135deg,rgba(205,161,58,0.14),rgba(14,14,14,0.96)_45%,rgba(8,8,8,0.98))] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-500/85">
                  FAQ
                </p>
                <h2 className="mt-3 font-mono text-3xl font-bold tracking-[-0.03em] text-white sm:text-[2.2rem]">
                  {copy.helpCard.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {copy.helpCard.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/contact-us`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#f2cf78_0%,#cda13a_100%)] px-5 text-sm font-semibold text-[#120f08] shadow-[0_14px_32px_rgba(205,161,58,0.25)] transition hover:brightness-105"
                >
                  {copy.helpCard.primaryCta}
                </Link>

                <Link
                  href={`/${locale}/about/informasi`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/30 hover:bg-yellow-500/10 hover:text-yellow-200"
                >
                  {copy.helpCard.secondaryCta}
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </SectionContainer>
    </>
  );
}
