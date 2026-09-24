type HistoricalDataMetricCardProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function HistoricalDataMetricCard({
  label,
  value,
  valueClassName = "text-2xl font-bold text-yellow-500",
}: HistoricalDataMetricCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">
        {label}
      </p>
      <p className={`mt-2 ${valueClassName}`}>{value}</p>
    </div>
  );
}
