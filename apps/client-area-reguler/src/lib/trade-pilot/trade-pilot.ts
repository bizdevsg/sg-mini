import "server-only";

import { getTradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot-access";
import { describeError } from "@/lib/safe-log";
import {
  getApiTradePilotBootstrap,
  TradePilotApiError,
} from "@/lib/trade-pilot/trade-pilot-api";
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
      source: "api",
      timeframePerformance: {},
      unavailable: false,
      analysisAvailability: null,
    };
  }

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
