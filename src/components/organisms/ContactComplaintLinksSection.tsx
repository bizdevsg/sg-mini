import { SectionContainer } from "@/components/atoms/SectionContainer";

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
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="font-bold uppercase transition hover:text-yellow-500 sm:text-2xl"
          >
            {item.label}
          </a>
        ))}
      </div>
    </SectionContainer>
  );
}
