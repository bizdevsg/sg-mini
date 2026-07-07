import { ClientAreaEconomicCalendarCard } from "@/components/molecules/ClientAreaEconomicCalendarCard";
import { ClientAreaSectionHeader } from "@/components/molecules/ClientAreaSectionHeader";
import { getClientAreaEconomicCalendarPreview } from "@/components/organisms/client-area.shared";
import type { DashboardCopy } from "@/components/organisms/client-area.types";
import type { EconomicCalendarEvent } from "@/lib/economic-calendar.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaEconomicCalendarSectionProps = {
  copy: DashboardCopy;
  events: EconomicCalendarEvent[];
  locale: AppLocale;
};

export function ClientAreaEconomicCalendarSection({
  copy,
  events,
  locale,
}: ClientAreaEconomicCalendarSectionProps) {
  const labels = getMessages(locale).economicCalendarBrowser;
  const preview = getClientAreaEconomicCalendarPreview(events);

  return (
    <div>
      <ClientAreaSectionHeader
        title={copy.economicCalendarTitle}
        actionHref={`/${locale}/economic-calendar`}
        actionLabel={copy.viewMoreLabel}
      />

      {preview.events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {preview.events.map((event) => (
            <ClientAreaEconomicCalendarCard
              key={event.id}
              actualLabel={labels.actual}
              event={event}
              forecastLabel={labels.forecast}
              previousLabel={labels.previous}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
          {copy.economicCalendarEmpty}
        </div>
      )}
    </div>
  );
}
