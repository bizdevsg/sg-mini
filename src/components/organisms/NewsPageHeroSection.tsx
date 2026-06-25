import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import {
  formatLocaleArticleDateTime,
  type AppLocale,
} from "@/locales";
import { getNewsPageContent } from "@/locales/news-page-content";

type NewsPageHeroSectionProps = {
  locale: AppLocale;
  breadcrumbLabel: string;
};

export function NewsPageHeroSection({
  locale,
  breadcrumbLabel,
}: NewsPageHeroSectionProps) {
  const pageContent = getNewsPageContent(locale);
  const hero = pageContent.newsPage.hero;
  const featured = pageContent.featured;
  const marketPulse = pageContent.marketPulse;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(242,207,120,0.18),transparent_34%),linear-gradient(180deg,#0b0b0b_0%,#050505_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(242,207,120,0.06))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.68))]" />

      <SectionContainer className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] xl:items-end">
          <div className="max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-3 text-sm text-zinc-400"
            >
              <Link
                href={`/${locale}`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 transition hover:border-yellow-500/40 hover:bg-yellow-500/15"
              >
                <FontAwesomeIcon icon={["fas", "house"]} className="text-xs" />
              </Link>

              <span className="text-zinc-600">{">"}</span>
              <span className="font-medium text-zinc-200">{breadcrumbLabel}</span>
            </nav>

            <SectionEyebrow className="mt-8">{hero.eyebrow}</SectionEyebrow>

            <h1 className="mt-5 max-w-4xl font-mono text-4xl font-bold leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-[3.65rem]">
              {hero.title}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              {hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="#news-browser" size="lg">
                {hero.primaryCta}
              </ButtonLink>

              <ButtonLink
                href={`/${locale}/economic-calendar`}
                variant="dark"
                size="lg"
              >
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-400">
                {featured.label}
              </span>

              <span className="text-xs text-zinc-500">
                {formatLocaleArticleDateTime(featured.publishedAt, locale)}
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
              {featured.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-[15px]">
              {featured.summary}
            </p>

            <ul className="mt-6 space-y-3">
              {featured.takeaways.map((takeaway) => (
                <li
                  key={takeaway}
                  className="flex items-start gap-3 text-sm leading-6 text-zinc-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {marketPulse.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/8 bg-black/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {item.label}
                    </p>

                    <span className="text-xs font-semibold text-yellow-400">
                      {item.change}
                    </span>
                  </div>

                  <p className="mt-3 text-2xl font-semibold text-white">
                    {item.value}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
