import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionIntro } from "@/components/molecules/SectionIntro";
import { EbookCard } from "@/components/molecules/EbookCard";
import { getMessages, type AppLocale } from "@/locales";

type EbookPromoSectionProps = {
  locale: AppLocale;
};

export function EbookPromoSection({ locale }: EbookPromoSectionProps) {
  const messages = getMessages(locale);
  const promo = messages.homeEbookPromo;
  const featuredEbooks = messages.ebookPage.items.slice(0, 2);

  return (
    <section className="bg-transparent">
      <SectionContainer className="py-16 sm:py-20 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div className="max-w-2xl">
            <SectionIntro
              eyebrow={promo.eyebrow}
              title={promo.title}
              description={promo.description}
            />

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-200 sm:text-base">
              {promo.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/[0.03] px-4 py-2"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            <ButtonLink
              href={`/${locale}/education/ebook`}
              size="lg"
              className="mt-6 min-w-[220px]"
            >
              {promo.primaryCta}
            </ButtonLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredEbooks.map((item, index) => (
              <EbookCard key={item.title} item={item} index={index + 1} />
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
