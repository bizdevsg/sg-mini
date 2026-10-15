import type {
  ClientAreaTradePilotPerformanceHistoryCopy,
  ClientAreaTradePilotTimeframePerformance,
} from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotTimeframePerformanceTableProps = {
  copy: ClientAreaTradePilotPerformanceHistoryCopy;
  rows: ClientAreaTradePilotTimeframePerformance[];
};

export function ClientAreaTradePilotTimeframePerformanceTable({
  copy,
  rows,
}: ClientAreaTradePilotTimeframePerformanceTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0c0e]/50">
      <div className="border-b border-zinc-800 px-4 py-4 sm:px-5">
        <h2 className="text-sm font-bold text-white">
          {copy.timeframePerformanceTitle} · XAU/USD
        </h2>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          {copy.timeframePerformanceDescription}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-xs">
          <thead className="text-zinc-400">
            <tr>
              <th className="sticky left-0 z-10 bg-[#0b0c0e] px-4 py-3 font-medium sm:px-5">
                {copy.timeframeColumnLabel}
              </th>
              <th className="px-3 py-3 font-medium">{copy.sampleColumnLabel}</th>
              <th className="px-3 py-3 font-medium">{copy.validColumnLabel}</th>
              <th className="px-3 py-3 font-medium">{copy.expiredColumnLabel}</th>
              <th className="px-3 py-3 font-medium">SL</th>
              <th className="px-3 py-3 font-medium">TP1</th>
              <th className="px-3 py-3 font-medium">TP2</th>
              <th className="px-3 py-3 font-medium">{copy.winRateColumnLabel}</th>
              <th className="px-3 py-3 font-medium">{copy.completionColumnLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.timeframe} className="border-t border-zinc-800/90 text-zinc-200">
                <th className="sticky left-0 z-10 bg-[#0b0c0e] px-4 py-4 text-sm font-bold text-white sm:px-5">
                  {row.timeframe}
                </th>
                <td className="px-3 py-4 font-semibold">{row.sample}</td>
                <td className="px-3 py-4 text-sky-300">{row.stillValid}</td>
                <td className="px-3 py-4 text-orange-300">{row.expired}</td>
                <td className="px-3 py-4 text-rose-400">{row.stopLoss}</td>
                <td className="px-3 py-4 text-emerald-400">{row.takeProfitOne}</td>
                <td className="px-3 py-4 text-teal-400">{row.takeProfitTwo}</td>
                <td className="px-3 py-4 font-semibold text-white">
                  {row.winRate !== null
                    ? `${row.winRate}%`
                    : `+${row.minimumSamples} ${copy.sampleLabel}`}
                </td>
                <td className="px-3 py-4 font-semibold text-white">
                  {row.completion !== null ? `${row.completion}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
