import Link from "next/link";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { PageHeroBanner } from "@/components/organisms/PageHeroBanner";
import type { BannerDetailRecord } from "@/lib/banner";
import {
  formatLocaleArticleDateTime,
  getMessages,
  type AppLocale,
} from "@/locales";

type BannerDetailPageProps = {
  banner: BannerDetailRecord;
  locale: AppLocale;
  messages: ReturnType<typeof getMessages>;
};

export function BannerDetailPage({
  banner,
  locale,
  messages,
}: BannerDetailPageProps) {
  const labels = messages.bannerDetailPage;
  const updatedAt = banner.updated_at || banner.created_at;
  const title = banner.title || labels.breadcrumb;
  const description = banner.excerpt || labels.emptyContent;

  return (
    <main>
      <PageHeroBanner
        locale={locale}
        homeLabel={messages.app.homeLabel}
        breadcrumbs={[
          {
            label: labels.breadcrumb,
            href: `/${locale}/syarat-dan-ketentuan`,
            tone: "accent",
          },
          {
            label: title,
            tone: "current",
          },
        ]}
      >
        <div className="overflow-hidden rounded-[28px] border border-yellow-500/20 bg-zinc-950/45 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <img
            src={banner.image_url}
            alt={title}
            className="block max-h-[520px] w-full object-cover"
          />
        </div>
      </PageHeroBanner>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black to-transparent" />

        <SectionContainer className="relative py-16 sm:py-20">
          <div className="relative z-10 mx-auto max-w-8xl">
            <div className="rounded-[28px] border border-white/10 bg-zinc-950/55 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-8 md:p-10">
              {/* {updatedAt ? (
                <p className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-yellow-400/75">
                  {labels.updatedLabel} {formatLocaleArticleDateTime(updatedAt, locale)}
                </p>
              ) : null} */}

              {banner.content ? (
                <article
                  className={[
                    "text-sm leading-7 text-zinc-200 sm:text-base sm:leading-8",
                    "[&_h1]:mb-5 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:text-white sm:[&_h1]:text-3xl",
                    "[&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-white sm:[&_h2]:text-2xl",
                    "[&_h3]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-white sm:[&_h3]:text-xl",
                    "[&_p]:leading-7 [&_p]:text-zinc-200 sm:[&_p]:leading-8",
                    "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
                    "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
                    "[&_li]:leading-7 [&_li]:text-zinc-200 sm:[&_li]:leading-8",
                    "[&_blockquote]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-yellow-500/40 [&_blockquote]:bg-yellow-500/5 [&_blockquote]:pl-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-zinc-100",
                    "[&_a]:text-yellow-400 [&_a]:underline [&_a]:underline-offset-4",
                    "[&_strong]:font-semibold [&_strong]:text-white",
                    "[&_em]:italic",
                    "[&_div]:text-zinc-200 [&_span]:text-inherit",
                    "[&_img]:my-6 [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10",

                    // Tambahkan ini
                    "[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-white/10",

                    "[&_table]:mb-5 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse sm:[&_table]:table",
                    "[&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-zinc-200",
                    "[&_th]:border [&_th]:border-line [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white",
                  ].join(" ")}
                  dangerouslySetInnerHTML={{ __html: banner.content }}
                />
              ) : (
                <p className="text-sm leading-7 text-zinc-300 sm:text-base">
                  {labels.emptyContent}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href={`/${locale}/syarat-dan-ketentuan`}
                className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-yellow-500/35 hover:text-yellow-400"
              >
                {labels.backLabel}
              </Link>
            </div>
          </div>
        </SectionContainer>
      </div>
    </main>
  );
}
