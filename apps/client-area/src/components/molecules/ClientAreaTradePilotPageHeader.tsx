import { CreditCard, Info } from "lucide-react";

import { ClientAreaTradePilotMarketSession } from "@/components/molecules/ClientAreaTradePilotMarketSession";
import { formatTradePilotDateTime } from "@/lib/trade-pilot/trade-pilot-format";

import type { ClientAreaTradePilotCopy } from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotCreditBalance,
} from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPageHeaderProps = {
  copy: ClientAreaTradePilotCopy;
  credit?: TradePilotCreditBalance;
  locale: "id" | "en";
  mockDataLabel: string;
};

export function ClientAreaTradePilotPageHeader({
  copy,
  credit,
  locale,
  mockDataLabel,
}: ClientAreaTradePilotPageHeaderProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold text-white sm:text-xl">{copy.title}</h1>
          {credit?.source === "mock" ? (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
              {mockDataLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          {copy.description}
        </p>
      </div>

      <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 2xl:flex 2xl:w-auto 2xl:shrink-0">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-500/10 bg-zinc-900/70 px-4 py-2.5 backdrop-blur-lg sm:rounded-full sm:px-5">
          <CreditCard className="h-7 w-7 shrink-0 text-yellow-400" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">
              {credit ? `${credit.remaining}/${credit.allowance}` : "—"}
            </span>
            <span className="text-xs text-zinc-400">{copy.quotaLabel}</span>
          </div>
          {credit?.resetsAt ? (
            // Tooltip waktu reset kuota: tampil saat hover atau fokus (tap di layar sentuh).
            <span className="group relative ml-auto shrink-0">
              <button
                type="button"
                aria-describedby="trade-pilot-quota-reset"
                aria-label={copy.quotaResetLabel.replace("{date}", formatTradePilotDateTime(credit.resetsAt, locale))}
                className={`flex rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 ${credit.remaining < 1 ? "text-amber-400" : "text-yellow-500/60 hover:text-yellow-400"
                  }`}
              >
                <Info className="h-5 w-5" />
              </button>

              <div
                id="trade-pilot-quota-reset"
                role="tooltip"
                className="pointer-events-none absolute right-0 top-full z-30 mt-2 w-max max-w-[16rem] rounded-xl border border-zinc-700 bg-zinc-900/95 px-3 py-2 text-xs text-yellow-200 opacity-0 shadow-xl backdrop-blur-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
              >
                {copy.quotaResetLabel.replace("{date}", formatTradePilotDateTime(credit.resetsAt, locale))}
              </div>
            </span>
          ) : null}
        </div>

        <ClientAreaTradePilotMarketSession copy={copy} />
      </div>
    </div>
  );
}
