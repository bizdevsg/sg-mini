import {
  formatCalendarDate,
  getActualValueColorClassName,
  type EconomicCalendarEventComponentProps,
  type EconomicCalendarHistoryLabels,
} from "@/components/organisms/economic-calendar-browser.shared";
import type { AppLocale } from "@/locales";

type EconomicCalendarEventHistoryTableProps =
  EconomicCalendarEventComponentProps & {
    locale: AppLocale;
    labels: EconomicCalendarHistoryLabels;
  };

export function EconomicCalendarEventHistoryTable({
  event,
  locale,
  labels,
}: EconomicCalendarEventHistoryTableProps) {
  if (event.details.history.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-white/5 px-4 py-4 text-sm text-foreground/58">
        {labels.noHistory}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white/5">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-white/5">
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.date}
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.previous}
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.forecast}
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.14em] text-foreground/55">
              {labels.actual}
            </th>
          </tr>
        </thead>
        <tbody>
          {event.details.history.map((historyEntry, index) => (
            <tr
              key={`${event.id}-${historyEntry.date}`}
              className={index % 2 === 0 ? "bg-white/[0.08]" : "bg-white/[0.03]"}
            >
              <td className="px-4 py-3 text-sm text-foreground/78">
                {formatCalendarDate(historyEntry.date, locale)}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-foreground/78">
                {historyEntry.previous}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-foreground/78">
                {historyEntry.forecast}
              </td>
              <td
                className={`px-4 py-3 text-sm font-semibold ${getActualValueColorClassName(historyEntry.actual, historyEntry.previous)}`}
              >
                {historyEntry.actual}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
