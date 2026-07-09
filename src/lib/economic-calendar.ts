import "server-only";

import { ECONOMIC_CALENDAR_API_BASE_URL } from "@/lib/env";
import type {
  EconomicCalendarEvent,
  EconomicCalendarEventDetails,
  EconomicCalendarHistoryEntry,
  EconomicCalendarRangeData,
  EconomicCalendarRangeKey,
} from "@/lib/economic-calendar.shared";

export {
  createEmptyEconomicCalendarRange,
  ECONOMIC_CALENDAR_RANGE_KEYS,
} from "@/lib/economic-calendar.shared";

export type {
  EconomicCalendarEvent,
  EconomicCalendarEventDetails,
  EconomicCalendarHistoryEntry,
  EconomicCalendarOverview,
  EconomicCalendarRangeData,
  EconomicCalendarRangeKey,
} from "@/lib/economic-calendar.shared";

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

const ECONOMIC_CALENDAR_REQUEST_TIMEOUT_MS = 5000;
export const ECONOMIC_CALENDAR_REVALIDATE_SECONDS = 30;

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

export async function getEconomicCalendarRange(
  key: EconomicCalendarRangeKey,
): Promise<EconomicCalendarRangeData> {
  const endpoint = ECONOMIC_CALENDAR_ENDPOINTS[key];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ECONOMIC_CALENDAR_REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${ECONOMIC_CALENDAR_API_BASE_URL}/${endpoint}`, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: ECONOMIC_CALENDAR_REVALIDATE_SECONDS,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Economic calendar ${key} request timed out`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

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
