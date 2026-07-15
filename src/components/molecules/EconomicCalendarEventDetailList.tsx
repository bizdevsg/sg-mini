import {
  type EconomicCalendarDetailLabels,
  type EconomicCalendarEventComponentProps,
} from "@/components/organisms/economic-calendar-browser.shared";

type EconomicCalendarEventDetailListProps =
  EconomicCalendarEventComponentProps & {
    labels: EconomicCalendarDetailLabels;
  };

export function EconomicCalendarEventDetailList({
  event,
  labels,
}: EconomicCalendarEventDetailListProps) {
  const detailItems = [
    { label: labels.source, value: event.details.sources },
    { label: labels.measures, value: event.details.measures },
    { label: labels.effect, value: event.details.usualEffect },
    { label: labels.frequency, value: event.details.frequency },
    { label: labels.nextRelease, value: event.details.nextReleased },
    { label: labels.notes, value: event.details.notes },
    { label: labels.whyCare, value: event.details.whyTraderCare },
  ];

  return (
    <div className="rounded-xl border border-line bg-black/20 p-5">
      <div className="space-y-5">
        {detailItems.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
              {item.label}:
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/78">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
