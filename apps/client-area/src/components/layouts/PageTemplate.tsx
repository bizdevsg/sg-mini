import type { ReactNode } from "react";

import { ClientAreaAdminFrame } from "@/components/organisms/ClientAreaAdminFrame";
import type { AppLocale } from "@/locales";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
};

export function PageTemplate({
  children,
  locale,
}: PageTemplateProps) {
  return (
    <ClientAreaAdminFrame locale={locale}>
      {children}
    </ClientAreaAdminFrame>
  );
}
