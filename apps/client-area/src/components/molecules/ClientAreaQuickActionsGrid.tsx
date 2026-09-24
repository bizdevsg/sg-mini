import type { LucideIcon } from "lucide-react";

import { ClientAreaQuickActionButton } from "@/components/atoms/ClientAreaQuickActionButton";
import {
  ACTION_IDS,
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import type { ActionId } from "@/components/organisms/client-area.types";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaQuickActionsGridProps = {
  clientArea: AppMessages["clientArea"];
  locale: AppLocale;
  onActionClick: (actionId: ActionId) => void;
  quickActionIconMap: Record<ActionId, LucideIcon>;
};

export function ClientAreaQuickActionsGrid({
  clientArea,
  locale,
  onActionClick,
  quickActionIconMap,
}: ClientAreaQuickActionsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 md:grid-cols-5 md:gap-4">
      {ACTION_IDS.map((actionId, index) => {
        const action = clientArea.quickActions.items[index];
        const href =
          actionId === "education"
            ? resolveLocalizedHref(locale, "/client-area/ebook")
            : actionId === "products"
              ? resolveLocalizedHref(locale, "/client-area/market")
              : actionId === "temporary"
                ? resolveLocalizedHref(locale, "/client-area/transaction")
                : undefined;
        const isDirectLink =
          actionId === "education" ||
          actionId === "products" ||
          actionId === "temporary";

        return (
          <ClientAreaQuickActionButton
            key={actionId}
            href={href}
            icon={quickActionIconMap[actionId]}
            label={action?.label ?? actionId}
            onClick={isDirectLink ? undefined : () => onActionClick(actionId)}
          />
        );
      })}
    </div>
  );
}
