"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";

import { ClientAreaTradePilotAlertToggle } from "@/components/atoms/ClientAreaTradePilotAlertToggle";
import { ClientAreaTradePilotAlertLevelRow } from "@/components/molecules/ClientAreaTradePilotAlertLevelRow";
import type { ClientAreaTradePilotPriceAlertCopy } from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotAnalysisResult } from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPriceAlertSectionProps = {
  analysis: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotPriceAlertCopy;
};

export function ClientAreaTradePilotPriceAlertSection({
  analysis,
  copy,
}: ClientAreaTradePilotPriceAlertSectionProps) {
  const [enabled, setEnabled] = useState(false);
  const levels =
    analysis.direction === "bearish" ? analysis.sellLevels : analysis.buyLevels;

  return (
    <section className="rounded-3xl border border-zinc-800 bg-[#101113]/50 p-5 sm:p-7">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-orange-400">
            <BellRing className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-white">
              {copy.title}
            </h2>
            <p className="mt-1 text-[11px] leading-4 text-zinc-400">
              {copy.description}
            </p>
          </div>
        </div>
        <ClientAreaTradePilotAlertToggle
          checked={enabled}
          label={copy.toggleLabel}
          onChange={setEnabled}
        />
      </header>

      <div className="mt-6">
        <span
          aria-live="polite"
          className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${
            enabled
              ? "border-orange-500/50 bg-orange-500/15 text-orange-400"
              : "border-zinc-600 bg-zinc-700/50 text-zinc-400"
          }`}
        >
          {copy.statusLabel}: {enabled ? copy.activeLabel : copy.inactiveLabel}
        </span>
      </div>

      <div className="mt-7 grid gap-3 lg:grid-cols-2">
        <ClientAreaTradePilotAlertLevelRow
          label={copy.entryLabel}
          status={copy.triggeredLabel}
          statusTone="triggered"
          value={levels.entry}
        />
        <ClientAreaTradePilotAlertLevelRow
          label={copy.stopLossLabel}
          status={copy.triggeredLabel}
          statusTone="triggered"
          value={levels.stopLoss}
        />
        <ClientAreaTradePilotAlertLevelRow
          label={copy.takeProfitOneLabel}
          status={copy.cancelledLabel}
          statusTone="cancelled"
          value={levels.takeProfitOne}
        />
        <ClientAreaTradePilotAlertLevelRow
          label={copy.takeProfitTwoLabel}
          status={copy.cancelledLabel}
          statusTone="cancelled"
          value={levels.takeProfitTwo}
        />
      </div>
    </section>
  );
}
