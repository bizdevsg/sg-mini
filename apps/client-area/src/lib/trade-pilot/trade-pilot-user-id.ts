import "server-only";

import { createHmac } from "node:crypto";

import { TRADE_PILOT_USER_ID_SECRET } from "@/lib/env";

/**
 * userId TradePilot = HMAC-SHA256(`trade-pilot:{email}`) dengan secret khusus,
 * 64 karakter hex. Hashing satu arah: backend tidak bisa mengembalikan email.
 *
 * JANGAN ubah normalisasi (`trim().toLowerCase()`) atau merotasi
 * TRADE_PILOT_USER_ID_SECRET tanpa rencana migrasi: user lama akan dianggap
 * user baru (saldo kredit dan riwayat terputus).
 */
export function tradePilotUserId(email: string): string {
  if (!TRADE_PILOT_USER_ID_SECRET) {
    throw new Error("TRADE_PILOT_USER_ID_SECRET is required for Trade Pilot.");
  }

  const normalized = email.trim().toLowerCase();
  return createHmac("sha256", TRADE_PILOT_USER_ID_SECRET)
    .update(`trade-pilot:${normalized}`)
    .digest("hex");
}
