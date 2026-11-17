type ClientAreaMarketSignalStatItemProps = {
  label: string;
  value: string;
};

export function ClientAreaMarketSignalStatItem({
  label,
  value,
}: ClientAreaMarketSignalStatItemProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
