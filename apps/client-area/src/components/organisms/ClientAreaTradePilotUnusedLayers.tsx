import { ChevronUp, TriangleAlert } from "lucide-react";

import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotUnusedLayersProps = {
  copy: ClientAreaTradePilotTradingPlanCopy;
  entry: string;
  lot: string;
  margin: number;
  riskBudget: number;
  stopLoss: string;
  tradingCapital: number;
  variant: "buy" | "sell";
};

function formatMoney(value: number) {
  return `$${Math.max(0, value).toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })}`;
}

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ClientAreaTradePilotUnusedLayers({
  copy,
  entry,
  lot,
  margin,
  riskBudget,
  stopLoss,
  tradingCapital,
  variant,
}: ClientAreaTradePilotUnusedLayersProps) {
  const entryValue = Number(entry);
  const stopLossValue = Number(stopLoss);
  const distance = Math.abs(entryValue - stopLossValue) || 1;
  const direction = variant === "buy" ? -1 : 1;
  const hardRiskLimit = riskBudget * 2;
  const candidates = [
    { entry: entryValue + direction * distance * 0.5, position: 1, riskFactor: 2.53 },
    { entry: entryValue + direction * distance * 0.85, position: 2, riskFactor: 3.1 },
  ];

  return (
    <div className="mt-5 space-y-3" role="tabpanel">
      {candidates.map((candidate, index) => {
        const usedMargin = margin * (candidate.position + 1);
        const totalRisk = riskBudget * candidate.riskFactor;
        const totalFunds = usedMargin + totalRisk;
        const additionalLimit = Math.max(0, totalRisk - hardRiskLimit);
        const remainingFunds = tradingCapital - totalFunds;

        return (
          <details
            className="group rounded-2xl border border-zinc-700 bg-[#171924]/90 p-4 open:border-amber-500/70 open:bg-amber-950/25"
            key={candidate.position}
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">
                <strong className="block text-sm text-white">
                  {copy.unusedPositionLabel
                    .replace("{position}", String(candidate.position))
                    .replace("{entry}", formatPrice(candidate.entry))}
                </strong>
                <span className="mt-1 block text-xs text-zinc-400">
                  {lot} {copy.lotUnitLabel} · {copy.exceedsAccumulatedRiskLabel}
                </span>
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-3 text-xs font-bold text-amber-500">
                {copy.notUsedLabel}
                <ChevronUp className="h-4 w-4 rotate-180 text-zinc-400 transition-transform group-open:rotate-0" />
              </span>
            </summary>

            <div className="mt-4 border-t border-amber-500/50 pt-3">
              <div className="rounded-xl bg-amber-950/45 p-3 text-xs leading-5">
                <strong className="block text-amber-500">
                  {copy.conditionalFinancialPlanLabel}
                </strong>
                <p className="text-zinc-200">
                  {copy.conditionalFinancialPlanDescription}
                </p>
              </div>

              <dl className="mt-4 space-y-2 text-xs text-zinc-200">
                <div className="flex justify-between gap-4">
                  <dt>{copy.marginUsedUntilHereLabel}</dt>
                  <dd className="font-semibold text-white">{formatMoney(usedMargin)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{copy.totalRiskAtFinalStopLabel}</dt>
                  <dd className="font-semibold text-white">{formatMoney(totalRisk)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{copy.totalFundsAtFinalStopLabel}</dt>
                  <dd className="font-semibold text-white">{formatMoney(totalFunds)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{copy.additionalLossLimitLabel}</dt>
                  <dd className="font-semibold text-white">
                    {formatMoney(additionalLimit)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{copy.remainingFundsLabel}</dt>
                  <dd className="font-semibold text-white">
                    {formatMoney(remainingFunds)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 flex gap-2 text-xs leading-5 text-amber-500">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {copy.manualOrderWarning}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
