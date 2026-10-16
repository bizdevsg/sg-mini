import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { FuturesBrokerRepresentative } from "@/lib/futures-broker-representatives";
import { getMessages, type AppLocale } from "@/locales";

import { PageHeroBanner } from "./PageHeroBanner";

type AboutFuturesBrokerRepresentativesMainSectionProps = {
  locale: AppLocale;
  representatives: FuturesBrokerRepresentative[];
};

function getInitials(name: string) {
  return name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AboutFuturesBrokerRepresentativesMainSection({
  locale,
  representatives,
}: AboutFuturesBrokerRepresentativesMainSectionProps) {
  const messages = getMessages(locale);
  const page = messages.aboutFuturesBrokerRepresentativesPage;

  return (
    <>
      <PageHeroBanner
        locale={locale}
        homeLabel={messages.app.homeLabel}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        className="pb-32 pt-20 md:pb-36 md:pt-24"
        titleClassName="mx-auto max-w-4xl tracking-[-0.02em] sm:text-4xl md:text-5xl"
        descriptionClassName="mx-auto max-w-3xl leading-relaxed text-gray-300"
        breadcrumbs={[
          {
            label: page.parentLabel,
            href: `/${locale}/about`,
            tone: "accent",
          },
          {
            label: page.breadcrumb,
            tone: "current",
          },
        ]}
      />

      <SectionContainer className="relative py-14 sm:py-20">
        <div className="pointer-events-none absolute top-0 left-1/2 h-28 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent" />

        <div className="relative z-10 mx-auto">
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {representatives.map((representative, index) => (
              <ScrollReveal
                key={`${representative.id}-${representative.slug || representative.name}`}
                effect="fade-up"
                delay={Math.min((index % 3) * 80, 160)}
                className="h-full"
              >
                <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[linear-gradient(155deg,rgba(27,27,27,0.95),rgba(8,8,8,0.98))] p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_18px_45px_rgba(205,161,58,0.1)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/[0.08] text-sm font-bold text-amber-300">
                        {getInitials(representative.name)}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-amber-300">
                          {representative.name}
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-400/80">
                          {page.representatives.roleLabel}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-xs text-zinc-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 font-semibold text-emerald-300">
                      {representative.statusLabel || representative.status}
                    </span>

                    <span className="font-medium text-zinc-300">
                      {representative.licenseNumber || "-"}
                    </span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
