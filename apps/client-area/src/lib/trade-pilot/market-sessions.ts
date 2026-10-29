/*
 * Sesi pasar forex (perkiraan umum) dihitung dari jam lokal masing-masing kota,
 * sehingga pergantian jam musim panas/dingin (Sydney, London, New York) ikut
 * otomatis. Ditampilkan ke nasabah dalam WIB (Asia/Jakarta).
 */

export type MarketSessionId = "sydney" | "tokyo" | "london" | "new-york";

type MarketSessionDefinition = {
  id: MarketSessionId;
  name: string;
  timeZone: string;
  openHour: number;
  closeHour: number;
};

export const MARKET_SESSIONS: MarketSessionDefinition[] = [
  { id: "sydney", name: "Sydney", timeZone: "Australia/Sydney", openHour: 7, closeHour: 16 },
  { id: "tokyo", name: "Tokyo", timeZone: "Asia/Tokyo", openHour: 9, closeHour: 18 },
  { id: "london", name: "London", timeZone: "Europe/London", openHour: 8, closeHour: 17 },
  { id: "new-york", name: "New York", timeZone: "America/New_York", openHour: 8, closeHour: 17 },
];

const DISPLAY_TIME_ZONE = "Asia/Jakarta";
const WEEKDAYS = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    weekday: value.weekday,
    year: Number(value.year),
    month: Number(value.month),
    day: Number(value.day),
    hour: Number(value.hour),
    minute: Number(value.minute),
  };
}

/** Selisih (menit) zona waktu terhadap UTC pada saat `date`. */
function offsetMinutes(date: Date, timeZone: string) {
  const p = zonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return Math.round((asUtc - Math.floor(date.getTime() / 60_000) * 60_000) / 60_000);
}

function formatClock(totalMinutes: number) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}.${String(minutes).padStart(2, "0")}`;
}

export type MarketSessionState = {
  id: MarketSessionId;
  name: string;
  open: boolean;
  /** Jam buka–tutup hari ini dalam WIB, mis. "15.00–24.00". */
  displayRange: string;
};

export function getMarketSessions(now: Date = new Date()): MarketSessionState[] {
  const displayOffset = offsetMinutes(now, DISPLAY_TIME_ZONE);
  return MARKET_SESSIONS.map((session) => {
    const local = zonedParts(now, session.timeZone);
    const minutes = local.hour * 60 + local.minute;
    const open =
      WEEKDAYS.has(local.weekday) && minutes >= session.openHour * 60 && minutes < session.closeHour * 60;
    const shift = displayOffset - offsetMinutes(now, session.timeZone);
    const start = session.openHour * 60 + shift;
    const end = session.closeHour * 60 + shift;
    const endLabel = formatClock(end) === "00.00" ? "24.00" : formatClock(end);
    return { id: session.id, name: session.name, open, displayRange: `${formatClock(start)}–${endLabel}` };
  });
}
