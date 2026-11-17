import Image from "next/image";

import type { ClientAreaTradePilotFooterCopy } from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotFooterSectionProps = {
  copy: ClientAreaTradePilotFooterCopy;
};

export function ClientAreaTradePilotFooterSection({
  copy,
}: ClientAreaTradePilotFooterSectionProps) {
  return (
    <footer className="overflow-hidden rounded-3xl">
      <div className="space-y-4">
        <div className="mx-4 flex flex-col gap-4 rounded-2xl border border-amber-700/50 bg-amber-500/15 p-5 sm:mx-6 sm:flex-row sm:items-center sm:p-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black/25">
            <Image
              alt={copy.logoAlt}
              className="h-11 w-11 object-contain"
              height={44}
              src="/assets/logo-tp.webp"
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
