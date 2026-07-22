import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ContactMetaLabel } from "@/components/atoms/ContactMetaLabel";
import { ContactSupportItemCard } from "@/components/molecules/ContactSupportItemCard";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import type { AppMessages } from "@/locales";

type ContactSupportItem = {
  title: string;
  description: string;
  value: string;
  icon: IconProp;
  href?: string;
};

type ContactSupportSectionProps = {
  copy: AppMessages["contactPage"]["support"];
  overviewCopy: AppMessages["contactPage"]["overview"];
  companyName: string;
  updatedAtLabel: string | null;
  items: ContactSupportItem[];
};

export function ContactSupportSection({
  copy,
  overviewCopy,
  companyName,
  updatedAtLabel,
  items,
}: ContactSupportSectionProps) {
  return (
    <ScrollReveal
      effect="fade-left"
      className="rounded-2xl border border-line bg-[#0f0f0f] p-6 shadow-lg sm:p-8"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
          <FontAwesomeIcon icon={["fas", "headset"]} className="text-base" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white sm:text-xl">
            {copy.title}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-400">{copy.description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <ContactMetaLabel>{overviewCopy.companyLabel}</ContactMetaLabel>
          <p className="mt-2 text-sm font-semibold text-white">{companyName}</p>
        </div>

        {updatedAtLabel ? (
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <ContactMetaLabel>{overviewCopy.updatedLabel}</ContactMetaLabel>
            <p className="mt-2 text-sm text-zinc-300">{updatedAtLabel}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {items.map((item) => (
          <ContactSupportItemCard key={item.title} {...item} />
        ))}
      </div>
    </ScrollReveal>
  );
}
