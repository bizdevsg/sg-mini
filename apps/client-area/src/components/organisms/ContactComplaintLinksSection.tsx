import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ScrollReveal } from "../molecules/ScrollReveal";

type ContactComplaintLinksSectionProps = {
  items: Array<{
    href: string;
    label: string;
  }>;
};

export function ContactComplaintLinksSection({
  items,
}: ContactComplaintLinksSectionProps) {
  return (
    <SectionContainer className="border-t border-line py-16 md:py-20">
      <div className="grid gap-4">
        {items.map((item, index) => (
          <ScrollReveal effect="fade-right" delay={index * 250} key={item.href}>
            <a
              href={item.href}
              className="font-bold uppercase transition hover:text-yellow-500 sm:text-2xl"
            >
              {item.label}
            </a>
          </ScrollReveal>
        ))}
      </div>
    </SectionContainer>
  );
}
