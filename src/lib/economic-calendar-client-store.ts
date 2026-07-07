import type {
  EconomicCalendarRangeData,
  EconomicCalendarRangeKey,
} from "@/lib/economic-calendar.shared";

type EconomicCalendarStoreEntry = {
  data: EconomicCalendarRangeData;
  fetchedAt: number;
};

const ECONOMIC_CALENDAR_STORAGE_KEY = "sgb-economic-calendar-store";

const economicCalendarStore = new Map<
  EconomicCalendarRangeKey,
  EconomicCalendarStoreEntry
>();

let hasHydratedFromSessionStorage = false;

function isBrowser() {
  return typeof window !== "undefined";
}

function parseStoredState(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(value) as Partial<
      Record<EconomicCalendarRangeKey, EconomicCalendarStoreEntry>
    >;

    return parsedValue;
  } catch {
    return null;
  }
}

export function hydrateEconomicCalendarStoreFromSessionStorage() {
  if (!isBrowser() || hasHydratedFromSessionStorage) {
    return;
  }

  hasHydratedFromSessionStorage = true;
  const storedState = parseStoredState(
    window.sessionStorage.getItem(ECONOMIC_CALENDAR_STORAGE_KEY),
  );

  if (!storedState) {
    return;
  }

  for (const [rangeKey, entry] of Object.entries(storedState)) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const typedRangeKey = rangeKey as EconomicCalendarRangeKey;

    if (
      !("data" in entry) ||
      !entry.data ||
      typeof entry.fetchedAt !== "number"
    ) {
      continue;
    }

    economicCalendarStore.set(typedRangeKey, {
      data: entry.data,
      fetchedAt: entry.fetchedAt,
    });
  }
}

function persistEconomicCalendarStoreToSessionStorage() {
  if (!isBrowser()) {
    return;
  }

  const serializedState = JSON.stringify(
    Object.fromEntries(economicCalendarStore.entries()),
  );

  window.sessionStorage.setItem(
    ECONOMIC_CALENDAR_STORAGE_KEY,
    serializedState,
  );
}

export function readEconomicCalendarStoreEntry(
  rangeKey: EconomicCalendarRangeKey,
) {
  return economicCalendarStore.get(rangeKey) ?? null;
}

export function writeEconomicCalendarStoreEntry(
  rangeKey: EconomicCalendarRangeKey,
  data: EconomicCalendarRangeData,
) {
  economicCalendarStore.set(rangeKey, {
    data,
    fetchedAt: Date.now(),
  });
  persistEconomicCalendarStoreToSessionStorage();
}
