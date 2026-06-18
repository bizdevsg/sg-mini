import "server-only";

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

export { getEconomicCalendarRangeData as getEconomicCalendarRange } from "@/app/api/_data/economic-calendar";
