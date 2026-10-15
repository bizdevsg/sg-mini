import { CreditCard, Info } from "lucide-react";

import type { ClientAreaTradePilotCopy } from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotCreditBalance,
  TradePilotMode,
} from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPageHeaderProps = {
  copy: ClientAreaTradePilotCopy;
  credit?: TradePilotCreditBalance;
  mode: TradePilotMode;
  onModeChange: (mode: TradePilotMode) => void;
  availableModes: TradePilotMode[];
  mockDataLabel: string;
};

export function ClientAreaTradePilotPageHeader({
  copy,
  credit,
  mode,
  onModeChange,
  availableModes,
  mockDataLabel,
}: ClientAreaTradePilotPageHeaderProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold text-white sm:text-xl">{copy.title}</h1>
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
            {mockDataLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          {copy.description}
        </p>
      </div>

      <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 2xl:flex 2xl:w-auto 2xl:shrink-0">
        {/* <div className="flex rounded-2xl border border-zinc-700 bg-[#101113] p-1 sm:rounded-full">
          {availableModes.map((availableMode) => (
            <button
              key={availableMode}
              type="button"
              onClick={() => onModeChange(availableMode)}
              className={`flex-1 rounded-xl px-4 py-2 text-xs font-bold transition sm:rounded-full ${mode === availableMode ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}
            >
              {availableMode === "demo" ? copy.demoModeLabel : copy.realModeLabel}
            </button>
          ))}
        </div> */}
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-500/10 bg-zinc-500/10 px-4 py-2.5 backdrop-blur-lg sm:rounded-full sm:px-5">
          <CreditCard className="h-7 w-7 shrink-0 text-yellow-400" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">
              {credit ? `${credit.remaining}/${credit.allowance}` : "—"}
            </span>
            <span className="text-xs text-zinc-400">{copy.quotaLabel}</span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-500/10 bg-zinc-500/10 px-4 py-2.5 backdrop-blur-lg sm:rounded-full sm:px-5">
          <span className="shrink-0 animate-pulse rounded-full bg-yellow-500/40 p-1">
            <span className="block h-2.5 w-2.5 rounded-full bg-yellow-500" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">
              {copy.sessionValue}
            </span>
            <span className="text-xs text-zinc-400">{copy.sessionLabel}</span>
          </div>
          <Info className="h-5 w-5 shrink-0 text-yellow-500/60" />
        </div>
      </div>
    </div>
  );
}
