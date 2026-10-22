import { type ReactNode } from "react";

type ClientAreaMarketMetricItemProps = {
  label: ReactNode;
  value: ReactNode;
  valuePrefix?: ReactNode;
  valueClassName?: string;
};

export function ClientAreaMarketMetricItem({
  label,
  value,
  valuePrefix,
  valueClassName,
}: ClientAreaMarketMetricItemProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-white/5 bg-black/20 px-3 py-2.5">
      <div className="truncate text-[11px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-xs">
        {label}
      </div>

      <div
        className={`flex min-w-0 items-center gap-1 text-sm font-bold tabular-nums tracking-tight sm:text-base ${valueClassName ?? "text-zinc-100"}`}
      >
        {valuePrefix ? <span className="text-xs">{valuePrefix}</span> : null}
        <div className="truncate">{value}</div>
      </div>
    </div>
  );
}
