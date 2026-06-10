import { ECONOMIC_CALENDAR_API_BASE_URL } from "@/lib/env";

export const ECONOMIC_CALENDAR_RANGE_KEYS = [
  "today",
  "thisWeek",
  "nextWeek",
  "previousWeek",
] as const;

export type EconomicCalendarRangeKey =
  (typeof ECONOMIC_CALENDAR_RANGE_KEYS)[number];

export type EconomicCalendarHistoryEntry = {
  date: string;
  previous: string;
  forecast: string;
  actual: string;
};

export type EconomicCalendarEventDetails = {
  sources: string;
  measures: string;
  usualEffect: string;
  frequency: string;
  nextReleased: string;
  notes: string;
  whyTraderCare: string;
  history: EconomicCalendarHistoryEntry[];
};

export type EconomicCalendarEvent = {
  id: string;
  date: string | null;
  rawTime: string;
  displayTime: string;
  dateTimeLabel: string;
  currency: string;
  impact: string;
  impactScore: number;
  event: string;
  previous: string;
  forecast: string;
  actual: string;
  details: EconomicCalendarEventDetails;
};

export type EconomicCalendarRangeData = {
  key: EconomicCalendarRangeKey;
  status: string;
  updatedAt: string | null;
  total: number;
  events: EconomicCalendarEvent[];
};

export type EconomicCalendarOverview = Record<
  EconomicCalendarRangeKey,
  EconomicCalendarRangeData
>;

type EconomicCalendarApiHistoryEntry = Partial<EconomicCalendarHistoryEntry>;

type EconomicCalendarApiDetails = Partial<
  Omit<EconomicCalendarEventDetails, "history">
> & {
  history?: unknown;
};

type EconomicCalendarApiEvent = {
  time?: string;
  currency?: string;
  impact?: string;
  event?: string;
  previous?: string;
  forecast?: string;
  actual?: string;
  date?: string;
  details?: EconomicCalendarApiDetails;
};

type EconomicCalendarApiResponse = {
  status?: string;
  updatedAt?: string;
  total?: number;
  data?: EconomicCalendarApiEvent[];
};

const ECONOMIC_CALENDAR_ENDPOINTS: Record<EconomicCalendarRangeKey, string> = {
  today: "today",
  thisWeek: "this-week",
  nextWeek: "next-week",
  previousWeek: "previous-week",
};

function normalizeText(value: string | null | undefined) {
  const trimmedValue = value?.trim();
  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : "-";
}

function getImpactScore(impact: string) {
  return impact.match(/\u2605/g)?.length ?? 0;
}

function getDateAndTimeParts(timeValue: string, fallbackDate?: string) {
  const normalizedTime = timeValue.trim();

  if (fallbackDate) {
    if (normalizedTime.startsWith(fallbackDate)) {
      return {
        date: fallbackDate,
        displayTime: normalizedTime.slice(fallbackDate.length).trim() || "-",
      };
    }

    return {
      date: fallbackDate,
      displayTime: normalizedTime || "-",
    };
  }

  const dateTimeMatch = normalizedTime.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);

  if (dateTimeMatch) {
    return {
      date: dateTimeMatch[1],
      displayTime: dateTimeMatch[2].trim() || "-",
    };
  }

  return {
    date: null,
    displayTime: normalizedTime || "-",
  };
}

function normalizeHistory(history: unknown) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const typedEntry = entry as EconomicCalendarApiHistoryEntry;

      return {
        date: typeof typedEntry.date === "string" ? typedEntry.date : "",
        previous: normalizeText(typedEntry.previous),
        forecast: normalizeText(typedEntry.forecast),
        actual: normalizeText(typedEntry.actual),
      };
    })
    .filter(
      (entry): entry is EconomicCalendarHistoryEntry =>
        entry !== null && entry.date.length > 0,
    );
}

function normalizeEvent(
  rangeKey: EconomicCalendarRangeKey,
  event: EconomicCalendarApiEvent,
  index: number,
): EconomicCalendarEvent {
  const rawTime = typeof event.time === "string" ? event.time : "-";
  const { date, displayTime } = getDateAndTimeParts(rawTime, event.date);
  const details = event.details ?? {};
  const eventName = normalizeText(event.event);
  const currency = normalizeText(event.currency);

  return {
    id: `${rangeKey}-${date ?? "no-date"}-${displayTime}-${currency}-${index}`,
    date,
    rawTime,
    displayTime,
    dateTimeLabel: date ? `${date} ${displayTime}` : displayTime,
    currency,
    impact: normalizeText(event.impact),
    impactScore: getImpactScore(event.impact ?? ""),
    event: eventName,
    previous: normalizeText(event.previous),
    forecast: normalizeText(event.forecast),
    actual: normalizeText(event.actual),
    details: {
      sources: normalizeText(details.sources),
      measures: normalizeText(details.measures),
      usualEffect: normalizeText(details.usualEffect),
      frequency: normalizeText(details.frequency),
      nextReleased: normalizeText(details.nextReleased),
      notes: normalizeText(details.notes),
      whyTraderCare: normalizeText(details.whyTraderCare),
      history: normalizeHistory(details.history),
    },
  };
}

export function createEmptyEconomicCalendarRange(
  key: EconomicCalendarRangeKey,
  status = "error",
): EconomicCalendarRangeData {
  return {
    key,
    status,
    updatedAt: null,
    total: 0,
    events: [],
  };
}

export async function getEconomicCalendarRange(
  key: EconomicCalendarRangeKey,
): Promise<EconomicCalendarRangeData> {
  const endpoint = ECONOMIC_CALENDAR_ENDPOINTS[key];
  const response = await fetch(`${ECONOMIC_CALENDAR_API_BASE_URL}/${endpoint}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch economic calendar ${key}: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as EconomicCalendarApiResponse;
  const events = Array.isArray(payload.data)
    ? payload.data.map((event, index) => normalizeEvent(key, event, index))
    : [];

  return {
    key,
    status: typeof payload.status === "string" ? payload.status : "success",
    updatedAt: payload.updatedAt ?? null,
    total:
      typeof payload.total === "number" && Number.isFinite(payload.total)
        ? payload.total
        : events.length,
    events,
  };
}
