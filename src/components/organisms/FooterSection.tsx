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
  const footerMenuGroups = messages.navbar.menuGroups.filter(
    (group) => group.items && group.items.length > 0,
  );

  return (
    <footer className="border-t border-line bg-black">
      <SectionContainer className="py-10 sm:py-12">
        <div>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(320px,1fr)_minmax(0,2fr)]">

              <div className="space-y-4">
                <Link href={`/${locale}`} className="flex items-center gap-3">
                  <Image src={"/assets/Logo SG-WEB111.png"} alt={messages.footer.logoAlt} height={50} width={50} className="w-7 h-auto" />
                  <h4 className="font-serif text-white font-semibold text-lg">{messages.footer.companyName}</h4>
                </Link>

                <p className="text-white/80 text-sm">
                  {messages.footer.investmentWarning}
                </p>

                <div className="flex flex-wrap gap-4 justify-start">
                  {messages.footer.socials.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      title={item.name}
                      className="inline-flex items-center justify-center gap-2 h-8 w-8 bg-white text-black hover:text-yellow-800 rounded-full text-center hover:underline"
                      aria-label={item.name}
                    >
                      <FontAwesomeIcon icon={["fab", item.icon] as IconProp} />
                    </a>
                  ))}
                </div>

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
                              <span>{item.label}</span>
                            </li>
                          );
                        }

                        const href = resolveFooterHref(locale, item.href);

                        return (
                          <li
                            key={item.label}
                            className="text-sm leading-7 text-white/70"
                          >
                            <Link href={href} className="hover:underline">
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

            <div className="text-xs text-zinc-400 bg-zinc-800 rounded-lg p-4 space-y-2">
              <p>{messages.footer.disclaimerLabel}</p>
              <p>{messages.footer.disclaimerBody}</p>
            </div>

            <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
              <div className="text-center text-white md:text-left">
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
