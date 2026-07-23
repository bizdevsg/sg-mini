import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { BannerApiRecord } from "@/lib/banner";
import {
  formatLocaleDateTime,
  getMessages,
  type AppLocale,
} from "@/locales";
import { PageHeroBanner } from "./PageHeroBanner";

type PromoPageProps = {
  banners: BannerApiRecord[];
  locale: AppLocale;
  messages: ReturnType<typeof getMessages>;
};

export function PromoPage({
  banners,
  locale,
  messages,
}: PromoPageProps) {
  const page = messages.promoPage;

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
      />

      <section id="promo-list" className="relative">
        <div className="absolute h-50 w-full bg-linear-to-b from-black to-transparent" />
        <SectionContainer className="py-16 sm:py-20">
          {banners.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {banners.map((banner, index) => {
                const title = banner.title || page.list.untitledFallback;
                const href = banner.slug
                  ? `/${locale}/promo/${encodeURIComponent(banner.slug)}`
                  : undefined;
                const dateLabel = formatLocaleDateTime(
                  banner.updated_at || banner.created_at,
                  locale,
                );

                return (
                  <ScrollReveal
                    key={banner.id}
                    effect="fade-up"
                    delay={Math.min(index * 80, 240)}
                  >
                    {href ? (
                      <Link
                        href={href}
                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.25))] text-left transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(205,161,58,0.08)]"
                      >
                        <div className="relative w-full overflow-hidden">
                          <img
                            src={banner.image_url}
                            alt={title}
                            loading={index < 3 ? "eager" : "lazy"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="line-clamp-2 font-mono text-lg font-bold leading-snug text-white drop-shadow-lg">
                              {title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          {banner.excerpt ? (
                            <p className="line-clamp-3 flex-1 text-sm leading-7 text-zinc-300">
                              {banner.excerpt}
                            </p>
                          ) : (
                            <div className="flex-1" />
                          )}

                          <div className="flex items-center gap-3 text-xs text-yellow-500/60">
                            <span className="flex items-center gap-1.5">
                              <FontAwesomeIcon
                                icon={["fas", "calendar-days"]}
                                className="text-[10px]"
                              />
                              {dateLabel}
                            </span>
                            <span className="h-px flex-1 bg-yellow-500/10" />
                            <span>{page.breadcrumb}</span>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.25))] text-left">
                        <div className="relative h-52 w-full overflow-hidden">
                          <img
                            src={banner.image_url}
                            alt={title}
                            loading={index < 3 ? "eager" : "lazy"}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="line-clamp-2 font-mono text-lg font-bold leading-snug text-white drop-shadow-lg">
                              {title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          {banner.excerpt ? (
                            <p className="line-clamp-3 flex-1 text-sm leading-7 text-zinc-300">
                              {banner.excerpt}
                            </p>
                          ) : (
                            <div className="flex-1" />
                          )}

                          <div className="mt-5 flex items-center gap-1.5 text-xs text-yellow-500/60">
                            <FontAwesomeIcon
                              icon={["fas", "calendar-days"]}
                              className="text-[10px]"
                            />
                            {dateLabel}
                          </div>
                        </div>
                      </article>
                    )}
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
