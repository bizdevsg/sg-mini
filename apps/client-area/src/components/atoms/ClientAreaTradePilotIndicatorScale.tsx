type ClientAreaTradePilotIndicatorScaleProps = {
  marker: number;
};

export function ClientAreaTradePilotIndicatorScale({
  marker,
}: ClientAreaTradePilotIndicatorScaleProps) {
  const markerPosition = Math.min(100, Math.max(0, marker));

  return (
    <div className="relative h-2.5 rounded-full bg-linear-to-r from-red-500 via-amber-400 to-emerald-400">
      <span
        aria-hidden="true"
        className="absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.45)]"
        style={{ left: `${markerPosition}%` }}
      />
    </div>
  );
}
