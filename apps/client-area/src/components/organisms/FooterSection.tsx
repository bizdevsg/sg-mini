import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/SectionContainer";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";
import { formatLocaleYear, getMessages, type AppLocale } from "@/locales";
import { StoreBadgeLink } from "../atoms/StoreBadgeLink";
import { ChevronRight, Info } from "lucide-react";

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

  return (
    <footer className="border-t border-line bg-black">
      <SectionContainer className="py-10 sm:py-12">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.5fr_2fr_0.8fr_0.8fr]">
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

              <p className="text-sm text-white/80 leading-7">
                {messages.footer.desc}
              </p>

              <div className="space-y-3">
                <h6 className="font-bold text-yellow-500">MEDIA SOSIAL</h6>

                <div className="grid grid-cols-5 gap-4">
                  {messages.footer.socials.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      title={item.name}
                      aria-label={item.name}
                      className="inline-flex max-w-15 h-auto w-full aspect-square items-center justify-center rounded-full border-2 border-yellow-500 hover:border-yellow-800 text-yellow-500 transition-colors hover:text-yellow-800 mx-auto"
                    >
                      <FontAwesomeIcon
                        icon={["fab", item.icon] as IconProp}
                        className="text-2xl"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h6 className="font-bold text-yellow-500">{messages.footer.legalTitle}</h6>

              <ul className="mt-5">
                {messages.footer.legalItems.map((item) => (
                  <li
                    key={`${item.label}-${item.number}`}
                    className="text-xs leading-7 text-white/70"
                  >
                    <span className="font-semibold text-white/85">{item.label}:</span>{" "}
                    {item.number}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="font-bold text-yellow-500">{messages.footer.brandTitle}</h6>

              <ul className="mt-5 space-y-3">
                {messages.footer.brandItems.map((item) => (
                  <li
                    key={item.label}
                    className="text-sm leading-7 text-white/70"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-5 text-yellow-500" />

                      <Link
                        href={resolveFooterHref(locale, item.href)}
                        className="hover:underline"
                      >
                        {item.label}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex flex-row xl:flex-col items-center gap-3 w-fit">
                <StoreBadgeLink
                  href={googlePlayLink}
                  alt={googlePlayAlt}
                  imageSrc="/assets/GOOGLE-PLAY.png"
                  sizes="300"
                  imageClassName="h-auto w-full object-contain"
                  className="inline-flex w-full max-w-50"
                />

                <StoreBadgeLink
                  href={appStoreLink}
                  alt={appStoreAlt}
                  imageSrc="/assets/APPS-STORE.png"
                  sizes="300"
                  imageClassName="h-auto w-full object-contain"
                  className="inline-flex w-full max-w-50"
                />
              </div>

              {/* Certification */}
              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center justify-center rounded-xl bg-white p-3">
                  <Image
                    src="/assets/logo-komdigi.png"
                    alt={messages.footer.komdigiAlt}
                    width={100}
                    height={29}
                    className="h-10 max-h-10 w-auto object-contain"
                  />
                </div>

                <div className="flex items-center justify-center rounded-xl bg-white p-3">
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
          </div>

          <hr className="border border-yellow-50/50" />

          <div className="space-y-2 rounded-lg bg-red-950 p-4 text-xs text-zinc-100">
            <div className="flex items-start gap-2">
              <Info className="text-yellow-500" />
              <p className="mt-1"><span className="text-yellow-500 font-semibold">{messages.footer.disclaimerLabel}</span> <span>{messages.footer.disclaimerBody}</span></p>
            </div>
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
