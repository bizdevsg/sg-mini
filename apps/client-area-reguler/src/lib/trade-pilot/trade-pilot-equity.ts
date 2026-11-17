import "server-only";

import { getActiveSgbSession } from "@/lib/client-area-auth";
import { describeError } from "@/lib/safe-log";
import { buildSgbDeviceHeaders } from "@/lib/sgb-api/device";
import { mmFetch } from "@/lib/sgb-api/mm-fetch";
import { getOrCreateSgbDeviceUuid } from "@/lib/sgb-session";
import {
  parseAccountSummary,
  sessionHasAccountForMode,
} from "@/types/account-summary";

/**
 * Equity akun live (USD) untuk kebijakan Trade Pilot mode Real.
 * Batas minimumnya diatur super_admin di konsol SGB-TP (credit.minEquityUsd);
 * backend yang memutuskan — get-sgb hanya mengirim angkanya lewat header
 * X-TradePilot-Real-Equity.
 *
 * - angka: equity akun live
 * - 0:     tidak punya akun live
 * - null:  data SGB gagal diambil / tidak terbaca (backend menolak: fail closed)
 *
 * HANYA dipanggil dari Server Action / Route Handler (mmFetch bisa merotasi
 * token dan menulis cookie).
 */
export async function getTradePilotRealEquityUsd(): Promise<number | null> {
  try {
    const session = await getActiveSgbSession();
    if (!session || !sessionHasAccountForMode(session.accounts, "real")) {
      return 0;
    }

    const deviceUuid = await getOrCreateSgbDeviceUuid();
    const data = await mmFetch<unknown>("/etrade/accountsummary", {
      method: "GET",
      mode: "real",
      headers: buildSgbDeviceHeaders(deviceUuid),
    });
    return parseAccountSummary(data)?.equity ?? null;
  } catch (error) {
    console.error("[trade-pilot] real equity check failed", describeError(error));
    return null;
  }
}

/** Nilai header X-TradePilot-Real-Equity. */
export function realEquityHeaderValue(equityUsd: number | null): string {
  return equityUsd === null ? "unknown" : equityUsd.toFixed(2);
}

