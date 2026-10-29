import type { ClientAreaTradePilotPerformanceHistoryCopy } from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotInstrumentPerformanceProps = {
  copy: ClientAreaTradePilotPerformanceHistoryCopy;
  sample: number;
  stopLoss: number;
  takeProfit: number;
};

export function ClientAreaTradePilotInstrumentPerformance({
  copy,
  sample,
  stopLoss,
  takeProfit,
}: ClientAreaTradePilotInstrumentPerformanceProps) {
  const completed = stopLoss + takeProfit;
  const winRate = completed > 0 ? Math.round((takeProfit / completed) * 100) : 0;
  const stopLossRate = completed > 0 ? Math.round((stopLoss / completed) * 100) : 0;
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50">
      <div className="border-b border-zinc-800 px-4 py-4 sm:px-5">
        <h2 className="text-sm font-bold text-white">
          {copy.instrumentPerformanceTitle}
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          {copy.instrumentPerformanceDescription}
        </p>
      </div>

      <article className="grid gap-4 border-l-2 border-amber-400 bg-amber-500/5 px-4 py-4 sm:px-5 md:grid-cols-2 md:items-center xl:grid-cols-[minmax(150px,0.8fr)_minmax(230px,1fr)_minmax(220px,1.4fr)_auto]">
        <div className="flex items-center justify-between gap-3 sm:block">
          <strong className="text-base text-white">XAU/USD</strong>
          <span className="text-xs text-zinc-400 sm:mt-1 sm:block">
            {sample} {copy.sampleLabel}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-zinc-500">{copy.winRateLabel}</span>
            <strong className="mt-1 block text-emerald-400">{winRate}%</strong>
          </div>
          <div>
            <span className="text-zinc-500">TP</span>
            <strong className="mt-1 block text-white">{takeProfit}</strong>
          </div>
          <div>
            <span className="text-zinc-500">SL</span>
            <strong className="mt-1 block text-rose-400">{stopLoss}</strong>
          </div>
        </div>

        <div>
          <div className="flex h-2 overflow-hidden rounded-full bg-zinc-800">
            <span className="bg-emerald-500" style={{ width: `${winRate}%` }} />
            <span className="bg-rose-500" style={{ width: `${stopLossRate}%` }} />
            <span className="flex-1 bg-zinc-700" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-zinc-500">
            <span>{copy.winRateLabel} {winRate}%</span>
            <span>SL {stopLossRate}%</span>
          </div>
        </div>

        <span className="whitespace-nowrap text-xs font-semibold text-amber-400">
          {copy.viewHistoryLabel}
        </span>
      </article>
    </section>
  );
}
