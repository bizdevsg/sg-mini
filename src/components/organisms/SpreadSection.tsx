import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { PUBLIC_SPREAD_CTA_URL } from "@/lib/env";
import { getMessages, type AppLocale } from "@/locales";
import { SpreadTable } from "@/components/molecules/SpreadTable";

type SpreadSectionProps = {
  locale: AppLocale;
};

export function SpreadSection({ locale }: SpreadSectionProps) {
  const messages = getMessages(locale);

  return (
    <section className="border-b border-line bg-transparent py-20 text-white">
      <SectionContainer>
        <SectionTitle
          title={messages.spread.title}
          subtitle={messages.spread.subtitle}
          theme="dark"
        />

        <SpreadTable locale={locale} items={messages.spread.items} />

        <div className="w-full mt-8">
          <ButtonLink
            href={PUBLIC_SPREAD_CTA_URL}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 mx-auto"
          >
            {messages.spread.cta}
          </ButtonLink>
        </div>
      </SectionContainer>
    </section>
  );
}
