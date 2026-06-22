import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { getMessages, type AppLocale } from "@/locales";

import { PageHeroBanner } from "./PageHeroBanner";

type AboutBusinessLegalityMainSectionProps = {
  locale: AppLocale;
};

type BusinessLegalityCardProps = {
  title: string;
  body: string;
  icon: string;
  badge?: string;
  metaLabel?: string;
  metaValue?: string;
};

function BusinessLegalityCard({
  title,
  body,
  icon,
  badge,
  metaLabel,
  metaValue,
}: BusinessLegalityCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(0,0,0,0.25))] text-left transition-all duration-300 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(205,161,58,0.08)]">
      <div className="relative flex h-32 items-end bg-gradient-to-br from-yellow-500/20 via-yellow-500/5 to-transparent p-5">
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-400">
          <FontAwesomeIcon icon={["fas", icon] as IconProp} className="text-sm" />
        </div>

        {badge ? (
          <div className="absolute left-4 top-4 rounded-full bg-yellow-500 px-3 py-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black">
              {badge}
            </span>
          </div>
        ) : null}

        <h2 className="pr-12 font-mono text-lg font-bold leading-snug text-white">
          {title}
        </h2>
      </div>

      <div className="p-5">
        {metaLabel && metaValue ? (
          <div className="flex items-center gap-3 text-xs text-yellow-500/60">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={["fas", "file-lines"]} className="text-[10px]" />
              {metaLabel}
            </span>
            <span className="h-px flex-1 bg-yellow-500/10" />
            <span className="font-mono text-[11px] text-white/70">{metaValue}</span>
          </div>
        ) : null}

        <p className={`${metaLabel && metaValue ? "mt-4" : ""} text-sm leading-7 text-zinc-300`}>
          {body}
        </p>
      </div>
    </article>
  );
}

export function AboutBusinessLegalityMainSection({
  locale,
}: AboutBusinessLegalityMainSectionProps) {
  const messages = getMessages(locale);
  const page = messages.aboutBusinessLegalityPage;

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

      <SectionContainer className="py-16 sm:py-20">
        <SectionIntro
          align="center"
          className="mx-auto max-w-3xl"
          eyebrow={page.overview.eyebrow}
          title={page.overview.title}
          description={page.overview.description}
          eyebrowClassName="uppercase tracking-[0.24em] text-yellow-500"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {page.overview.cards.map((card) => (
            <BusinessLegalityCard
              key={card.title}
              title={card.title}
              body={card.body}
              icon="circle-info"
              badge={page.overview.eyebrow}
            />
          ))}
        </div>
      </SectionContainer>

      <div className="border-y border-white/6 bg-black/10">
        <SectionContainer className="py-16 sm:py-20">
          <SectionIntro
            align="center"
            className="mx-auto max-w-3xl"
            title={page.licenses.title}
            description={page.licenses.description}
            titleClassName="text-2xl leading-tight md:text-[2rem]"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {page.licenses.items.map((item) => (
              <BusinessLegalityCard
                key={item.authority}
                title={item.authority}
                body={item.note}
                icon="scale-balanced"
                badge={page.licenses.title}
                metaLabel={locale === "id" ? "Nomor" : "Number"}
                metaValue={item.number}
              />
            ))}
          </div>
        </SectionContainer>
      </div>

      <SectionContainer className="py-16 sm:py-20">
        <SectionIntro
          align="center"
          className="mx-auto max-w-3xl"
          title={page.memberships.title}
          description={page.memberships.description}
          titleClassName="text-2xl leading-tight md:text-[2rem]"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {page.memberships.items.map((item) => (
            <BusinessLegalityCard
              key={item.authority}
              title={item.authority}
              body={item.note}
              icon="building-columns"
              badge={page.memberships.title}
              metaLabel={locale === "id" ? "Nomor" : "Number"}
              metaValue={item.number}
            />
          ))}
        </div>
      </SectionContainer>

      <div className="border-t border-white/6 bg-black/10">
        <SectionContainer className="py-16 sm:py-20">
          <SectionIntro
            align="center"
            className="mx-auto max-w-3xl"
            title={page.commitments.title}
            description={page.commitments.description}
            titleClassName="text-2xl leading-tight md:text-[2rem]"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {page.commitments.items.map((item) => (
              <BusinessLegalityCard
                key={item}
                title={locale === "id" ? "Komitmen Perusahaan" : "Company Commitment"}
                body={item}
                icon="shield-halved"
                badge={page.commitments.title}
              />
            ))}
          </div>
        </SectionContainer>
      </div>
    </>
  );
}
