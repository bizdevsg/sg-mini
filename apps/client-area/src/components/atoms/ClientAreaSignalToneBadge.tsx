type ClientAreaSignalToneBadgeProps = {
  isSell: boolean;
  label?: string | null;
};

export function ClientAreaSignalToneBadge({
  isSell,
  label,
}: ClientAreaSignalToneBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${
        isSell ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
      }`}
    >
      {label || "-"}
    </span>
  );
}
