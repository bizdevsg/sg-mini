import type { ReactNode } from "react";

import { ClientAreaAdminFrame } from "@/components/organisms/ClientAreaAdminFrame";
import type { AppLocale } from "@/locales";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
  tradePilotEnabled: boolean;
};

export function PageTemplate({
  children,
  locale,
  tradePilotEnabled,
}: PageTemplateProps) {
  return (
    <ClientAreaAdminFrame
      locale={locale}
      tradePilotEnabled={tradePilotEnabled}
    >
      {children}
    </ClientAreaAdminFrame>
  );
}
