import type { Metadata } from "next";

import {
  assertValidLocale,
  buildClientAreaTradePilotMetadata,
  generateClientAreaStaticParams,
  type ClientAreaSubpageProps,
} from "@/app/[locales]/client-area/client-area-page.shared";
import { ClientAreaTradePilotPlaceholderPanel } from "@/components/organisms/ClientAreaTradePilotPlaceholderPanel";
import { getMessages } from "@/locales";
import { cookies } from "next/headers";
import {
  CLIENT_AREA_ACCOUNT_MODE_COOKIE,
  resolveClientAreaAccountMode,
} from "@/lib/client-area-account-mode";
import { getTradePilotBootstrap } from "@/lib/trade-pilot/trade-pilot";

type ClientAreaTradePilotPerformancePageProps = ClientAreaSubpageProps;

export function generateStaticParams() {
  return generateClientAreaStaticParams();
}

export async function generateMetadata({
  params,
}: ClientAreaTradePilotPerformancePageProps): Promise<Metadata> {
  const { locales } = await params;
  assertValidLocale(locales);

  return buildClientAreaTradePilotMetadata(locales, "riwayat-performa");
}

export default async function ClientAreaTradePilotPerformancePage({
  params,
}: ClientAreaTradePilotPerformancePageProps) {
  const { locales } = await params;
  assertValidLocale(locales);

  const copy = getMessages(locales).clientArea.tradePilotPage.performanceHistory;
  const bootstrap = await getTradePilotBootstrap();
  const requestedMode = resolveClientAreaAccountMode(
    (await cookies()).get(CLIENT_AREA_ACCOUNT_MODE_COOKIE)?.value,
  );
  const mode = bootstrap.access.availableModes.includes(requestedMode)
    ? requestedMode
    : "real";

  return (
    <ClientAreaTradePilotPlaceholderPanel
      description={copy.description}
      performanceCopy={copy}
      histories={bootstrap.histories[mode] ?? []}
      timeframePerformance={bootstrap.timeframePerformance}
      title={copy.title}
    />
  );
}
