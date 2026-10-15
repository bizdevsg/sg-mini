export default function ClientAreaTradePilotLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <p className="text-sm font-semibold text-amber-400">Loading Trade Pilot...</p>
      <div className="h-20 animate-pulse rounded-2xl bg-zinc-900" />
      <div className="h-80 animate-pulse rounded-3xl bg-zinc-900" />
    </div>
  );
}
