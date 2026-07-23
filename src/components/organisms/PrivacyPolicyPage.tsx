import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { PrivacyPolicyRecord } from "@/lib/privacy-policy";
import { formatLocaleDateTime, getMessages, type AppLocale } from "@/locales";
import { PageHeroBanner } from "./PageHeroBanner";

type PrivacyPolicyPageProps = {
  privacyPolicy: PrivacyPolicyRecord;
  locale: AppLocale;
  messages: ReturnType<typeof getMessages>;
};

export function PrivacyPolicyPage({
  privacyPolicy,
  locale,
  messages,
}: PrivacyPolicyPageProps) {
  const page = messages.privacyPolicyPage;
  const updatedAt = privacyPolicy.updatedAt || privacyPolicy.createdAt;

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

      <section id="privacy-policy-content" className="relative">
        <div className="absolute h-50 w-full bg-linear-to-b from-black to-transparent" />
        <SectionContainer className="py-16 sm:py-20">
          <ScrollReveal effect="fade-up" delay={80}>
            <div className="relative mx-auto max-w-8xl overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/60 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-8 md:p-10">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-yellow-500/60 to-transparent" />

              {privacyPolicy.content ? (
                <div>
                  {updatedAt ? (
                    <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-white/8 pb-5">
                      <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-300/90">
                        {page.breadcrumb}
                      </span>
                      <span className="text-xs text-zinc-400 sm:text-sm">
                        {page.content.updatedLabel}{" "}
                        {formatLocaleDateTime(updatedAt, locale)}
                      </span>
                    </div>
                  ) : null}

                  <article
                    className={[
                      "text-sm leading-7 text-zinc-200 sm:text-base sm:leading-8",
                      "[&_h1]:mb-5 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:text-white sm:[&_h1]:text-3xl",
                      "[&_h2]:mb-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-white sm:[&_h2]:text-2xl",
                      "[&_h3]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-white sm:[&_h3]:text-xl",
                      "[&_p]:mb-5 [&_p]:leading-7 [&_p]:text-zinc-200 sm:[&_p]:leading-8",
                      "[&_p:first-of-type]:text-base [&_p:first-of-type]:leading-8 [&_p:first-of-type]:text-zinc-100 sm:[&_p:first-of-type]:text-lg sm:[&_p:first-of-type]:leading-9",
                      "[&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-6 [&_ul]:marker:text-yellow-400/85",
                      "[&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-6 [&_ol]:marker:text-yellow-400/85",
                      "[&_li]:leading-7 [&_li]:text-zinc-200 sm:[&_li]:leading-8",
                      "[&_blockquote]:mb-6 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-2 [&_blockquote]:border-yellow-500/45 [&_blockquote]:bg-white/[0.03] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-zinc-100",
                      "[&_a]:font-medium [&_a]:text-yellow-400 [&_a]:underline [&_a]:underline-offset-4",
                      "[&_strong]:font-semibold [&_strong]:text-white",
                      "[&_em]:italic",
                      "[&_div]:text-zinc-200 [&_span]:text-inherit",
                      "[&_img]:my-8 [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10",
                      "[&_hr]:my-10 [&_hr]:h-px [&_hr]:border-0 [&_hr]:bg-linear-to-r [&_hr]:from-transparent [&_hr]:via-yellow-500/55 [&_hr]:to-transparent",
                      "[&_table]:mb-6 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse sm:[&_table]:table",
                      "[&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-zinc-200",
                      "[&_th]:border [&_th]:border-line [&_th]:bg-white/5 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white",
                    ].join(" ")}
                    dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">
                    {page.content.emptyTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                    {page.content.emptyBody}
                  </p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </SectionContainer>
      </section>
    </main>
  );
}
