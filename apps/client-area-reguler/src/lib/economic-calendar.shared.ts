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

export type EconomicCalendarPagination = {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  from: number | null;
  to: number | null;
  hasMorePages: boolean;
  prevPageUrl: string | null;
  nextPageUrl: string | null;
};

export type EconomicCalendarRangeData = {
  key: EconomicCalendarRangeKey;
  status: string;
  updatedAt: string | null;
  total: number;
  pagination: EconomicCalendarPagination;
  events: EconomicCalendarEvent[];
};

export type EconomicCalendarOverview = Record<
  EconomicCalendarRangeKey,
  EconomicCalendarRangeData
>;

export function createEmptyEconomicCalendarRange(
  key: EconomicCalendarRangeKey,
  status = "error",
  page = 1,
): EconomicCalendarRangeData {
  return {
    key,
    status,
    updatedAt: null,
    total: 0,
    pagination: {
      currentPage: page,
      perPage: 0,
      total: 0,
      lastPage: 1,
      from: null,
      to: null,
      hasMorePages: false,
      prevPageUrl: null,
      nextPageUrl: null,
    },
    events: [],
  };
}
