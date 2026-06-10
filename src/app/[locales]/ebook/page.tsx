import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { PUBLIC_LOGIN_URL, PUBLIC_REGISTER_URL } from "@/lib/env";
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
      canonical: `/${locales}/ebook`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
          getLocaleConfig(locale).lang,
          `/${locale}/ebook`,
        ]),
      ),
    },
  };
}

export default async function EbookPage({ params }: EbookPageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const messages = getMessages(locales).ebookPage;

  return (
    <SectionContainer className="py-16 sm:py-20">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-gray-500"
      >
        <Link
          href={`/${locales}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 transition hover:bg-yellow-500/30"
        >
          <FontAwesomeIcon icon={["fas", "house"]} className="text-xs" />
        </Link>
        <span>{">"}</span>
        <span className="font-medium text-white">{messages.breadcrumb}</span>
      </nav>

      <section className="mt-8 border-y border-white/8 py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)] lg:items-end">
          <div className="max-w-4xl">
            <SectionEyebrow className="uppercase tracking-[0.24em] text-yellow-500">
              {messages.hero.eyebrow}
            </SectionEyebrow>

            <h1 className="mt-5 text-4xl font-bold leading-[1.02] text-white md:text-5xl lg:text-[4.15rem]">
              {messages.hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">
              {messages.hero.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-start">
            <ButtonLink
              href={PUBLIC_REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="min-w-[220px] px-6 py-3"
            >
              {messages.hero.primaryCta}
            </ButtonLink>

            <ButtonLink
              href={PUBLIC_LOGIN_URL}
              target="_blank"
              rel="noreferrer"
              variant="dark"
              className="min-w-[220px] px-6 py-3"
            >
              {messages.hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <SectionTitle
          title={messages.libraryTitle}
          subtitle={messages.librarySubtitle}
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {messages.items.map((item, index) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[28px] border border-white/8 bg-black/20"
            >
              <div className="border-b border-white/8 bg-[linear-gradient(135deg,rgba(242,207,120,0.16),rgba(0,0,0,0)_60%)] px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      {item.format}
                    </p>
                    <h2 className="mt-3 text-xl font-semibold leading-snug text-white">
                      {item.title}
                    </h2>
                  </div>

                  <span className="text-sm font-semibold tracking-[0.24em] text-yellow-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="space-y-5 px-5 py-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    {item.level}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-[28px] border border-white/8 bg-black/20 p-6 sm:p-7">
        <h2 className="text-2xl font-semibold text-white">
          {messages.benefitsTitle}
        </h2>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {messages.benefits.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-zinc-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
