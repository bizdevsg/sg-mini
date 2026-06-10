import { SectionContainer } from "@/components/atoms/SectionContainer";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { getMessages, type AppLocale } from "@/locales";
import { StatCard } from "@/components/molecules/StatCard";

type TrustStatsSectionProps = {
  locale: AppLocale;
};

export function TrustStatsSection({ locale }: TrustStatsSectionProps) {
  const messages = getMessages(locale);

  return (
    <section className="border-b border-line">
      <SectionContainer className="py-16 sm:py-20">
        <div>
          <SectionTitle
            title={messages.trustStats.title}
            subtitle={messages.trustStats.subtitle}
          />
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {messages.trustStats.stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
