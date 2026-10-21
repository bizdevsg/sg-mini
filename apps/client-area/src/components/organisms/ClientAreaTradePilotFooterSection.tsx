import Image from "next/image";

import { StoreBadgeLink } from "@/components/atoms/StoreBadgeLink";
import {
  CLIENT_AREA_TRADE_PILOT_APP_LINKS,
  type ClientAreaTradePilotFooterCopy,
} from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotFooterSectionProps = {
  copy: ClientAreaTradePilotFooterCopy;
};

export function ClientAreaTradePilotFooterSection({
  copy,
}: ClientAreaTradePilotFooterSectionProps) {
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

      </div>
    </footer>
  );
}
