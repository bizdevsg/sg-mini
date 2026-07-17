import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ClientAreaAccountModeProvider } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaSessionTimeout } from "@/components/providers/ClientAreaSessionTimeout";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  resolveClientAreaAccountMode,
} from "@/lib/client-area-account-mode";
import { hasClientAreaSession } from "@/lib/client-area-auth";
import { CLIENT_AREA_ENABLED } from "@/lib/client-area-config";
import { isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaLayoutProps = {
  children: ReactNode;
  params: Promise<{ locales: string }>;
};

export default async function ClientAreaLayout({
  children,
  params,
}: ClientAreaLayoutProps) {
  if (!CLIENT_AREA_ENABLED) {
    notFound();
  }

  const { locales } = await params;

  const cookieStore = await cookies();
  const initialAccountMode = resolveClientAreaAccountMode(
    cookieStore.get(CLIENT_AREA_ACCOUNT_MODE_COOKIE)?.value,
  );
  const hasSession = await hasClientAreaSession();

  if (!isSupportedLocale(locales)) {
    return (
      <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
        {children}
      </ClientAreaAccountModeProvider>
    );
  }

  const locale: AppLocale = locales;

  return (
    <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
      {hasSession ? <ClientAreaSessionTimeout locale={locale} /> : null}
      {children}
    </ClientAreaAccountModeProvider>
  );
}
