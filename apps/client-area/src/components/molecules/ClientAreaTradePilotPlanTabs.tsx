import {
  BookOpen,
  ClipboardList,
  ListTree,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { ClientAreaTradePilotPlanTabButton } from "@/components/atoms/ClientAreaTradePilotPlanTabButton";
import type { ClientAreaTradePilotTradingPlanCopy } from "@/lib/client-area-trade-pilot.shared";

export type ClientAreaTradePilotPlanTab =
  | "summary"
  | "details"
  | "unused"
  | "usage";

type ClientAreaTradePilotPlanTabsProps = {
  activeTab: ClientAreaTradePilotPlanTab;
  copy: ClientAreaTradePilotTradingPlanCopy;
  onChange: (tab: ClientAreaTradePilotPlanTab) => void;
  variant: "buy" | "sell";
};

export function ClientAreaTradePilotPlanTabs({
  activeTab,
  copy,
  onChange,
  variant,
}: ClientAreaTradePilotPlanTabsProps) {
  const tabs: Array<{
    Icon: LucideIcon;
    badge?: string;
    id: ClientAreaTradePilotPlanTab;
    label: string;
    tone?: "buy" | "sell" | "warning";
  }> = [
    {
      Icon: ClipboardList,
      id: "summary",
      label: copy.planSummaryLabel,
      tone: variant,
    },
    {
      Icon: ListTree,
      id: "details",
      label: copy.planDetailsLabel,
      tone: variant,
    },
    {
      Icon: TriangleAlert,
      badge: "2",
      id: "unused",
      label: copy.unusedCandidatesLabel,
      tone: "warning",
    },
    {
      Icon: BookOpen,
      id: "usage",
      label: copy.recommendationUsageLabel,
      tone: variant,
    },
  ];

  return (
    <div
      className="mt-5 grid overflow-hidden rounded-2xl border border-zinc-700 sm:grid-cols-4"
      role="tablist"
    >
      {tabs.map(({ Icon, badge, id, label, tone }) => (
        <ClientAreaTradePilotPlanTabButton
          active={activeTab === id}
          badge={badge}
          Icon={Icon}
          key={id}
          label={label}
          onClick={() => onChange(id)}
          tone={tone}
        />
      ))}
    </div>
  );
}
