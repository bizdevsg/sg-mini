import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ClientAreaSentimentPanelProps = {
  buyersLabel: string;
  sellersLabel: string;
  sentimentLabel: string;
};

export function ClientAreaSentimentPanel({
  buyersLabel,
  sellersLabel,
  sentimentLabel,
}: ClientAreaSentimentPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-4">
      <span className="flex items-center gap-2 text-xs font-bold text-zinc-400">
        <FontAwesomeIcon
          icon={["fas", "scale-balanced"]}
          className="text-yellow-500"
        />
        {sentimentLabel}
      </span>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full w-[68%] bg-emerald-500" />
        <div className="h-full w-[32%] bg-rose-500" />
      </div>
      <div className="flex justify-between text-[11px] font-bold">
        <span className="text-emerald-500">{buyersLabel} (68%)</span>
        <span className="text-rose-500">(32%) {sellersLabel}</span>
      </div>
    </div>
  );
}
