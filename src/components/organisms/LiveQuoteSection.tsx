import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { getMessages, type AppLocale } from "@/locales";
import { ButtonLink } from "../atoms/ButtonLink";
import { SectionEyebrow } from "../atoms/SectionEyebrow";
import { LiveQuoteTable } from "./LiveQuoteTable";

type LiveQuoteSectionProps = {
  locale: AppLocale;
};

export function LiveQuoteSection({ locale }: LiveQuoteSectionProps) {
  const messages = getMessages(locale);

  return (
    <div className="bg-[#0E0E0E]">
      <SectionContainer className="py-20">
        <SectionEyebrow align="left" className="mb-5">
          {messages.liveQuoteSection.eyebrow}
        </SectionEyebrow>

        <SectionTitle
          title={messages.liveQuoteSection.title}
          subtitle={messages.liveQuoteSection.subtitle}
          align="left"
          className="mx-auto"
          subtitleClassName="max-w-2xl mb-10"
        />

        <LiveQuoteTable locale={locale} />

        <div className="flex justify-center">
          <ButtonLink
            href={`/${locale}/live-quote`}
            variant="primary"
            size="sm"
            className="mt-5"
          >
            {messages.liveQuoteSection.cta}
          </ButtonLink>
        </div>
      </SectionContainer>
    </div>
  );
}
