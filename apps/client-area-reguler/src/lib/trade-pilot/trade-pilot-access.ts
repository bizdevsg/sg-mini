import "server-only";

import { getClientAreaTradePilotIdentity } from "@/lib/client-area-trade-pilot-entitlement";
import { tradePilotUserId } from "@/lib/trade-pilot/trade-pilot-user-id";
import type { TradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot.types";

export async function getTradePilotAccessContext(): Promise<TradePilotAccessContext> {
  const identity = await getClientAreaTradePilotIdentity();

  if (!identity) {
    return {
      allowed: false,
      authenticated: false,
      availableModes: [],
      hasDemoAccount: false,
      hasRealAccount: false,
      reason: "unauthenticated",
      userId: null,
    };
  }

  const { capabilities } = identity;
  const hasEligibleAccount =
    capabilities.hasDemoAccount || capabilities.hasRealAccount;
  const reason = !capabilities.valid
    ? "invalid_account_data"
    : hasEligibleAccount
      ? "allowed"
      : "trading_account_required";

  const userId = tradePilotUserId(identity.email);

  return {
    ...capabilities,
    allowed: reason === "allowed",
    authenticated: true,
    reason,
    userId,
  };
}
