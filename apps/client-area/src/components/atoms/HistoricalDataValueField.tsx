type HistoricalDataValueFieldProps = {
  label: string;
  value: string;
};

export function HistoricalDataValueField({
  label,
  value,
}: HistoricalDataValueFieldProps) {
  return (
    <div className="rounded-xl border border-line bg-black/20 px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-foreground/55">
        {label}
      </p>
      <p className="mt-1 font-mono text-foreground/78">{value}</p>
    </div>
  );
}
