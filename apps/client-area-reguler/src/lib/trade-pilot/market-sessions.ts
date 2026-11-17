/*
 * Sesi pasar forex memakai jam tetap dalam WIB (Asia/Jakarta), sama persis
 * dengan yang ditampilkan ke nasabah. Sesi boleh melewati tengah malam
 * (closeHour <= openHour, mis. New York 20.00–05.00).
 */

export type MarketSessionId = "sydney" | "tokyo" | "london" | "new-york";

type MarketSessionDefinition = {
  id: MarketSessionId;
  name: string;
  /** Jam buka dalam WIB. */
  openHour: number;
  /** Jam tutup dalam WIB (0 = 24.00). */
  closeHour: number;
};

export const MARKET_SESSIONS: MarketSessionDefinition[] = [
  { id: "sydney", name: "Sydney", openHour: 5, closeHour: 14 },
  { id: "tokyo", name: "Tokyo", openHour: 7, closeHour: 16 },
  { id: "london", name: "London", openHour: 15, closeHour: 0 },
  { id: "new-york", name: "New York", openHour: 20, closeHour: 5 },
];

const DISPLAY_TIME_ZONE = "Asia/Jakarta";
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

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
  const wib = zonedParts(now, DISPLAY_TIME_ZONE);
  const minutes = wib.hour * 60 + wib.minute;
  const today = WEEKDAY_INDEX[wib.weekday] ?? 0;
  return MARKET_SESSIONS.map((session) => {
    const start = session.openHour * 60;
    const end = session.closeHour * 60;
    const wraps = end <= start;
    const open = wraps ? minutes >= start || minutes < end : minutes >= start && minutes < end;
    // Bagian sesi setelah tengah malam milik hari kerja sebelumnya.
    const sessionDay = wraps && minutes < end ? (today + 6) % 7 : today;
    const isWeekday = sessionDay >= 1 && sessionDay <= 5;
    const endLabel = formatClock(end) === "00.00" ? "24.00" : formatClock(end);
    return {
      id: session.id,
      name: session.name,
      open: open && isWeekday,
      displayRange: `${formatClock(start)}–${endLabel}`,
    };
  });
}
