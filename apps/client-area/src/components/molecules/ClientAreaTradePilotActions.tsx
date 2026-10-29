import { ChartNoAxesCombined } from "lucide-react";

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
    <section className="min-w-0 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-4 sm:rounded-3xl sm:p-5">
      <ClientAreaTradePilotActionButton
        disabled={disabled || isAnalyzing}
        icon={<ChartNoAxesCombined className="h-5 w-5" />}
        onClick={onAnalyze}
        variant="primary"
      >
        {isAnalyzing ? copy.analysisLoadingLabel : copy.analysisActionLabel}
      </ClientAreaTradePilotActionButton>
    </section>
  );
}
