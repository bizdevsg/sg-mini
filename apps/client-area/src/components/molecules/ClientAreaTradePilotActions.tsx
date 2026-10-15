import { Bell, ChartNoAxesCombined } from "lucide-react";

import { ClientAreaTradePilotActionButton } from "@/components/atoms/ClientAreaTradePilotActionButton";
import type { ClientAreaTradePilotCopy } from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotActionsProps = {
  copy: ClientAreaTradePilotCopy;
  disabled?: boolean;
  isAnalyzing: boolean;
  onAnalyze: () => void;
};

export function ClientAreaTradePilotActions({
  copy,
  disabled = false,
  isAnalyzing,
  onAnalyze,
}: ClientAreaTradePilotActionsProps) {
  return (
    <section className="min-w-0 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-500/10 p-4 sm:rounded-3xl sm:p-5">
      <ClientAreaTradePilotActionButton
        icon={<Bell className="h-6 w-6" />}
        variant="outline"
      >
        {copy.setAlertLabel}
      </ClientAreaTradePilotActionButton>
      <ClientAreaTradePilotActionButton
        disabled={disabled || isAnalyzing}
        icon={<ChartNoAxesCombined className="h-6 w-6" />}
        onClick={onAnalyze}
        variant="primary"
      >
        {isAnalyzing ? copy.analysisLoadingLabel : copy.analysisActionLabel}
      </ClientAreaTradePilotActionButton>
    </section>
  );
}
