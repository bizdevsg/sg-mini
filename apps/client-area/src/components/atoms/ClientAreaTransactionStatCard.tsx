import type { ReactNode } from "react";

type ClientAreaTransactionStatCardProps = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

export function ClientAreaTransactionStatCard({
  label,
  value,
  valueClassName = "text-white",
}: ClientAreaTransactionStatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-500/20 bg-linear-to-br from-zinc-900/50 to-black/50 p-3">
      <h6 className="text-sm font-semibold text-zinc-300">{label}</h6>
      <p
        className={`text-2xl font-bold tabular-nums ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}
