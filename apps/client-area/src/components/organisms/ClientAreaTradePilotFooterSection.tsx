import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

import { StoreBadgeLink } from "@/components/atoms/StoreBadgeLink";
import {
  CLIENT_AREA_TRADE_PILOT_APP_LINKS,
  type ClientAreaTradePilotFooterCopy,
} from "@/lib/client-area-trade-pilot.shared";
import type { AppLocale } from "@/locales";

type ClientAreaTradePilotFooterSectionProps = {
  copy: ClientAreaTradePilotFooterCopy;
  locale: AppLocale;
};

export function ClientAreaTradePilotFooterSection({
  copy,
  locale,
}: ClientAreaTradePilotFooterSectionProps) {
  const legalLinks = [
    { href: `/${locale}/privacy-policy`, label: copy.privacyLabel },
    { href: `/${locale}/syarat-dan-ketentuan`, label: copy.termsLabel },
    { href: `/${locale}/contact-us`, label: copy.helpLabel },
    { href: `/${locale}/contact-us`, label: copy.deleteAccountLabel },
  ];

  return (
    <footer className="overflow-hidden rounded-3xl">
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 sm:text-xs">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 text-xl font-black text-white sm:text-2xl">
            {copy.title}
          </h2>
          <p className="mt-2 text-xs text-zinc-400 sm:text-sm">
            {copy.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <StoreBadgeLink
              alt={copy.googlePlayAlt}
              className="inline-flex w-40 p-1 transition hover:bg-amber-400/10 sm:w-44"
              href={CLIENT_AREA_TRADE_PILOT_APP_LINKS.googlePlay}
              imageClassName="h-auto w-full object-contain"
              imageSrc="/assets/GOOGLE-PLAY.png"
              sizes="176px"
            />

            <StoreBadgeLink
              alt={copy.appStoreAlt}
              className="inline-flex w-40 p-1 transition hover:bg-amber-400/10 sm:w-44"
              href={CLIENT_AREA_TRADE_PILOT_APP_LINKS.appStore}
              imageClassName="h-auto w-full object-contain"
              imageSrc="/assets/APPS-STORE.png"
              sizes="176px"
            />
          </div>
        </div>

        <div className="mx-4 flex flex-col gap-4 rounded-2xl border border-amber-700/50 bg-amber-500/15 p-5 sm:mx-6 sm:flex-row sm:items-center sm:p-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black/25">
            <Image
              alt={copy.logoAlt}
              className="h-11 w-11 object-contain"
              height={44}
              src="/assets/logo-tp.png"
              width={44}
            />
          </span>
          <div>
            <h3 className="text-sm font-bold text-amber-400 sm:text-base">
              {copy.supportTitle}
            </h3>
            <p className="mt-2 text-xs leading-5 text-zinc-300 sm:text-sm">
              {copy.supportDescription}
            </p>
          </div>
        </div>

        {/* <p className="px-5 text-center text-[11px] leading-5 text-zinc-400 sm:px-7 sm:text-xs">
          <span className="font-semibold text-zinc-300">{copy.disclaimerLabel}</span>{" "}
          {copy.disclaimerDescription}
        </p> */}

        {/* <div className="border-t border-zinc-700 px-5 pt-4 sm:px-7">
          <div className="flex flex-col items-center justify-between gap-6 xl:flex-row">
            <nav aria-label={copy.legalNavigationLabel}>
              <ul className="flex flex-wrap items-center justify-center gap-x-0 gap-y-3 text-xs font-semibold text-zinc-200 sm:text-sm">
                {legalLinks.map((item, index) => (
                  <li className="flex items-center" key={item.label}>
                    {index > 0 ? (
                      <span aria-hidden="true" className="mx-4 text-zinc-600">
                        |
                      </span>
                    ) : null}
                    <Link className="transition hover:text-amber-400" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <a
                aria-label={copy.tiktokLabel}
                className="flex items-center gap-3 text-sm font-semibold text-white transition hover:text-amber-400"
                href="https://www.tiktok.com/@tradepilot.id"
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                  <FontAwesomeIcon
                    className="h-5 w-5"
                    icon={["fab", "tiktok"] as IconProp}
                  />
                </span>
                TradePilot.id
              </a>
              <span aria-hidden="true" className="hidden h-10 w-px bg-zinc-600 sm:block" />
              <p className="max-w-xs text-center text-[11px] leading-5 text-zinc-300 sm:text-left sm:text-xs">
                © {new Date().getFullYear()} {copy.copyright}
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
