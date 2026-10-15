type ClientAreaTradePilotAlertLevelRowProps = {
  label: string;
  status: string;
  statusTone: "cancelled" | "triggered";
  value: string;
};

export function ClientAreaTradePilotAlertLevelRow({
  label,
  status,
  statusTone,
  value,
}: ClientAreaTradePilotAlertLevelRowProps) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-zinc-700/70 bg-[#171924]/70 px-5 py-3">
      <p className="text-xs font-semibold text-zinc-300">
        {label} @ {value}
      </p>
      <span
        className={`shrink-0 rounded-xl border px-3 py-1.5 text-[10px] font-bold ${
          statusTone === "triggered"
            ? "border-emerald-500/40 bg-emerald-950/70 text-emerald-400"
            : "border-zinc-600 bg-zinc-700/60 text-zinc-300"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
