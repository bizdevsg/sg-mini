import { LocoLondonGoldHistoryArticle } from "@/components/molecules/LocoLondonGoldHistoryArticle";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { LocoLondonGoldArticleSection } from "@/locales/loco-london-gold-page";

type LocoLondonGoldHistorySectionProps = {
  title: string;
  subtitle: string;
  items: LocoLondonGoldArticleSection[];
};

export function LocoLondonGoldHistorySection({
  title,
  subtitle,
  items,
}: LocoLondonGoldHistorySectionProps) {
  return (
    <SectionContainer className="py-16 md:py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

      <div className="mx-auto">
        <div className="grid gap-6">
          {items.map((item, index) => (
            <ScrollReveal
              key={item.title}
              effect={index % 2 === 0 ? "fade-right" : "fade-left"}
              delay={Math.min(index * 140, 420)}
            >
              <LocoLondonGoldHistoryArticle item={item} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
