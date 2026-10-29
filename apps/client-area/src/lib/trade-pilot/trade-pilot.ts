import "server-only";

import { getTradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot-access";
import { TRADE_PILOT_DATA_SOURCE } from "@/lib/env";
import { describeError } from "@/lib/safe-log";
import {
  getApiTradePilotBootstrap,
  TradePilotApiError,
} from "@/lib/trade-pilot/trade-pilot-api";
import {
  getMockTradePilotSnapshot,
  mockTradePilotAnalysisService,
  mockTradePilotCreditService,
  mockTradePilotHistoryService,
} from "@/lib/trade-pilot/trade-pilot-mock";
import type { TradePilotBootstrap } from "@/lib/trade-pilot/trade-pilot.types";

export async function getTradePilotBootstrap(
  language: "id" | "en" = "id",
): Promise<TradePilotBootstrap> {
  const access = await getTradePilotAccessContext();

  if (!access.allowed || !access.userId) {
    return {
      access,
      credits: {},
      histories: {},
      latestAnalyses: {},
      isNewUser: false,
      source: TRADE_PILOT_DATA_SOURCE,
      timeframePerformance: {},
      unavailable: false,
      analysisAvailability: null,
    };
  }

  if (TRADE_PILOT_DATA_SOURCE === "api") {
    const context = {
      allowedModes: access.availableModes,
      language,
      userId: access.userId,
    };

    try {
      const bootstrap = await getApiTradePilotBootstrap(context);
      return { access, ...bootstrap, source: "api", unavailable: false };
    } catch (error) {
      if (!(error instanceof TradePilotApiError)) {
        console.error("[trade-pilot] bootstrap failed", describeError(error));
      }
      return {
        access,
        credits: {},
        histories: {},
        isNewUser: false,
        latestAnalyses: {},
        source: "api",
        timeframePerformance: {},
        unavailable: true,
        analysisAvailability: null,
      };
    }
  }

  const snapshot = await getMockTradePilotSnapshot(access.userId);
  const modeEntries = await Promise.all(
    access.availableModes.map(async (mode) => [
      mode,
      {
        credit: await mockTradePilotCreditService.getBalance(access.userId!, mode),
        history: await mockTradePilotHistoryService.list(access.userId!, mode),
        latest: await mockTradePilotAnalysisService.getLatest(access.userId!, mode),
      },
    ] as const),
  );

  return {
    access,
    credits: Object.fromEntries(
      modeEntries.map(([mode, value]) => [mode, value.credit]),
    ),
    histories: Object.fromEntries(
      modeEntries.map(([mode, value]) => [mode, value.history]),
    ),
    latestAnalyses: Object.fromEntries(
      modeEntries.flatMap(([mode, value]) => value.latest ? [[mode, value.latest]] : []),
    ),
    isNewUser: false,
    source: "mock",
    timeframePerformance: snapshot.timeframePerformance,
    unavailable: false,
    analysisAvailability: null,
  };
}
