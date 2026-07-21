import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";
import { formatLocaleYear, getMessages, type AppLocale } from "@/locales";
import { StoreBadgeLink } from "../atoms/StoreBadgeLink";

type FooterSectionProps = {
  locale: AppLocale;
};

function resolveFooterHref(locale: AppLocale, href: string) {
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return href;
  }

  return `/${locale}${href}`;
}

export function FooterSection({ locale }: FooterSectionProps) {
  const messages = getMessages(locale);
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const { googlePlayAlt, appStoreAlt } = messages.appPromoSection;
  const footerNavigationGroups = [
    {
      label: messages.footer.brandTitle,
      items: messages.footer.brandItems,
    },
    {
      label: messages.footer.helpTitle,
      items: [...messages.footer.helpItems, messages.footer.faqItem],
    },
  ];

  return (
    <footer className="border-t border-line bg-black">
      <SectionContainer className="py-10 sm:py-12">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[2fr_1fr_1fr_1.5fr]">
            <div className="space-y-4">
              <Link href={`/${locale}`} className="flex items-center gap-3">
                <Image
                  src="/assets/logo-utama.png"
                  alt={messages.footer.logoAlt}
                  preload
                  sizes="220px"
                  width={500}
                  height={500}
                  className="h-auto w-70 object-contain"
                />
              </Link>

              <p className="text-sm text-white/80 leading-7 text-justify">
                {messages.footer.investmentWarning}
              </p>

              {/* Certification */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center rounded-xl bg-white p-4">
                  <Image
                    src="/assets/logo-komdigi-nav-4.png"
                    alt={messages.footer.komdigiAlt}
                    width={100}
                    height={29}
                    className="h-10 max-h-10 w-auto object-contain"
                  />
                </div>

                <div className="flex items-center justify-center rounded-xl bg-white p-4">
                  <Image
                    src="/assets/logo TSI.png"
                    alt={messages.footer.tsiAlt}
                    width={100}
                    height={29}
                    className="h-10 max-h-10 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {footerNavigationGroups.map((group) => (
              <div key={group.label}>
                <h6 className="font-bold text-white">{group.label}</h6>

                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item.label}
                      className="text-sm leading-7 text-white/70"
                    >
                      <Link
                        href={resolveFooterHref(locale, item.href)}
                        className="hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="space-y-4">
              <h6 className="font-bold text-white">MEDIA SOSIAL</h6>

              <div className="flex items-center gap-4">
                {messages.footer.socials.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    title={item.name}
                    aria-label={item.name}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-colors hover:text-yellow-800"
                  >
                    <FontAwesomeIcon
                      icon={["fab", item.icon] as IconProp}
                    />
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StoreBadgeLink
                  href={googlePlayLink}
                  alt={googlePlayAlt}
                  imageSrc="/assets/gp-button.png"
                  sizes="(max-width: 640px) 120px, 140px"
                  imageClassName="h-auto w-full object-contain"
                  className="inline-flex w-30 sm:w-35"
                />

                <StoreBadgeLink
                  href={appStoreLink}
                  alt={appStoreAlt}
                  imageSrc="/assets/as-button.png"
                  sizes="(max-width: 640px) 120px, 140px"
                  imageClassName="h-auto w-full object-contain"
                  className="inline-flex w-30 sm:w-35"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-red-800 p-4 text-xs text-zinc-100">
            <p className="font-bold">
              {messages.footer.disclaimerLabel}
            </p>
            <p>{messages.footer.disclaimerBody}</p>
          </div>

          <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
            <div className="text-center text-white md:text-left">
              <p>
                &copy; {formatLocaleYear(new Date(), locale)}{" "}
                {messages.app.brandName}.{" "}
                {messages.footer.copyrightProtected}
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
