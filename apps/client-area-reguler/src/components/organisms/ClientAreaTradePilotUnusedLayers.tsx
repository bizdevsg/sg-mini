import { ChevronUp, TriangleAlert } from "lucide-react";

import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotPlanRejectedLevel } from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotUnusedLayersProps = {
  copy: ClientAreaTradePilotTradingPlanCopy;
  /** Kandidat layer yang ditolak mesin Adaptive Position Plan (backend). */
  layers: TradePilotPlanRejectedLevel[];
};

function formatMoney(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `$${Math.max(0, value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatLot(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ClientAreaTradePilotUnusedLayers({
  copy,
  layers,
}: ClientAreaTradePilotUnusedLayersProps) {
  if (layers.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-zinc-700 bg-zinc-900/90 p-5 text-sm text-zinc-300" role="tabpanel">
        {copy.noUnusedLayersLabel}
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3" role="tabpanel">
      {layers.map((layer, index) => (
        <details
          className="group rounded-2xl border border-zinc-700 bg-zinc-900/90 p-4 open:border-amber-500/70 open:bg-amber-950/25"
          key={`${layer.level}-${layer.price}`}
          open={index === 0}
        >
          <summary className="flex cursor-pointer list-none items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <strong className="block text-sm text-white">
                {copy.unusedPositionLabel
                  .replace("{position}", String(layer.level))
                  .replace("{entry}", String(layer.price))}
              </strong>
              <span className="mt-1 block text-xs text-zinc-400">
                {formatLot(layer.lot)} {copy.lotUnitLabel} · {copy.rejectReasonLabels[layer.rejectReason]}
              </span>
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-3 text-xs font-bold text-amber-500">
              {copy.notUsedLabel}
              <ChevronUp className="h-4 w-4 rotate-180 text-zinc-400 transition-transform group-open:rotate-0" />
            </span>
          </summary>

          <div className="mt-4 border-t border-amber-500/50 pt-3">
            {layer.financialAlternative ? (
              <div className="rounded-xl bg-amber-950/45 p-3 text-xs leading-5">
                <strong className="block text-amber-500">
                  {copy.conditionalFinancialPlanLabel}
                </strong>
                <p className="text-zinc-200">
                  {copy.conditionalFinancialPlanDescription}
                </p>
              </div>
            ) : null}

            <dl className="mt-4 space-y-2 text-xs text-zinc-200">
              <div className="flex justify-between gap-4">
                <dt>{copy.marginUsedUntilHereLabel}</dt>
                <dd className="font-semibold text-white">{formatMoney(layer.cumulativeDayMargin)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>{copy.totalRiskAtFinalStopLabel}</dt>
                <dd className="font-semibold text-white">{formatMoney(layer.estimatedRiskToStop)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>{copy.totalFundsAtFinalStopLabel}</dt>
                <dd className="font-semibold text-white">{formatMoney(layer.cumulativeFundsAtStop)}</dd>
              </div>
              {layer.financialAlternative ? (
                <div className="flex justify-between gap-4">
                  <dt>{copy.additionalLossLimitLabel}</dt>
                  <dd className="font-semibold text-white">
                    {formatMoney(layer.financialAlternative.additionalLossBudgetRequired)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt>{copy.remainingFundsLabel}</dt>
                <dd className="font-semibold text-white">{formatMoney(layer.remainingFundsAtStop)}</dd>
              </div>
            </dl>

            <p className="mt-4 flex gap-2 text-xs leading-5 text-amber-500">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {copy.manualOrderWarning}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
