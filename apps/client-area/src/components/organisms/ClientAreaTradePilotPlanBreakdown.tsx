import {
  CircleHelp,
  ListChecks,
  ReceiptText,
  SlidersHorizontal,
} from "lucide-react";

import { ClientAreaTradePilotPlanMetric } from "@/components/atoms/ClientAreaTradePilotPlanMetric";
import { ClientAreaTradePilotPlanAccordion } from "@/components/molecules/ClientAreaTradePilotPlanAccordion";
import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotPlanBreakdownProps = {
  accountLabel: string;
  copy: ClientAreaTradePilotTradingPlanCopy;
  entry: string;
  lot: string;
  margin: number;
  maximumProfit: number;
  remainingFunds: number;
  riskBudget: number;
  tradingCapital: number;
};

function formatMoney(value: number) {
  return `$${Math.max(0, Math.round(value)).toLocaleString("en-US")}`;
}

export function ClientAreaTradePilotPlanBreakdown({
  accountLabel,
  copy,
  entry,
  lot,
  margin,
  maximumProfit,
  remainingFunds,
  riskBudget,
  tradingCapital,
}: ClientAreaTradePilotPlanBreakdownProps) {
  const riskPercentage =
    tradingCapital > 0 ? Math.round((riskBudget / tradingCapital) * 100) : 0;
  const profitPercentage =
    tradingCapital > 0 ? Math.round((maximumProfit / tradingCapital) * 100) : 0;

  return (
    <div className="mt-5 space-y-4">
      <ClientAreaTradePilotPlanAccordion
        icon={<ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />}
        subtitle={copy.entryFromPlanDescription.replace(
          "{account}",
          accountLabel,
        )}
        title={copy.initialPositionTitle}
      >
        <div className="mt-5 rounded-xl border border-zinc-700 bg-[#1a1d29] p-4">
          <p className="text-xs text-zinc-400">{copy.initialEntryLabel}</p>
          <strong className="mt-1 block text-sm font-black text-white">
            {entry} · {lot} {copy.lotUnitLabel}
          </strong>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ClientAreaTradePilotPlanMetric
            label={copy.positionMarginLabel}
            value={formatMoney(margin)}
            variant="compact"
          />
          <ClientAreaTradePilotPlanMetric
            label={copy.positionRiskAtStopLabel}
            value={formatMoney(riskBudget)}
            variant="compact"
          />
          <ClientAreaTradePilotPlanMetric
            label={copy.fundsNeededAtFinalStopLabel}
            value={formatMoney(margin + riskBudget)}
            variant="compact"
          />
          <ClientAreaTradePilotPlanMetric
            label={copy.remainingFundsLabel}
            value={formatMoney(remainingFunds)}
            variant="compact"
          />
        </div>
      </ClientAreaTradePilotPlanAccordion>

      <ClientAreaTradePilotPlanAccordion
        icon={
          <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        }
        subtitle={copy.firstEntryOnlyDescription.replace("{lot}", lot)}
        title={copy.ifEntryFilledTitle}
      >
        <p className="mt-5 border-t border-zinc-700 pt-4 text-xs leading-5 text-zinc-200">
          {copy.filledEntrySummary
            .replace("{lot}", lot)
            .replace("{margin}", formatMoney(margin))
            .replace("{risk}", formatMoney(riskBudget))
            .replace("{riskPercentage}", String(riskPercentage))
            .replace("{profit}", formatMoney(maximumProfit))
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
