type ClientAreaTradePilotPerformanceInsightProps = {
  label: string;
  value: string;
};

export function ClientAreaTradePilotPerformanceInsight({
  label,
  value,
}: ClientAreaTradePilotPerformanceInsightProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-[#0b0c0e]/50 px-4 py-3">
      <p className="text-xs text-zinc-400">{label}</p>
      <strong className="mt-1 block text-sm font-bold text-white">{value}</strong>
    </article>
  );
}
