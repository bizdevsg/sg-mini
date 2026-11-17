import type { ClientAreaTradePilotTimeframe } from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotTimeframeButtonProps = {
  active: boolean;
  disabled?: boolean;
  label: string;
  onSelect?: (timeframe: ClientAreaTradePilotTimeframe) => void;
  /** Dijeda admin: dicoret dan diberi keterangan. */
  pausedTitle?: string;
  value: ClientAreaTradePilotTimeframe;
};

export function ClientAreaTradePilotTimeframeButton({
  active,
  disabled = false,
  label,
  onSelect,
  pausedTitle,
  value,
}: ClientAreaTradePilotTimeframeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      title={pausedTitle}
      onClick={() => onSelect?.(value)}
      className={`min-w-10 shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active
          ? "bg-yellow-500 text-black"
          : "text-zinc-400 enabled:hover:text-white"
        } ${disabled ? "cursor-default disabled:opacity-70" : ""
        } ${pausedTitle ? "line-through decoration-zinc-500" : ""}`}
    >
      {label}
    </button>
  );
}
