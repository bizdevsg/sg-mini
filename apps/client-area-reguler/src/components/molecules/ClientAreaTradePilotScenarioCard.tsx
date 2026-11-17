"use client";

import { Check, Copy, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

import type {
  ClientAreaTradePilotAnalysisResultCopy,
  ClientAreaTradePilotScenarioLevels,
} from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotScenarioCardProps = {
  copy: ClientAreaTradePilotAnalysisResultCopy;
  levels: ClientAreaTradePilotScenarioLevels;
  variant: "buy" | "sell";
};

export function ClientAreaTradePilotScenarioCard({
  copy,
  levels,
  variant,
}: ClientAreaTradePilotScenarioCardProps) {
  const [copied, setCopied] = useState(false);
  const isBuy = variant === "buy";
  const Icon = isBuy ? TrendingUp : TrendingDown;
  const title = isBuy ? copy.buyScenarioLabel : copy.sellScenarioLabel;
  const accentClass = isBuy ? "text-emerald-400" : "text-rose-400";
  const borderClass = isBuy
    ? "border-emerald-500/40 bg-emerald-500/10"
    : "border-rose-500/40 bg-rose-500/10";

  const handleCopy = async () => {
    const value = [
      `${title}`,
      `${copy.entryLabel}: ${levels.entry}`,
      `${copy.stopLossLabel}: ${levels.stopLoss}`,
      `${copy.takeProfitOneLabel}: ${levels.takeProfitOne}`,
      `${copy.takeProfitTwoLabel}: ${levels.takeProfitTwo}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied outside a secure browser context.
    }
  };

  return (
    <article className={`rounded-3xl border p-5 sm:p-6 ${borderClass}`}>
      <h4 className={`flex items-center gap-2 text-base font-bold ${accentClass}`}>
        <Icon className="h-5 w-5" />
        {title}
      </h4>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-zinc-400">{copy.entryLabel}</dt>
          <dd className="text-right font-bold text-white">
            {isBuy ? copy.aboveLabel : copy.belowLabel} {levels.entry}
            <span className="mt-1 block text-xs font-normal text-zinc-500">
              {isBuy ? copy.breakoutHint : copy.breakdownHint}
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">{copy.stopLossLabel}</dt>
          <dd className="font-bold text-rose-400">{levels.stopLoss}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">{copy.takeProfitOneLabel}</dt>
          <dd className="font-bold text-emerald-400">{levels.takeProfitOne}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">{copy.takeProfitTwoLabel}</dt>
          <dd className="font-bold text-emerald-400">{levels.takeProfitTwo}</dd>
        </div>
        <div className="flex justify-between gap-4 pt-2">
          <dt className="text-zinc-400">{copy.riskRewardLabel}</dt>
          <dd className="font-bold text-white">1:1.5</dd>
        </div>
      </dl>

      <p className="mt-5 border-t border-current/20 pt-4 text-sm leading-6 text-zinc-400">
        <strong className="text-zinc-200">{copy.reasonLabel}:</strong>{" "}
        {isBuy ? copy.buyReason : copy.sellReason}
      </p>

      <button
        type="button"
        onClick={handleCopy}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition hover:bg-white/5 ${accentClass}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? copy.copiedLabel : copy.copyLevelsLabel}
      </button>
    </article>
  );
}
