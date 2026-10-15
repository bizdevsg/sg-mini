import "server-only";

import { z } from "zod";

import { getActiveSgbSession } from "@/lib/client-area-auth";
import type { TradePilotMode } from "@/lib/trade-pilot/trade-pilot.types";

const accountTypeListSchema = z.array(
  z.object({ type: z.string().min(1) }).passthrough(),
);

export function deriveClientAreaTradePilotCapabilities(accounts: unknown): {
  availableModes: TradePilotMode[];
  hasDemoAccount: boolean;
  hasRealAccount: boolean;
  valid: boolean;
} {
  const parsed = accountTypeListSchema.safeParse(accounts);
  if (!parsed.success) {
    return { availableModes: [], hasDemoAccount: false, hasRealAccount: false, valid: false };
  }

  // SGB sends real accounts as "live" (not "real"), so — like accountIdsByMode —
  // only "demo" is a known value and any other type counts as a real account.
  const accountTypes = parsed.data.map(({ type }) => type.trim().toLowerCase());

  const hasDemoAccount = accountTypes.includes("demo");
  const hasRealAccount = accountTypes.some((type) => type !== "demo");

  return {
    availableModes: [
      ...(hasDemoAccount ? (["demo"] as const) : []),
      ...(hasRealAccount ? (["real"] as const) : []),
    ],
    hasDemoAccount,
    hasRealAccount,
    valid: true,
  };
}

/**
 * Anti-corruption adapter between the SGB session and Trade Pilot. Raw account
 * entries (including account numbers) stop here; callers receive capabilities only.
 */
export async function getClientAreaTradePilotIdentity() {
  const session = await getActiveSgbSession();
  if (!session) return null;

  return {
    capabilities: deriveClientAreaTradePilotCapabilities(session.accounts),
    email: session.email,
  };
}
