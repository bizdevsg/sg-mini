import Image from "next/image";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { LegalitasRecord } from "@/lib/legalitas";
import { getMessages, type AppLocale } from "@/locales";

import { PageHeroBanner } from "./PageHeroBanner";

type AboutBusinessLegalityMainSectionProps = {
  locale: AppLocale;
  items?: LegalitasRecord[];
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
    <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(0,0,0,0.28))] text-left transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/30 hover:shadow-[0_0_40px_rgba(205,161,58,0.08)]">
      <div className="relative min-h-52 overflow-hidden">
        <Image
          src="/assets/d42edfb4-35a2-4653-9246-dcfdf972d127.avif"
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-black/10" />
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.28),transparent_58%)]" />

        <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/20 bg-yellow-500/15 text-yellow-400">
          <FontAwesomeIcon
            icon={["fas", icon] as IconProp}
            className="text-sm"
          />
        </div>

        {badge ? (
          <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black">
              {badge}
            </span>
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
          <h2 className="font-mono text-xl font-bold leading-snug text-white line-clamp-3">
            {title}
          </h2>
        </div>
      </div>

      <div className="relative border-t border-white/8 bg-black/20 p-6">
        {metaLabel && metaValue ? (
          <div className="flex items-center gap-3 text-xs text-yellow-500/60">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon
                icon={["fas", "file-lines"]}
                className="text-[10px]"
              />
              {metaLabel}
            </span>
            <span className="h-px flex-1 bg-yellow-500/10" />
            <span className="font-mono text-[11px] text-white/70">
              {metaValue}
            </span>
          </div>
        ) : null}

        <p
          className={`${metaLabel && metaValue ? "mt-4" : ""} text-sm leading-7 text-zinc-300`}
        >
          {body}
        </p>
      </div>
    </article>
  );
}

export function AboutBusinessLegalityMainSection({
  locale,
  items,
}: AboutBusinessLegalityMainSectionProps) {
  const messages = getMessages(locale);
  const page = messages.aboutBusinessLegalityPage;
  const legalitasItems =
    items && items.length > 0
      ? items.map((item) => ({
        title: item.title,
        body: item.description,
        nomor: item.nomor,
      }))
      : page.overview.cards.map((card) => ({
        title: card.title,
        body: card.body,
        nomor: "",
      }));

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

      <SectionContainer className="py-16 sm:py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {legalitasItems.map((card) => (
            <BusinessLegalityCard
              key={`${card.title}-${card.nomor || "overview"}`}
              title={card.title}
              body={card.body}
              icon="file-lines"
              metaLabel={card.nomor ? page.numberLabel : undefined}
              metaValue={card.nomor || undefined}
            />
          ))}
        </div>
      </SectionContainer>
    </>
  );
}
