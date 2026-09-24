import { EconomicCalendarEventDetailList } from "@/components/molecules/EconomicCalendarEventDetailList";
import { EconomicCalendarEventHistoryTable } from "@/components/molecules/EconomicCalendarEventHistoryTable";
import type {
  EconomicCalendarEventComponentProps,
  EconomicCalendarExpandedLabels,
} from "@/components/organisms/economic-calendar-browser.shared";
import type { AppLocale } from "@/locales";

type EconomicCalendarExpandedEventPanelProps =
  EconomicCalendarEventComponentProps & {
    locale: AppLocale;
    labels: EconomicCalendarExpandedLabels;
  };

export function EconomicCalendarExpandedEventPanel({
  event,
  locale,
  labels,
}: EconomicCalendarExpandedEventPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.96fr)]">
      <EconomicCalendarEventDetailList event={event} labels={labels} />
      <EconomicCalendarEventHistoryTable
        event={event}
        locale={locale}
        labels={labels}
      />
    </div>
  );
}
