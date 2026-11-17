import { type ReactNode } from "react";

type ClientAreaMarketMetricItemProps = {
  label: ReactNode;
  value: ReactNode;
  valuePrefix?: ReactNode;
  labelClassName?: string;
  valueClassName?: string;
  containerClassName?: string;
};

export function ClientAreaMarketMetricItem({
  label,
  value,
  valuePrefix,
  labelClassName,
  valueClassName,
  containerClassName,
}: ClientAreaMarketMetricItemProps) {
  return (
    <div
      className={`flex min-w-0 flex-col justify-center rounded-xl gap-1 border p-2.5 ${containerClassName ?? "border-white/5 bg-black/20"}`}
    >
      <div
        className={`truncate text-xs font-black uppercase tracking-wide ${labelClassName ?? "text-zinc-400"}`}
      >
        {label}
      </div>

      <div
        className={`flex min-w-0 items-center justify-between gap-3 text-lg font-black tabular-nums tracking-tight sm:text-xl ${valueClassName ?? "text-zinc-100"}`}
      >
        {valuePrefix ? <span className="shrink-0">{valuePrefix}</span> : null}

        <div className="truncate">{value}</div>
      </div>
    </div>
  );
}
