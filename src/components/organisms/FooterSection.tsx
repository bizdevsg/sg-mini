import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { formatLocaleYear, getMessages, type AppLocale } from "@/locales";

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

  const footerMenuGroups = messages.navbar.menuGroups.filter(
    (group) => group.items && group.items.length > 0,
  );

  return (
    <footer className="border-t border-line bg-black">
      <SectionContainer className="py-10 sm:py-12">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(320px,1fr)_minmax(0,2fr)]">
            <div className="space-y-4">
              <Link href={`/${locale}`} className="flex items-center gap-3">
                <Image
                  src="/assets/logo-utama.png"
                  alt={messages.footer.logoAlt}
                  preload
                  sizes="220px"
                  width={500}
                  height={500}
                  className="hidden h-auto w-70 object-contain sm:block"
                />
              </Link>

              <p className="text-sm text-white/80 leading-7">
                {messages.footer.investmentWarning}
              </p>

              {/* Certification */}
              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center justify-center rounded-xl bg-white p-4">
                  <Image
                    src="/assets/logo-komdigi.png"
                    alt={messages.footer.komdigiAlt}
                    width={140}
                    height={40}
                    className="h-10 max-h-13 w-auto object-contain"
                  />
                </div>

                <div className="flex items-center justify-center rounded-xl bg-white p-4">
                  <Image
                    src="/assets/logo TSI.png"
                    alt={messages.footer.tsiAlt}
                    width={140}
                    height={40}
                    className="h-10 max-h-13 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {footerMenuGroups.map((group) => (
                <div key={group.label}>
                  <h6 className="font-bold text-white">{group.label}</h6>

                  <ul className="mt-5 space-y-3">
                    {group.items?.map((item) => {
                      if (!item.href) {
                        return (
                          <li
                            key={item.label}
                            className="text-sm leading-7 text-white/50"
                          >
                            {item.label}
                          </li>
                        );
                      }

                      return (
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
                      );
                    })}
                  </ul>
                </div>
              ))}
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

            <div className="flex flex-wrap justify-start gap-4">
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
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}