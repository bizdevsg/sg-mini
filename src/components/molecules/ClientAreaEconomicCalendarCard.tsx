import { ClientAreaImpactBadge } from "@/components/atoms/ClientAreaImpactBadge";
import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";

type ClientAreaEconomicCalendarCardProps = {
  actualLabel: string;
  event: EconomicCalendarEvent;
  forecastLabel: string;
  previousLabel: string;
};

function getCountryFlagCode(currency: string) {
  const normalizedCurrency = currency.toUpperCase().replace(/\./g, "");

  const countryCodes: Record<string, string> = {
    US: "us",
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPN: "jp",
    JPY: "jp",
    AUD: "au",
    NZD: "nz",
    CAD: "ca",
    CHF: "ch",
    CHN: "cn",
    CNY: "cn",
    CNH: "cn",
  };

  return countryCodes[normalizedCurrency] ?? "xx";
}

function parseEconomicValue(value: string) {
  const normalizedValue = value.trim().toUpperCase();

  if (!normalizedValue || normalizedValue === "-") {
    return null;
  }

  const matchedValue = normalizedValue.match(/-?\d+(?:[.,]\d+)?(?:\s*[KMBT])?/);

  if (!matchedValue) {
    return null;
  }

  const compactValue = matchedValue[0].replace(/\s+/g, "");
  const suffix = compactValue.match(/[KMBT]$/)?.[0] ?? "";
  const numericPortion = suffix
    ? compactValue.slice(0, -1)
    : compactValue;
  const parsedNumber = Number(numericPortion.replace(/,/g, ""));

  if (!Number.isFinite(parsedNumber)) {
    return null;
  }

  const multipliers: Record<string, number> = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000,
    T: 1_000_000_000_000,
  };

  return parsedNumber * (multipliers[suffix] ?? 1);
}

function getActualValueColorClassName(actual: string, previous: string) {
  const actualValue = parseEconomicValue(actual);
  const previousValue = parseEconomicValue(previous);

  if (actualValue === null || previousValue === null) {
    return "text-yellow-500";
  }

  if (actualValue > previousValue) {
    return "text-emerald-400";
  }

  if (actualValue < previousValue) {
    return "text-rose-400";
  }

  return "text-yellow-500";
}

export function ClientAreaEconomicCalendarCard({
  actualLabel,
  event,
  forecastLabel,
  previousLabel,
}: ClientAreaEconomicCalendarCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-zinc-500/10 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="w-full shrink-0 font-bold text-zinc-200 sm:w-15">
          <p>{event.displayTime}</p>
        </div>

        <div className="w-10 shrink-0">
          <div
            className={`fib fi-${getCountryFlagCode(event.currency)} h-6 w-7 shrink-0 overflow-hidden rounded-[2px] mx-auto`}
            aria-label={event.currency}
            title={event.currency}
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-bold leading-6 text-zinc-100">
              <span>{event.event}</span>
            </h3>

            <div className="mt-2 grid gap-2 text-sm min-[440px]:grid-cols-2 xl:grid-cols-3">
              <p className="text-yellow-500">
                <span className="font-semibold">{previousLabel}</span>:{" "}
                {event.previous}
              </p>
              <p className="text-yellow-500">
                <span className="font-semibold">{forecastLabel}</span>:{" "}
                {event.forecast}
              </p>
              <p
                className={getActualValueColorClassName(
                  event.actual,
                  event.previous,
                )}
              >
                <span className="font-semibold">{actualLabel}</span>:{" "}
                <span>{event.actual}</span>
              </p>
            </div>
          </div>

          <div className="sm:pt-1">
            <ClientAreaImpactBadge
              impactScore={event.impactScore}
              label={event.impact}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
