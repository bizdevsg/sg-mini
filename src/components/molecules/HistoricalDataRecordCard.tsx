import { type HistoricalDataRecord } from "@/lib/historical-data";
import { formatLocaleNumber, type AppLocale } from "@/locales";

type HistoricalDataRecordCardProps = {
  locale: AppLocale;
  record: HistoricalDataRecord;
  labels: {
    date: string;
    category: string;
    open: string;
    high: string;
    low: string;
    close: string;
    note: string;
    bankHoliday: string;
    noNote: string;
  };
  formatDate: (value: string, locale: AppLocale) => string;
};

type ValueFieldProps = {
  label: string;
  value: string;
};

function ValueField({ label, value }: ValueFieldProps) {
  return (
    <div className="rounded-xl border border-line bg-black/20 px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
        {label}
      </p>
      <p className="mt-1 font-mono text-foreground/78">{value}</p>
    </div>
  );
}

export function HistoricalDataRecordCard({
  locale,
  record,
  labels,
  formatDate,
}: HistoricalDataRecordCardProps) {
  return (
    <article className="rounded-2xl border border-line bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
            {labels.category}
          </p>
          <p className="mt-1 text-base font-bold text-yellow-500">
            {record.category}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
            {labels.date}
          </p>
          <p className="mt-1 text-sm text-foreground/78">
            {formatDate(record.tanggal, locale)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <ValueField
          label={labels.open}
          value={formatLocaleNumber(record.open, locale)}
        />
        <ValueField
          label={labels.high}
          value={formatLocaleNumber(record.high, locale)}
        />
        <ValueField
          label={labels.low}
          value={formatLocaleNumber(record.low, locale)}
        />
        <ValueField
          label={labels.close}
          value={formatLocaleNumber(record.close, locale)}
        />
      </div>

      <div className="mt-3 rounded-xl border border-line bg-black/20 px-3 py-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
          {labels.note}
        </p>
        <p className="mt-1 text-sm text-foreground/72">
          {record.isBankHoliday
            ? labels.bankHoliday
            : record.description || labels.noNote}
        </p>
      </div>
    </article>
  );
}
