import { ClientAreaTradePilotIndicatorScale } from "@/components/atoms/ClientAreaTradePilotIndicatorScale";

type ClientAreaTradePilotIndicatorCardProps = {
  label: string;
  marker: number;
  status: "buy" | "neutral" | "sell";
  statusLabel: string;
  value: string;
};

const STATUS_CLASS_NAMES = {
  buy: "text-emerald-400",
  neutral: "text-zinc-400",
  sell: "text-red-400",
} as const;

export function ClientAreaTradePilotIndicatorCard({
  label,
  marker,
  status,
  statusLabel,
  value,
}: ClientAreaTradePilotIndicatorCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-700/70 bg-zinc-900/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-sm font-medium text-zinc-400 sm:text-base">{label}</h4>
        <strong className="shrink-0 text-sm font-black text-white sm:text-base">
          {value}
        </strong>
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <ClientAreaTradePilotIndicatorScale marker={marker} />
        <strong className={`text-xs ${STATUS_CLASS_NAMES[status]}`}>
          {statusLabel}
        </strong>
      </div>
    </article>
  );
}
