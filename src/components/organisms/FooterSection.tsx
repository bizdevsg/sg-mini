import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SectionContainer } from "@/components/atoms/SectionContainer";
import { formatLocaleYear, getMessages, type AppLocale } from "@/locales";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <footer className="border-t border-line bg-black">
      <SectionContainer className="py-10 sm:py-12">
        <div>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <h6 className="font-bold text-yellow-500">
                  {messages.footer.brandTitle}
                </h6>
                <ul className="mt-5 space-y-3">
                  {messages.footer.brandItems.map((item) => {
                    const href = resolveFooterHref(locale, item.href);

                    return (
                      <li
                        key={item.label}
                        className="text-sm leading-7 text-yellow-500/72"
                      >
                        <Link href={href} className="hover:underline">
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h6 className="font-bold text-yellow-500">
                  {messages.footer.helpTitle}
                </h6>
                <ul className="mt-5 space-y-3">
                  {messages.footer.helpItems.map((item) => {
                    const href = resolveFooterHref(locale, item.href);

                    return (
                      <li
                        key={item.label}
                        className="text-sm leading-7 text-yellow-500/72"
                      >
                        <Link href={href} className="hover:underline">
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="grid gap-1">
                {messages.footer.legalItems.map((item) => (
                  <p
                    key={item}
                    className="text-sm leading-7 text-yellow-500/72"
                  >
                    {item}
                  </p>
                ))}

                <div className="mt-5 flex w-full items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Image
                      src="/assets/logo-komdigi.png"
                      alt={messages.footer.komdigiAlt}
                      width={50}
                      height={50}
                      className="max-h-10 min-h-10 w-auto object-contain"
                    />
                  </div>

                  <div className="p-2 bg-white rounded-lg">
                    <Image
                      src="/assets/logo TSI.png"
                      alt={messages.footer.tsiAlt}
                      width={160}
                      height={48}
                      className="max-h-10 min-h-10 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border border-yellow-500/20 rounded-full" />

            <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                {messages.footer.socials.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    title={item.name}
                    className="inline-flex items-center justify-center gap-2 h-8 w-8 bg-yellow-500 text-yellow-700 hover:text-yellow-800 rounded-full text-center hover:underline"
                    aria-label={item.name}
                  >
                    <FontAwesomeIcon icon={["fab", item.icon] as IconProp} />
                  </a>
                ))}
              </div>

              <div className="text-center text-yellow-500/72 md:text-left">
                <p>
                  &copy; {formatLocaleYear(new Date(), locale)}{" "}
                  {messages.app.brandName}. {messages.footer.copyrightProtected}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
