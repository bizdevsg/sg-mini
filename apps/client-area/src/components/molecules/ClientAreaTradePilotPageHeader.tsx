import { CreditCard, Info, Lock } from "lucide-react";
import Image from "next/image";

import { ClientAreaTradePilotMarketSession } from "@/components/molecules/ClientAreaTradePilotMarketSession";
import { formatTradePilotDateTime } from "@/lib/trade-pilot/trade-pilot-format";

import type { ClientAreaTradePilotCopy } from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotCreditBalance,
} from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPageHeaderProps = {
  copy: ClientAreaTradePilotCopy;
  credit?: TradePilotCreditBalance;
  /** Analysis is locked (e.g. live equity below the minimum). */
  locked?: boolean;
  locale: "id" | "en";
};

export function ClientAreaTradePilotPageHeader({
  copy,
  credit,
  locked = false,
  locale,
}: ClientAreaTradePilotPageHeaderProps) {
  // Demo kedaluwarsa: tampilkan akhir masa akses, bukan jadwal reset.
  const quotaTooltipLines: string[] = [];
  if (credit?.expired && credit.trialEndsAt) {
    quotaTooltipLines.push(
      copy.quotaNotice.trialEndedLabel.replace("{date}", formatTradePilotDateTime(credit.trialEndsAt, locale)),
    );
  } else {
    if (credit?.resetsAt) {
      quotaTooltipLines.push(
        copy.quotaResetLabel.replace("{date}", formatTradePilotDateTime(credit.resetsAt, locale)),
      );
    }
    // Masa akses demo (trialEndsAt hanya ada untuk akun demo).
    if (credit?.trialEndsAt) {
      quotaTooltipLines.push(
        copy.quotaNotice.demoTrialInfo.replace("{date}", formatTradePilotDateTime(credit.trialEndsAt, locale)),
      );
    }
  }
  // Token unlimited: tidak ada jadwal reset / masa akses yang relevan.
  const quotaTooltip =
    !credit?.unlimited && quotaTooltipLines.length ? quotaTooltipLines.join(" ") : null;

  return (
    <div className="relative z-30 flex min-w-0 flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 sm:flex">
          {/* Dekoratif: nama produk sudah ada di judul. */}
          <Image
            alt=""
            className="h-10 w-10 object-contain"
            height={40}
            src="/assets/logo-tp.webp"
            width={40}
          />
        </span>
        <div className="min-w-0">
          {/* Tooltip diposisikan terhadap baris judul supaya tidak keluar layar di HP. */}
          <div className="relative flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{copy.title}</h1>
            <span className="group flex shrink-0">
              <button
                type="button"
                aria-describedby="trade-pilot-description"
                aria-label={copy.title}
                className="flex rounded-full text-yellow-500/60 transition hover:text-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50"
              >
                <Info aria-hidden="true" className="h-5 w-5" />
              </button>
              <span
                id="trade-pilot-description"
                role="tooltip"
                className="pointer-events-none absolute left-0 top-full z-40 mt-2 w-max max-w-[min(22rem,100%)] rounded-xl border border-zinc-700 bg-zinc-900/95 px-3 py-2 text-xs leading-5 text-zinc-200 opacity-0 shadow-xl backdrop-blur-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
              >
                {copy.description}
              </span>
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              {copy.partnerLabel}
            </p>
            <p className="text-xs text-zinc-500">{copy.poweredByLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 2xl:flex 2xl:w-auto 2xl:shrink-0">
        <div className="relative z-20 flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-500/10 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-lg sm:rounded-full sm:px-5">
          {locked ? (
            <Lock aria-hidden="true" className="h-7 w-7 shrink-0 text-amber-400" />
          ) : (
            <CreditCard className="h-7 w-7 shrink-0 text-yellow-400" />
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">
              {!credit ? "—" : credit.unlimited ? copy.quotaUnlimitedLabel : `${credit.remaining}/${credit.allowance}`}
            </span>
            <span className="text-xs text-zinc-400">{copy.quotaLabel}</span>
          </div>
          {quotaTooltip ? (
            // Tooltip waktu reset kuota: tampil saat hover atau fokus (tap di layar sentuh).
            <span className="group relative ml-auto z-10 shrink-0">
              <button
                type="button"
                aria-describedby="trade-pilot-quota-reset"
                aria-label={quotaTooltip}
                className={`flex rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 ${(credit?.remaining ?? 0) < 1 ? "text-amber-400" : "text-yellow-500/60 hover:text-yellow-400"
                  }`}
              >
                <Info className="h-5 w-5" />
              </button>

              <div
                id="trade-pilot-quota-reset"
                role="tooltip"
                className="pointer-events-none absolute right-0 top-full z-40 mt-2 w-max max-w-[16rem] rounded-xl border border-zinc-700 bg-zinc-900/95 px-3 py-2 text-xs text-yellow-200 opacity-0 shadow-xl backdrop-blur-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
              >
                {quotaTooltipLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </span>
          ) : null}
        </div>

        <ClientAreaTradePilotMarketSession copy={copy} />
      </div>
    </div>
  );
}
