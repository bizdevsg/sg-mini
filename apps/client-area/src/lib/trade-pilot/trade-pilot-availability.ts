import type { TradePilotAnalysisAvailability, TradePilotMode } from "@/lib/trade-pilot/trade-pilot.types";

/*
 * Kill switch analisis diatur dari konsol admin TradePilot (Pengaturan →
 * Ketersediaan & kuota) dan dikirim lewat GET /bootstrap. Client area memakai
 * nilai ini untuk menonaktifkan tombol lebih dulu; backend tetap menolak
 * dengan 503 analysis_paused bila pengaturan berubah setelah halaman dimuat.
 */

export type TradePilotPauseReason = "global" | "mode" | "instrument" | "timeframe";

export function getTradePilotPauseReason(
  availability: TradePilotAnalysisAvailability | null | undefined,
  input: { instrumentId: string; mode: TradePilotMode; timeframe: string },
): TradePilotPauseReason | null {
  if (!availability) return null;
  if (!availability.enabled) return "global";
  if (availability.modes[input.mode] === false) return "mode";
  if (availability.instruments[input.instrumentId] === false) return "instrument";
  if (availability.timeframes[input.timeframe] === false) return "timeframe";
  return null;
}
