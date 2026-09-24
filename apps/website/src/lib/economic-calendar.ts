import "server-only";

import {
  ECONOMIC_CALENDAR_API_BASE_URL,
  ECONOMIC_CALENDAR_API_TOKEN,
} from "@/lib/env";
import type {
  EconomicCalendarEvent,
  EconomicCalendarEventDetails,
  EconomicCalendarHistoryEntry,
  EconomicCalendarPagination,
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
  EconomicCalendarPagination,
  EconomicCalendarRangeData,
  EconomicCalendarRangeKey,
} from "@/lib/economic-calendar.shared";

type EconomicCalendarApiHistoryEntry = Partial<EconomicCalendarHistoryEntry>;

type EconomicCalendarApiEvent = {
  id?: number | string;
  sources?: string | null;
  measures?: string | null;
  usual_effect?: string | null;
  frequency?: string | null;
  next_released?: string | null;
  notes?: string | null;
  why_trader_care?: string | null;
  date?: string | null;
  time?: string | null;
  country?: string | null;
  impact?: string | null;
  figures?: string | null;
  previous?: string | null;
  forecast?: string | null;
  actual?: string | null;
  updated_at?: string | null;
  history?: unknown;
};

type EconomicCalendarApiPagination = {
  current_page?: number;
  per_page?: number;
  total?: number;
  last_page?: number;
  from?: number | null;
  to?: number | null;
  has_more_pages?: boolean;
  prev_page_url?: string | null;
  next_page_url?: string | null;
};

type EconomicCalendarApiMeta = {
  generated_at?: string;
  pagination?: EconomicCalendarApiPagination;
};

type EconomicCalendarApiResponse = {
  status?: string;
  updatedAt?: string;
  total?: number;
  data?: EconomicCalendarApiEvent[];
  meta?: EconomicCalendarApiMeta;
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

function normalizePositiveInteger(value: number | undefined, fallbackValue: number) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  return fallbackValue;
}

function getImpactScore(impact: string) {
  const starCount = impact.match(/\u2605/g)?.length ?? 0;

  if (starCount > 0) {
    return starCount;
  }

  const normalizedImpact = impact.trim().toLowerCase();

  if (normalizedImpact.includes("high")) {
    return 3;
  }

  if (normalizedImpact.includes("medium")) {
    return 2;
  }

  if (normalizedImpact.includes("low")) {
    return 1;
  }

  return 0;
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
  page: number,
): EconomicCalendarEvent {
  const normalizedRawDate =
    typeof event.date === "string" && event.date.trim().length > 0
      ? event.date.trim()
      : null;
  const rawTime = typeof event.time === "string" ? event.time : "-";
  const { date, displayTime } = getDateAndTimeParts(
    rawTime,
    normalizedRawDate ?? undefined,
  );
  const eventName = normalizeText(event.figures);
  const currency = normalizeText(event.country);
  const apiId =
    typeof event.id === "string" || typeof event.id === "number"
      ? String(event.id)
      : `${page}-${date ?? "no-date"}-${displayTime}-${currency}-${index}`;

  return {
    id: `${rangeKey}-${apiId}`,
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
      sources: normalizeText(event.sources),
      measures: normalizeText(event.measures),
      usualEffect: normalizeText(event.usual_effect),
      frequency: normalizeText(event.frequency),
      nextReleased: normalizeText(event.next_released),
      notes: normalizeText(event.notes),
      whyTraderCare: normalizeText(event.why_trader_care),
      history: normalizeHistory(event.history),
    },
  };
}

function normalizePagination(
  payload: EconomicCalendarApiResponse,
  page: number,
  eventsLength: number,
): EconomicCalendarPagination {
  const apiPagination = payload.meta?.pagination;
  const total = normalizePositiveInteger(
    apiPagination?.total ?? payload.total,
    eventsLength,
  );
  const perPage = normalizePositiveInteger(apiPagination?.per_page, eventsLength || 20);
  const lastPage = normalizePositiveInteger(
    apiPagination?.last_page,
    Math.max(1, Math.ceil(total / Math.max(perPage, 1))),
  );
  const currentPage = normalizePositiveInteger(apiPagination?.current_page, page);

  return {
    currentPage,
    perPage,
    total,
    lastPage,
    from: typeof apiPagination?.from === "number" ? apiPagination.from : null,
    to: typeof apiPagination?.to === "number" ? apiPagination.to : null,
    hasMorePages:
      typeof apiPagination?.has_more_pages === "boolean"
        ? apiPagination.has_more_pages
        : currentPage < lastPage,
    prevPageUrl:
      typeof apiPagination?.prev_page_url === "string"
        ? apiPagination.prev_page_url
        : null,
    nextPageUrl:
      typeof apiPagination?.next_page_url === "string"
        ? apiPagination.next_page_url
        : null,
  };
}

function buildEconomicCalendarRequestUrl(
  endpoint: string,
  page: number,
) {
  const baseUrl = ECONOMIC_CALENDAR_API_BASE_URL.replace(/\/+$/, "");
  const requestUrl = new URL(`${baseUrl}/${endpoint}`);

  if (page > 1) {
    requestUrl.searchParams.set("page", String(page));
  }

  return requestUrl;
}

export async function getEconomicCalendarRange(
  key: EconomicCalendarRangeKey,
  page = 1,
): Promise<EconomicCalendarRangeData> {
  const endpoint = ECONOMIC_CALENDAR_ENDPOINTS[key];
  const normalizedPage = normalizePositiveInteger(page, 1);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ECONOMIC_CALENDAR_REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(buildEconomicCalendarRequestUrl(endpoint, normalizedPage), {
      headers: {
        Accept: "application/json",
        ...(ECONOMIC_CALENDAR_API_TOKEN.trim().length > 0
          ? { Authorization: `Bearer ${ECONOMIC_CALENDAR_API_TOKEN}` }
          : {}),
      },
      next: {
        revalidate: ECONOMIC_CALENDAR_REVALIDATE_SECONDS,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Economic calendar ${key} page ${normalizedPage} request timed out`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch economic calendar ${key} page ${normalizedPage}: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as EconomicCalendarApiResponse;
  const events = Array.isArray(payload.data)
    ? payload.data.map((event, index) =>
        normalizeEvent(key, event, index, normalizedPage),
      )
    : [];
  const pagination = normalizePagination(payload, normalizedPage, events.length);

  return {
    key,
    status: typeof payload.status === "string" ? payload.status : "success",
    updatedAt: payload.meta?.generated_at ?? payload.updatedAt ?? null,
    total: pagination.total,
    pagination,
    events,
  };
}
