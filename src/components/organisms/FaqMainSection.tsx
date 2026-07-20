"use client";

import Link from "next/link";
import { useState } from "react";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { FaqAccordionItem } from "@/components/molecules/FaqAccordionItem";
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
  const [openItemKey, setOpenItemKey] = useState<string | null>(null);
  const faqItems = copy.sections.flatMap((section) =>
    section.items.map((item) => ({
      ...item,
      key: `${section.title}-${item.question}`,
      sectionTitle: section.title,
    })),
  );

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

        <div className="mx-auto grid grid-cols-1 gap-4">
          {faqItems.map((item, index) => (
            <ScrollReveal
              key={item.key}
              delay={0}
            >
              <FaqAccordionItem
                answer={item.answer}
                isOpen={openItemKey === item.key}
                onToggle={() =>
                  setOpenItemKey((current) =>
                    current === item.key ? null : item.key,
                  )
                }
                question={item.question}
                sectionTitle={item.sectionTitle}
              />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal effect="fade-up" className="mt-8">
          <section className="rounded-3xl border border-yellow-500/18 bg-[linear-gradient(135deg,rgba(205,161,58,0.14),rgba(14,14,14,0.96)_45%,rgba(8,8,8,0.98))] p-6 sm:p-8">
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
              </div>
            </div>
          </section>
        </ScrollReveal>
      </SectionContainer>
    </>
  );
}
