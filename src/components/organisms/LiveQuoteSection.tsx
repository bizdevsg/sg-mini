import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { LiveQuoteTable } from "@/components/molecules/LiveQuoteTable";
import { getMessages, type AppLocale } from "@/locales";
import { ButtonLink } from "../atoms/ButtonLink";

type LiveQuoteSectionProps = {
  locale: AppLocale;
};

export function LiveQuoteSection({ locale }: LiveQuoteSectionProps) {
  const messages = getMessages(locale);

  return (
    <section className="border-y border-line bg-zinc-900">
      <SectionContainer className="py-20">
        <SectionTitle title={messages.liveQuoteSection.title} />
        <LiveQuoteTable locale={locale} />

        <div className="flex justify-center">
          <ButtonLink
            href={`/${locale}/live-quote`}
            variant="dark"
            className="mt-5 px-8 py-3"
          >
            {messages.liveQuoteSection.cta}
          </ButtonLink>
        </div>
      </SectionContainer>
    </section>
  );
}
