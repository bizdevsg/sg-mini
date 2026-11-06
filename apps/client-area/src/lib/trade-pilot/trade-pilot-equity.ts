import "server-only";

import { getActiveSgbSession } from "@/lib/client-area-auth";
import { TRADE_PILOT_MIN_REAL_EQUITY_USD } from "@/lib/env";
import { describeError } from "@/lib/safe-log";
import { buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import { mmFetch } from "@/lib/sgb-api/mm-fetch";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";
import type { TradePilotRealEquityStatus } from "@/lib/trade-pilot/trade-pilot.types";
import {
  parseAccountSummary,
  sessionHasAccountForMode,
} from "@/types/account-summary";

/**
 * Status equity akun live untuk kebijakan Trade Pilot mode Real
 * ("3 analisis/hari selama ada equity").
 *
 * - "positive": equity akun live >= TRADE_PILOT_MIN_REAL_EQUITY_USD (default $10)
 * - "none":     tidak ada akun live, atau equity di bawah batas minimum
 * - "unknown":  data SGB gagal diambil / tidak terbaca
 *
 * Kebijakan fail closed: hanya "positive" yang boleh menjalankan analisis Real.
 * HANYA dipanggil dari Server Action / Route Handler (mmFetch bisa merotasi
 * token dan menulis cookie).
 */
export async function getTradePilotRealEquityStatus(): Promise<TradePilotRealEquityStatus> {
  try {
    const session = await getActiveSgbSession();
    if (!session || !sessionHasAccountForMode(session.accounts, "real")) {
      return "none";
    }

    const deviceUuid = await getOrCreateSgbDeviceUuid();
    const data = await mmFetch<unknown>("/etrade/accountsummary", {
      method: "GET",
      mode: "real",
      headers: buildSgbDeviceHeaders(deviceUuid),
    });
    const account = parseAccountSummary(data);

    if (!account || account.equity === null) return "unknown";
    return account.equity >= TRADE_PILOT_MIN_REAL_EQUITY_USD ? "positive" : "none";
  } catch (error) {
    console.error("[trade-pilot] real equity check failed", describeError(error));
    return "unknown";
  }
}
