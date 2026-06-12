import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { BreadcrumbTrail } from "@/components/molecules/BreadcrumbTrail";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import {
  getLocaleConfig,
  getMessages,
  isSupportedLocale,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/locales";

type FraudAlertPageProps = {
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
}: FraudAlertPageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);
  const page = messages.fraudAlertPage;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locales}/fraud-alert`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/fraud-alert`,
        ]),
      ),
    },
  };
}

export default async function FraudAlertPage({
  params,
}: FraudAlertPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales);
  const page = messages.fraudAlertPage;
  const sections = [
    {
      title: page.redFlagsTitle,
      items: page.redFlags,
    },
    {
      title: page.verificationTitle,
      items: page.verificationSteps,
    },
    {
      title: page.responseTitle,
      items: page.responseSteps,
    },
  ];

  return (
    <SectionContainer className="py-16 sm:py-20">
      <BreadcrumbTrail
        locale={locales}
        homeLabel={messages.app.homeLabel}
        items={[
          {
            label: page.breadcrumb,
            tone: "current",
          },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[2rem] border border-line bg-[linear-gradient(160deg,rgba(205,161,58,0.18),rgba(10,10,10,0.92)_42%,rgba(10,10,10,0.98))] p-6 sm:p-8 lg:p-10">
          <SectionIntro
            titleAs="h1"
            eyebrow={page.hero.eyebrow}
            title={page.hero.title}
            description={page.hero.description}
            eyebrowClassName="text-yellow-500/90"
            titleClassName="max-w-3xl font-mono leading-tight tracking-[-0.04em] text-yellow-500 lg:text-5xl"
            descriptionClassName="max-w-2xl text-foreground/78"
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locales}`}
              className="inline-flex items-center justify-center rounded-lg bg-[linear-gradient(180deg,#f2cf78_0%,#cda13a_100%)] px-5 py-3 text-sm font-semibold text-[#120f08] shadow-[0_18px_40px_rgba(205,161,58,0.3)] ring-1 ring-[rgba(242,207,120,0.4)] transition-all duration-300 hover:brightness-110"
            >
              {page.primaryCta}
            </Link>

            <Link
              href={`/${locales}/about`}
              className="inline-flex items-center justify-center rounded-lg bg-[#141414] px-5 py-3 text-sm font-semibold text-yellow-500 ring-1 ring-[rgba(205,161,58,0.22)] transition-all duration-300 hover:bg-[#1d1d1d]"
            >
              {page.secondaryCta}
            </Link>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-[rgba(239,68,68,0.3)] bg-[linear-gradient(180deg,rgba(127,29,29,0.26),rgba(17,17,17,0.96))] p-6 sm:p-8">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-300 ring-1 ring-red-400/20">
            <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
          </div>

          <h2 className="mt-5 font-mono text-2xl font-bold tracking-[-0.03em] text-white">
            {page.alertBoxTitle}
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/72">
            {page.alertBoxBody}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-red-200/80">
              {page.reminderTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/72">
              {page.reminderBody}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[1.75rem] border border-line bg-black/40 p-6 backdrop-blur-sm"
          >
            <h2 className="font-mono text-2xl font-bold tracking-[-0.03em] text-yellow-500">
              {section.title}
            </h2>

            <ol className="mt-5 space-y-4">
              {section.items.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-yellow-500/10 text-sm font-semibold text-yellow-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="pt-1 text-sm leading-7 text-foreground/72">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </SectionContainer>
  );
}
