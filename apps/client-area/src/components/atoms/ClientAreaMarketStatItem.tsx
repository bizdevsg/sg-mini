import type { ReactNode } from "react";

type ClientAreaMarketStatItemProps = {
  label: ReactNode;
  value: ReactNode;
};

export function ClientAreaMarketStatItem({
  label,
  value,
}: ClientAreaMarketStatItemProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="shrink-0 uppercase text-zinc-500">{label}</div>
      <div className="truncate font-medium tabular-nums text-zinc-400">
        {value}
      </div>
    </div>
  );
}
