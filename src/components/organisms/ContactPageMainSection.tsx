import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import type { AppMessages } from "@/locales";
import type { CompanyProfile } from "@/lib/company-profile";

import { ContactFormCard } from "./ContactFormCard";

type ContactPageMainSectionProps = {
  copy: AppMessages["contactPage"];
  companyProfile: Pick<
    CompanyProfile,
    "address" | "mapsEmbedUrl" | "phone" | "email" | "fax"
  >;
};

const SUPPORT_ICON_MAP = {
  phone: ["fas", "phone"] as IconProp,
  envelope: ["fas", "envelope"] as IconProp,
  headset: ["fas", "headset"] as IconProp,
  fax: ["fas", "fax"] as IconProp,
};

export function ContactPageMainSection({
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
  const supportItems = [
    {
      title: copy.support.callTitle,
      description: copy.support.callDescription,
      value: phone,
      href: phoneHref,
      icon: SUPPORT_ICON_MAP.phone,
    },
    {
      title: copy.support.emailTitle,
      description: copy.support.emailDescription,
      value: email,
      href: `mailto:${email}`,
      icon: SUPPORT_ICON_MAP.envelope,
    },
    {
      title: copy.support.complaintTitle,
      description: copy.support.complaintDescription,
      value: copy.headOffice.complaintPhone,
      href: copy.headOffice.complaintPhoneHref,
      icon: SUPPORT_ICON_MAP.headset,
    },
    {
      title: copy.support.faxTitle,
      description: copy.support.faxDescription,
      value: fax,
      icon: SUPPORT_ICON_MAP.fax,
    },
  ];

  return (
    <SectionContainer className="py-16 sm:py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-25 bg-linear-to-b from-black to-transparent" />

      <div className="grid gap-8 lg:grid-cols-2 md:gap-4">
        <div>
          <ContactFormCard copy={copy.form} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-[#0f0f0f] shadow-lg overflow-hidden">
            <iframe
              title={copy.map.iframeTitle}
              src={mapEmbedUrl}
              className="h-125 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="rounded-2xl border border-line bg-[#0f0f0f] p-6 shadow-lg sm:p-8">
            <div className="">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-500">
                  <FontAwesomeIcon
                    icon={["fas", "headset"]}
                    className="text-lg"
                  />
                </div>

                <h3 className="text-lg font-bold text-white sm:text-xl">
                  {copy.support.title}
                </h3>
              </div>

              <div className="min-w-0 flex-1">
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  {copy.support.description}
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-400">
                      {copy.support.hoursLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {copy.support.hoursValue}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {supportItems.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-lg bg-white/5 p-4"
                      >
                        <div className="mb-2 flex items-center gap-3">
                          <div className="text-yellow-500">
                            <FontAwesomeIcon icon={item.icon} />
                          </div>
                          <p className="text-xs font-medium uppercase text-gray-400">
                            {item.title}
                          </p>
                        </div>
                        <p className="mb-2 text-xs leading-relaxed text-gray-400">
                          {item.description}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="break-all text-sm font-semibold text-yellow-500 transition hover:text-yellow-400"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="break-all text-sm font-semibold text-yellow-500">
                            {item.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
