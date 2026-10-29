import type { ReactNode } from "react";

type ClientAreaAccountMetricRowProps = {
  label: string;
  value: ReactNode;
  withDivider: boolean;
};

export function ClientAreaAccountMetricRow({
  label,
  value,
  withDivider,
}: ClientAreaAccountMetricRowProps) {
  return (
    <div
      className={`flex flex-col items-center justify-between gap-3 ${withDivider ? "border-b border-black/10 py-3" : "py-3"
        }`}
    >
      <span className="flex min-w-0 items-center gap-2 text-sm text-neutral-800">{label}</span>
      <span className="text-right text-lg font-bold text-black sm:text-xl">{value}</span>
    </div>
  );
}
