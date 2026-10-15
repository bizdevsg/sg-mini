import "server-only";

import { createHmac } from "node:crypto";
import { getClientAreaTradePilotIdentity } from "@/lib/client-area-trade-pilot-entitlement";
import { CLIENT_AREA_SESSION_SECRET } from "@/lib/env";
import type { TradePilotAccessContext } from "@/lib/trade-pilot/trade-pilot.types";

function deriveOpaqueUserId(email: string): string {
  if (!CLIENT_AREA_SESSION_SECRET) {
    throw new Error("CLIENT_AREA_SESSION_SECRET is required for Trade Pilot.");
  }

  return createHmac("sha256", CLIENT_AREA_SESSION_SECRET)
    .update(`trade-pilot:${email.trim().toLowerCase()}`)
    .digest("hex");
}

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

  return {
    ...capabilities,
    allowed: reason === "allowed",
    authenticated: true,
    reason,
    userId: deriveOpaqueUserId(identity.email),
  };
}
