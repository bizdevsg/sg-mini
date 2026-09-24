import type { ReactNode } from "react";

import { ClientAreaAdminFrame } from "@/components/organisms/ClientAreaAdminFrame";
import type { ClientAreaSessionProfile } from "@/lib/client-area-auth";
import type { AppLocale } from "@/locales";

type PageTemplateProps = {
  children: ReactNode;
  locale: AppLocale;
  profile: ClientAreaSessionProfile;
};

export function PageTemplate({
  children,
  locale,
  profile,
}: PageTemplateProps) {
  return (
    <ClientAreaAdminFrame locale={locale} profile={profile}>
      {children}
    </ClientAreaAdminFrame>
  );
}
