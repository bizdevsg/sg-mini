import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  formatSignedPercent,
  formatUsd,
  resolveSignalBadge,
} from "@/components/organisms/client-area.shared";
import type {
  DashboardCopy,
  MarketPrice,
} from "@/components/organisms/client-area.types";

type ClientAreaMarketPanelProps = {
  copy: DashboardCopy;
  prices: MarketPrice[];
  onTrade: () => void;
};

export function ClientAreaMarketPanel({
  copy,
  prices,
  onTrade,
}: ClientAreaMarketPanelProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-500">
        <FontAwesomeIcon icon={["fas", "chart-line"]} />
        {copy.marketWatchTitle}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="px-4 py-3">{copy.marketTableHeaders.symbol}</th>
              <th className="px-4 py-3">{copy.marketTableHeaders.name}</th>
              <th className="px-4 py-3">{copy.marketTableHeaders.bid}</th>
              <th className="px-4 py-3">{copy.marketTableHeaders.ask}</th>
              <th className="px-4 py-3">{copy.marketTableHeaders.change}</th>
              <th className="px-4 py-3 text-center">
                {copy.marketTableHeaders.action}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {prices.map((item) => {
              const signal = resolveSignalBadge(item.change);

              return (
                <tr key={item.symbol} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-bold text-yellow-400">
                    {item.symbol}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{item.name}</td>
                  <td className="px-4 py-3">{formatUsd(item.bid)}</td>
                  <td className="px-4 py-3">{formatUsd(item.ask)}</td>
                  <td className={`px-4 py-3 font-semibold ${signal.className}`}>
                    {formatSignedPercent(item.change)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={onTrade}
                      className="rounded-lg bg-yellow-500 px-3 py-1 text-xs font-bold text-black transition hover:bg-yellow-400"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
