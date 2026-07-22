import { SectionEyebrow } from "@/components/atoms/SectionEyebrow";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { ContactOverviewDetails } from "@/components/molecules/ContactOverviewDetails";
import type { AppMessages } from "@/locales";

type ContactOverviewSectionProps = {
  copy: AppMessages["contactPage"]["overview"];
  companyName: string;
  address: string;
  updatedAtLabel: string | null;
  phone?: string;
  phoneHref?: string;
  email?: string;
  complaintLink?: string;
};

export function ContactOverviewSection({
  copy,
  companyName,
  address,
  updatedAtLabel,
}: ContactOverviewSectionProps) {
  return (
    <ScrollReveal
      effect="fade-up"
      className="rounded-[28px] border border-yellow-500/18 bg-[linear-gradient(135deg,rgba(205,161,58,0.14),rgba(14,14,14,0.96)_45%,rgba(8,8,8,0.98))] p-6 shadow-lg sm:p-8"
    >
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] xl:items-center">
        <div className="h-full">
          <SectionEyebrow>{copy.eyebrow}</SectionEyebrow>

          <h2 className="mt-5 font-mono text-2xl font-bold capitalize leading-tight tracking-[-0.04em] text-white sm:text-3xl md:text-4xl">
            {copy.title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
            {copy.description}
          </p>
        </div>

        <ContactOverviewDetails
          copy={copy}
          companyName={companyName}
          address={address}
          updatedAtLabel={updatedAtLabel}
        />
      </div>
    </ScrollReveal>
  );
}
