import type { IconProp } from "@fortawesome/fontawesome-svg-core";

import { ClientAreaQuickActionButton } from "@/components/atoms/ClientAreaQuickActionButton";
import { ACTION_IDS } from "@/components/organisms/client-area.shared";
import type { ActionId } from "@/components/organisms/client-area.types";
import type { AppMessages } from "@/locales";

type ClientAreaQuickActionsGridProps = {
  clientArea: AppMessages["clientArea"];
  onActionClick: (actionId: ActionId) => void;
  quickActionIconMap: Record<ActionId, IconProp>;
};

export function ClientAreaQuickActionsGrid({
  clientArea,
  onActionClick,
  quickActionIconMap,
}: ClientAreaQuickActionsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 md:grid-cols-5 md:gap-4">
      {ACTION_IDS.map((actionId, index) => {
        const action = clientArea.quickActions.items[index];

        return (
          <ClientAreaQuickActionButton
            key={actionId}
            icon={quickActionIconMap[actionId]}
            label={action?.label ?? actionId}
            onClick={() => onActionClick(actionId)}
          />
        );
      })}
    </div>
  );
}
