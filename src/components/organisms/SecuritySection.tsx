import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { getMessages, type AppLocale } from "@/locales";
import { SecurityCard } from "@/components/molecules/SecurityCard";

type SecuritySectionProps = {
  locale: AppLocale;
};

export function SecuritySection({ locale }: SecuritySectionProps) {
  const messages = getMessages(locale);
  const securityCards = messages.security.cards;
  const [featuredCard, ...supportingCards] = securityCards;

  if (!featuredCard) {
    return null;
  }

  return (
    <section className="bg-transparent">
      <SectionContainer className="py-16 sm:py-20 lg:py-18">
        <SectionTitle
          title={messages.security.title}
          subtitle={messages.security.subtitle}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.98fr)]">
          <SecurityCard item={featuredCard} />

          <div className="grid gap-4">
            {supportingCards.map((item) => (
              <SecurityCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
