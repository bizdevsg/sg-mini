import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { PageTemplate } from "@/components/layouts/PageTemplate";
import { ClientAreaViewOnlyDisclaimer } from "@/components/organisms/ClientAreaViewOnlyDisclaimer";
import { ClientAreaAccountModeProvider } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaProfileProvider } from "@/components/providers/ClientAreaProfileProvider";
import { ClientAreaSessionEndedNotice } from "@/components/providers/ClientAreaSessionEndedNotice";
import { ClientAreaSessionTimeout } from "@/components/providers/ClientAreaSessionTimeout";
import { ClientAreaTokenRefresh } from "@/components/providers/ClientAreaTokenRefresh";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  resolveAvailableClientAreaAccountMode,
} from "@/lib/client-area-account-mode";
import { getClientAreaSessionState } from "@/lib/client-area-auth";
import { getWebsiteFeatureConfig } from "@/lib/client-area-config";
import { getMessages, isSupportedLocale, type AppLocale } from "@/locales";

type ClientAreaLayoutProps = {
  children: ReactNode;
  params: Promise<{ locales: string }>;
};

export const dynamic = "force-dynamic";

export default async function ClientAreaLayout({
  children,
  params,
}: ClientAreaLayoutProps) {
  const featureConfig = await getWebsiteFeatureConfig();

  if (!featureConfig.clientAreaEnabled) {
    notFound();
  }

  const { locales } = await params;

  const cookieStore = await cookies();
  const savedAccountMode = cookieStore.get(CLIENT_AREA_ACCOUNT_MODE_COOKIE)?.value;
  const session = await getClientAreaSessionState();
  // First visit (no saved choice): open the Real account when the customer has
  // one, like the mobile app; otherwise fall back to Demo.
  const initialAccountMode = resolveAvailableClientAreaAccountMode(
    savedAccountMode ?? (session.profile?.accountIds.real ? "real" : "demo"),
    session.profile?.accountIds ?? { demo: null, real: null },
  );

  if (!isSupportedLocale(locales)) {
    return (
      <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
        {children}
      </ClientAreaAccountModeProvider>
    );
  }

  const locale: AppLocale = locales;
  const { viewOnlyDisclaimer } = getMessages(locale).clientArea;

  const disclaimer = (
    <ClientAreaViewOnlyDisclaimer
      body={viewOnlyDisclaimer.body}
      hideOnTradePilot
      label={viewOnlyDisclaimer.label}
    />
  );

  if (!session.isAuthenticated || !session.profile) {
    return (
      <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
        <div className="flex min-h-dvh flex-col bg-black">
          <div className="flex min-h-0 flex-1">{children}</div>
          {disclaimer}
        </div>
      </ClientAreaAccountModeProvider>
    );
  }

  return (
    <ClientAreaAccountModeProvider initialAccountMode={initialAccountMode}>
      <ClientAreaProfileProvider profile={session.profile}>
        <PageTemplate
          locale={locale}
          tradePilotEnabled={featureConfig.tradePilotEnabled}
        >
          <ClientAreaSessionTimeout locale={locale} />
          <ClientAreaTokenRefresh />
          <ClientAreaSessionEndedNotice locale={locale} />
          {children}
          {disclaimer}
        </PageTemplate>
      </ClientAreaProfileProvider>
    </ClientAreaAccountModeProvider>
  );
}
