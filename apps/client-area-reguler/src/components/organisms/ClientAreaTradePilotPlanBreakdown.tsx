import {
  CircleHelp,
  Layers,
  ListChecks,
  ReceiptText,
  SlidersHorizontal,
} from "lucide-react";

import { ClientAreaTradePilotPlanMetric } from "@/components/atoms/ClientAreaTradePilotPlanMetric";
import { ClientAreaTradePilotPlanAccordion } from "@/components/molecules/ClientAreaTradePilotPlanAccordion";
import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotSidePositionPlan } from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPlanBreakdownProps = {
  accountLabel: string;
  copy: ClientAreaTradePilotTradingPlanCopy;
  /** Rencana satu sisi dari backend: semua posisi (entry awal + layer) & total. */
  sidePlan: TradePilotSidePositionPlan;
  tradingCapital: number;
};

function formatMoney(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `$${Math.max(0, value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatLot(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ClientAreaTradePilotPlanBreakdown({
  accountLabel,
  copy,
  sidePlan,
  tradingCapital,
}: ClientAreaTradePilotPlanBreakdownProps) {
  const positions = sidePlan.ladder.length;
  const totalLot = formatLot(sidePlan.totalLots);
  const riskPercentage =
    tradingCapital > 0 ? Math.round((sidePlan.estimatedCycleLoss / tradingCapital) * 100) : 0;
  const profitPercentage =
    tradingCapital > 0 && sidePlan.profitToTakeProfit2 != null
      ? Math.round((sidePlan.profitToTakeProfit2 / tradingCapital) * 100)
      : 0;

  return (
    <div className="mt-5 space-y-4">
      {sidePlan.ladder.map((layer, index) => (
        <ClientAreaTradePilotPlanAccordion
          defaultOpen={index === 0}
          icon={
            index === 0 ? (
              <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
            ) : (
              <Layers className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
            )
          }
          key={layer.level}
          subtitle={
            index === 0
              ? copy.entryFromPlanDescription.replace("{account}", accountLabel)
              : copy.layerTriggerDescription.replace("{price}", String(layer.price))
          }
          title={
            index === 0
              ? copy.initialPositionTitle
              : copy.additionalPositionTitle.replace("{position}", String(index + 1))
          }
        >
          <div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm p-4">
            <p className="text-xs text-zinc-400">{copy.initialEntryLabel}</p>
            <strong className="mt-1 block text-sm font-black text-white">
              {layer.price} · {formatLot(layer.lot)} {copy.lotUnitLabel}
            </strong>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ClientAreaTradePilotPlanMetric
              label={copy.positionMarginLabel}
              value={formatMoney(layer.dayMarginForLot)}
              variant="compact"
            />
            <ClientAreaTradePilotPlanMetric
              label={copy.positionRiskAtStopLabel}
              value={formatMoney(layer.riskToStopForLot)}
              variant="compact"
            />
            <ClientAreaTradePilotPlanMetric
              label={index === 0 ? copy.fundsNeededAtFinalStopLabel : copy.cumulativeFundsAtStopLabel}
              value={formatMoney(layer.cumulativeFundsAtStop)}
              variant="compact"
            />
            <ClientAreaTradePilotPlanMetric
              label={copy.remainingFundsLabel}
              value={formatMoney(layer.remainingFundsAtStop)}
              variant="compact"
            />
          </div>
        </ClientAreaTradePilotPlanAccordion>
      ))}

      <ClientAreaTradePilotPlanAccordion
        icon={
          <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        }
        subtitle={copy.allEntriesFilledDescription
          .replace("{positions}", String(positions))
          .replace("{lot}", totalLot)}
        title={copy.ifEntryFilledTitle}
      >
        <p className="mt-5 border-t border-zinc-700 pt-4 text-xs leading-5 text-zinc-200">
          {copy.filledEntrySummary
            .replace("{positions}", String(positions))
            .replace("{lot}", totalLot)
            .replace("{margin}", formatMoney(sidePlan.marginRequired))
            .replace("{risk}", formatMoney(sidePlan.estimatedCycleLoss))
            .replace("{riskPercentage}", String(riskPercentage))
            .replace("{profit}", formatMoney(sidePlan.profitToTakeProfit2))
            .replace("{profitPercentage}", String(profitPercentage))}
        </p>
      </ClientAreaTradePilotPlanAccordion>

      <ClientAreaTradePilotPlanAccordion
        icon={<CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />}
        subtitle={copy.marginAndRiskExplanationLabel}
        title={copy.whyNotAllLossLimitTitle}
      >
        <p className="mt-5 border-t border-zinc-700 pt-4 text-xs leading-5 text-zinc-200">
          {copy.whyNotAllLossLimitDescription}
        </p>
      </ClientAreaTradePilotPlanAccordion>

      <ClientAreaTradePilotPlanAccordion
        icon={<ListChecks className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />}
        subtitle={copy.estimateMayChangeLabel}
        title={copy.estimateNotesTitle}
      >
        <p className="mt-5 border-t border-zinc-700 pt-4 text-xs leading-5 text-zinc-200">
          {copy.estimateNotesDescription}
        </p>
      </ClientAreaTradePilotPlanAccordion>
    </div>
  );
}
