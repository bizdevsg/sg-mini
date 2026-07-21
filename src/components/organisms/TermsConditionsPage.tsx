import Link from "next/link";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { BannerApiRecord } from "@/lib/banner";
import { getMessages, type AppLocale } from "@/locales";
import { PageHeroBanner } from "./PageHeroBanner";

type TermsConditionsPageProps = {
  banners: BannerApiRecord[];
  locale: AppLocale;
  messages: ReturnType<typeof getMessages>;
};

export function TermsConditionsPage({
  banners,
  locale,
  messages,
}: TermsConditionsPageProps) {
  const page = messages.termsConditionsPage;

  return (
    <main>
      <PageHeroBanner
        locale={locale}
        homeLabel={messages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        breadcrumbs={[
          {
            label: page.breadcrumb,
            tone: "current",
          },
        ]}
      >
        <div className="flex justify-center">
          <Link
            href="#terms-conditions-list"
            className="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-medium text-yellow-300 transition hover:border-yellow-400/50 hover:bg-yellow-500/15 hover:text-yellow-200"
          >
            {page.hero.primaryCta}
          </Link>
        </div>
      </PageHeroBanner>

      <section id="terms-conditions-list">
        <SectionContainer className="py-16 sm:py-20">
          <ScrollReveal effect="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-500">
                {page.breadcrumb}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                {page.list.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                {page.list.description}
              </p>
            </div>
          </ScrollReveal>

          {banners.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {banners.map((banner, index) => {
                const title = banner.title || page.list.untitledFallback;
                const href = banner.slug
                  ? `/${locale}/syarat-dan-ketentuan/${encodeURIComponent(banner.slug)}`
                  : undefined;

                return (
                  <ScrollReveal
                    key={banner.id}
                    effect="fade-up"
                    delay={Math.min(index * 80, 240)}
                  >
                    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950/65 shadow-[0_24px_70px_rgba(0,0,0,0.18)] transition hover:border-yellow-500/35">
                      <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
                        <img
                          src={banner.image_url}
                          alt={title}
                          loading={index < 3 ? "eager" : "lazy"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-semibold leading-tight text-white">
                          {title}
                        </h3>

                        {banner.excerpt ? (
                          <p className="mt-3 flex-1 text-sm leading-7 text-zinc-300">
                            {banner.excerpt}
                          </p>
                        ) : (
                          <div className="mt-3 flex-1" />
                        )}

                        {href ? (
                          <Link
                            href={href}
                            className="mt-5 inline-flex items-center text-sm font-medium text-yellow-400 transition hover:text-yellow-300"
                          >
                            {page.list.readMore}
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <ScrollReveal effect="fade-up" delay={80}>
              <div className="mx-auto mt-10 max-w-3xl rounded-[28px] border border-white/10 bg-zinc-950/55 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
                <h3 className="text-xl font-semibold text-white">
                  {page.list.emptyTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                  {page.list.emptyBody}
                </p>
              </div>
            </ScrollReveal>
          )}
        </SectionContainer>
      </section>
    </main>
  );
}
