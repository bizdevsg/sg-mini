import "server-only";

import { getTradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot-access";
import {
  getMockTradePilotSnapshot,
  mockTradePilotAnalysisService,
  mockTradePilotCreditService,
  mockTradePilotHistoryService,
} from "@/lib/trade-pilot/trade-pilot-mock";
import type { TradePilotBootstrap } from "@/lib/trade-pilot/trade-pilot.types";

export async function getTradePilotBootstrap(): Promise<TradePilotBootstrap> {
  const access = await getTradePilotAccessContext();

  if (!access.allowed || !access.userId) {
    return {
      access,
      credits: {},
      histories: {},
      latestAnalyses: {},
      source: "mock",
      timeframePerformance: [],
    };
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
    source: "mock",
    timeframePerformance: snapshot.timeframePerformance,
  };
}
