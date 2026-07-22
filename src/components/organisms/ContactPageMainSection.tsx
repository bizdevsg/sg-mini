import type { IconProp } from "@fortawesome/fontawesome-svg-core";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { ContactMapSection } from "@/components/organisms/ContactMapSection";
import { ContactSupportSection } from "@/components/organisms/ContactSupportSection";
import { formatLocaleDateTime, type AppLocale, type AppMessages } from "@/locales";
import type { CompanyProfile } from "@/lib/company-profile";

type ContactPageMainSectionProps = {
  locale: AppLocale;
  copy: AppMessages["contactPage"];
  companyProfile: Pick<
    CompanyProfile,
    | "companyName"
    | "address"
    | "mapsEmbedUrl"
    | "phone"
    | "email"
    | "fax"
    | "complaintLink"
    | "updatedAt"
  >;
};

export function ContactPageMainSection({
  locale,
  copy,
  companyProfile,
}: ContactPageMainSectionProps) {
  const address = companyProfile.address || copy.headOffice.address;
  const phone = companyProfile.phone || copy.headOffice.phone;
  const normalizedPhone = phone.replace(/[^\d+]/g, "");
  const phoneHref = normalizedPhone
    ? `tel:${normalizedPhone}`
    : copy.headOffice.phoneHref;
  const email = companyProfile.email || copy.headOffice.email;
  const fax = companyProfile.fax || copy.headOffice.fax;
  const mapEmbedUrl =
    companyProfile.mapsEmbedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
  const companyName = companyProfile.companyName || copy.headOffice.title;
  const updatedAtLabel = companyProfile.updatedAt
    ? formatLocaleDateTime(companyProfile.updatedAt, locale)
    : null;
  const supportItems: Array<{
    title: string;
    description: string;
    value: string;
    icon: IconProp;
    href?: string;
  }> = [
      {
        title: copy.support.callTitle,
        description: copy.support.callDescription,
        value: phone,
        href: phoneHref,
        icon: ["fas", "phone"] as IconProp,
      },
      {
        title: copy.support.emailTitle,
        description: copy.support.emailDescription,
        value: email,
        href: `mailto:${email}`,
        icon: ["fas", "envelope"] as IconProp,
      },
      {
        title: copy.support.complaintTitle,
        description: copy.support.complaintDescription,
        value: copy.support.complaintValue,
        href: companyProfile.complaintLink,
        icon: ["fas", "headset"] as IconProp,
      },
      {
        title: copy.support.faxTitle,
        description: copy.support.faxDescription,
        value: fax,
        icon: ["fas", "fax"] as IconProp,
      },
    ];

  return (
    <SectionContainer className="relative py-16 sm:py-20">
      <div className="absolute top-0 left-1/2 h-25 w-screen -translate-x-1/2 bg-linear-to-b from-black to-transparent" />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <ContactMapSection
          copy={copy.map}
          overviewCopy={copy.overview}
          mapEmbedUrl={mapEmbedUrl}
          address={address}
          companyName={companyName}
        />

        <ContactSupportSection
          copy={copy.support}
          overviewCopy={copy.overview}
          companyName={companyName}
          updatedAtLabel={updatedAtLabel}
          items={supportItems}
        />
      </div>
    </SectionContainer>
  );
}
