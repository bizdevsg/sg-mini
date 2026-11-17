import type { ReactNode } from "react";
import { cookies } from "next/headers";

import {
  assertValidLocale,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { ClientAreaTradePilotAccessDenied } from "@/components/organisms/ClientAreaTradePilotAccessDenied";
import { ClientAreaTradePilotComingSoon } from "@/components/organisms/ClientAreaTradePilotComingSoon";
import { requireClientAreaSession } from "@/lib/client-area-auth";
import { isTradePilotEnabled } from "@/lib/client-area-config";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  resolveClientAreaAccountMode,
} from "@/lib/client-area-account-mode";
import { getTradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot-access";
import { getMessages } from "@/locales";

type ClientAreaTradePilotLayoutProps = {
  children: ReactNode;
  params: ClientAreaSubpageProps["params"];
};

export default async function ClientAreaTradePilotLayout({
  children,
  params,
}: ClientAreaTradePilotLayoutProps) {
  const { locales } = await params;
  assertValidLocale(locales);
  await requireClientAreaSession(locales);

  if (!(await isTradePilotEnabled())) {
    const comingSoonCopy =
      getMessages(locales).clientArea.tradePilotPage.comingSoon;

    return (
      <ClientAreaShell
        activeTab="trade-pilot"
        locale={locales}
        showHeaderTicker={false}
      >
        <div className="trade-pilot-theme">
          <ClientAreaTradePilotComingSoon
            description={comingSoonCopy.description}
            title={comingSoonCopy.title}
          />
        </div>
      </ClientAreaShell>
    );
  }

  const access = await getTradePilotAccessContext();
  const accessCopy = getMessages(locales).clientArea.tradePilotPage.access;
  const requestedMode = resolveClientAreaAccountMode(
    (await cookies()).get(CLIENT_AREA_ACCOUNT_MODE_COOKIE)?.value,
  );
  const requestedModeAvailable = access.availableModes.includes(requestedMode);
  const deniedTitle = access.allowed && !requestedModeAvailable
    ? requestedMode === "real"
      ? accessCopy.missingRealTitle
      : accessCopy.missingDemoTitle
    : accessCopy.deniedTitle;
  const deniedDescription = access.allowed && !requestedModeAvailable
    ? requestedMode === "real"
      ? accessCopy.missingRealDescription
      : accessCopy.missingDemoDescription
    : accessCopy.deniedDescription;

  return (
    <ClientAreaShell
      activeTab="trade-pilot"
      locale={locales}
      showHeaderTicker={false}
    >
      <div className="trade-pilot-theme">
        {access.allowed && requestedModeAvailable ? (
          children
        ) : (
          <ClientAreaTradePilotAccessDenied
            berandaBack={accessCopy.berandaBack}
            description={deniedDescription}
            href={`/${locales}/client-area`}
            title={deniedTitle}
          />
        )}
      </div>
    </ClientAreaShell>
  );
}
