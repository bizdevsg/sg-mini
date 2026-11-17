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

function CountryFlag({ currency }: { currency: string }) {
  return (
    <div
      className={`fib fi-${getCountryFlagCode(currency)} h-5 w-6 md:h-6 md:w-7 shrink-0 overflow-hidden rounded-[2px]`}
      aria-label={currency}
      title={currency}
    />
  );
}

function ClientAreaEconomicCalendarCardMobile({
  actualLabel,
  event,
  forecastLabel,
  previousLabel,
}: ClientAreaEconomicCalendarCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-zinc-500/10 p-3 backdrop-blur-sm md:hidden">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="shrink-0 text-sm font-bold text-zinc-200">
              <p>{event.displayTime}</p>
            </div>

            <div className="shrink-0">
              <CountryFlag currency={event.currency} />
            </div>
          </div>

          <div className="shrink-0">
            <ClientAreaImpactBadge
              impactScore={event.impactScore}
              label={event.impact}
            />
          </div>
        </div>

        <h3 className="break-words text-sm font-bold leading-5 text-zinc-100">
          {event.event}
        </h3>

        <div className="grid w-full sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-zinc-500/20 p-2 rounded">
            <div className="flex items-center justify-between text-yellow-500">
              <span className="block font-semibold">{previousLabel}:</span>
              <span className="block">{event.previous}</span>
            </div>
          </div>

          <div className="bg-zinc-500/20 p-2 rounded">
            <div className="flex items-center justify-between text-yellow-500">
              <span className="block font-semibold">{forecastLabel}:</span>
              <span className="block">{event.forecast}</span>
            </div>
          </div>

          <div className="bg-zinc-500/20 p-2 rounded">
            <div
              className={`flex items-center justify-between ${getActualValueColorClassName(
                event.actual,
                event.previous,
              )}`}
            >
              <span className="block font-semibold">{actualLabel}:</span>
              <span className="block">{event.actual}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientAreaEconomicCalendarCardDesktop({
  actualLabel,
  event,
  forecastLabel,
  previousLabel,
}: ClientAreaEconomicCalendarCardProps) {
  return (
    <div className="hidden md:block gap-4 rounded-2xl border border-white/8 bg-zinc-500/10 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="shrink-0 text-sm font-bold text-zinc-200">
            {event.displayTime}
          </div>

          <CountryFlag currency={event.currency} />

          <div className="space-y-2">
            <h3 className="min-w-0 flex-1 truncate text-sm font-bold text-zinc-100">
              {event.event}
            </h3>

            <div className="flex items-center">
              <p className="w-40 shrink-0 text-sm text-yellow-500">
                <span className="font-semibold">{previousLabel}: </span>
                {event.previous}
              </p>

              <p className="w-40 shrink-0 text-sm text-yellow-500">
                <span className="font-semibold">{forecastLabel}: </span>
                {event.forecast}
              </p>

              <p
                className={`w-40 shrink-0 text-sm ${getActualValueColorClassName(
                  event.actual,
                  event.previous,
                )}`}
              >
                <span className="font-semibold">{actualLabel}: </span>
                {event.actual}
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <ClientAreaImpactBadge
            impactScore={event.impactScore}
            label={event.impact}
          />
        </div>
      </div>
    </div>
  );
}

export function ClientAreaEconomicCalendarCard(
  props: ClientAreaEconomicCalendarCardProps,
) {
  return (
    <>
      <ClientAreaEconomicCalendarCardMobile {...props} />
      <ClientAreaEconomicCalendarCardDesktop {...props} />
    </>
  );
}
