import { ClockAlert, Info } from "lucide-react";

import { ClientAreaTradePilotPlanMetric } from "@/components/atoms/ClientAreaTradePilotPlanMetric";
import { ClientAreaTradePilotPlanAccordion } from "@/components/molecules/ClientAreaTradePilotPlanAccordion";
import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotRecommendationUsageProps = {
  copy: ClientAreaTradePilotTradingPlanCopy;
  lossLimit: number;
  riskBudget: number;
  riskPercentage: number;
};

function formatMoney(value: number) {
  return `$${Math.max(0, Math.round(value)).toLocaleString("en-US")}`;
}

export function ClientAreaTradePilotRecommendationUsage({
  copy,
  lossLimit,
  riskBudget,
  riskPercentage,
}: ClientAreaTradePilotRecommendationUsageProps) {
  const steps = [
    {
      description: copy.chooseScenarioUsageDescription,
      title: copy.chooseScenarioUsageTitle,
    },
    {
      description: copy.checkEntryUsageDescription,
      title: copy.checkEntryUsageTitle,
    },
    {
      description: copy.confirmEntryUsageDescription,
      title: copy.confirmEntryUsageTitle,
    },
    {
      description: copy.followStopTargetUsageDescription,
      title: copy.followStopTargetUsageTitle,
    },
  ];

  return (
    <div className="mt-5 space-y-4" role="tabpanel">
      <section className="rounded-2xl border border-zinc-700 bg-[#171924]/90 p-5">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li className="flex gap-3" key={step.title}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                {index + 1}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <ClientAreaTradePilotPlanAccordion
        icon={<ClockAlert className="h-5 w-5 text-amber-400" />}
        title={copy.riskContextTitle}
      >
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ClientAreaTradePilotPlanMetric
            description={copy.guardrailDescription.replace(
              "{percentage}",
              String(Math.round(riskPercentage * 100)),
            )}
            label={copy.usableRiskBudgetLabel}
            value={formatMoney(riskBudget)}
            variant="compact"
          />
          <ClientAreaTradePilotPlanMetric
            label={copy.proposedLossLimitLabel}
            value={formatMoney(lossLimit)}
            variant="compact"
          />
        </div>

        <p className="mt-4 flex gap-2 border-t border-zinc-700 pt-4 text-xs leading-5 text-zinc-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
          {copy.initialEntryOnlyNote}
        </p>
      </ClientAreaTradePilotPlanAccordion>
    </div>
  );
}
