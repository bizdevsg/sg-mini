import { Rocket, type LucideIcon } from "lucide-react";

import { ClientAreaQuickActionButton } from "@/components/atoms/ClientAreaQuickActionButton";
import { resolveLocalizedHref } from "@/components/organisms/client-area.shared";
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
  quickActionIconMap,
}: ClientAreaQuickActionsGridProps) {
  const actions = [
    { id: "education", href: "/client-area/ebook", icon: quickActionIconMap.education },
    { id: "products", href: "/client-area/market", icon: quickActionIconMap.products },
    { id: "trade-pilot", href: "/client-area/trade-pilot/analisis", icon: Rocket },
    { id: "temporary", href: "/client-area/market#transactions", icon: quickActionIconMap.temporary },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {actions.map(({ id, href, icon }) => {
        const action = clientArea.quickActions.items.find((item) => item.id === id);

        if (!action) return null;

        return (
          <ClientAreaQuickActionButton
            key={id}
            href={resolveLocalizedHref(locale, href)}
            icon={icon}
            label={action.label}
          />
        );
      })}
    </div>
  );
}
