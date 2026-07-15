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
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2 xl:min-w-40 xl:border-0 xl:bg-transparent xl:px-0 xl:py-0">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 sm:text-sm">
        {label}
      </div>

      <div
        className={`flex items-center gap-1 text-base font-black tracking-tight sm:text-xl ${valueClassName ?? "text-yellow-400"}`}
      >
        {valuePrefix ? <span className="text-xs">{valuePrefix}</span> : null}
        <div>{value}</div>
      </div>
    </div>
  );
}
