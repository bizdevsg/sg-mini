import {
  Clock3,
  ShieldCheck,
  ShieldX,
  Target,
  TrendingDown,
  TriangleAlert,
} from "lucide-react";

import { ClientAreaTradePilotStatCard } from "@/components/atoms/ClientAreaTradePilotStatCard";
import { ClientAreaTradePilotPerformanceInsight } from "@/components/atoms/ClientAreaTradePilotPerformanceInsight";
import { ClientAreaTradePilotInstrumentPerformance } from "@/components/molecules/ClientAreaTradePilotInstrumentPerformance";
import { ClientAreaTradePilotTimeframePerformanceTable } from "@/components/molecules/ClientAreaTradePilotTimeframePerformanceTable";
import type {
  ClientAreaTradePilotPerformanceHistoryCopy,
  ClientAreaTradePilotTimeframePerformance,
} from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotHistoryItem } from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPlaceholderPanelProps = {
  description: string;
  performanceCopy?: ClientAreaTradePilotPerformanceHistoryCopy;
  title: string;
  histories?: TradePilotHistoryItem[];
  timeframePerformance?: ClientAreaTradePilotTimeframePerformance[];
};

export function ClientAreaTradePilotPlaceholderPanel({
  description,
  performanceCopy,
  title,
  histories = [],
  timeframePerformance = [],
}: ClientAreaTradePilotPlaceholderPanelProps) {
  const countStatus = (status: TradePilotHistoryItem["status"]) =>
    histories.filter((item) => item.status === status).length;
  const stopLossCount = countStatus("stop_loss");
  const takeProfitCount = countStatus("take_profit_1") + countStatus("take_profit_2");
  const strongestWinRate = timeframePerformance
    .filter((row) => row.winRate !== null)
    .sort((left, right) => (right.winRate ?? 0) - (left.winRate ?? 0))[0];
  const mostExpired = [...timeframePerformance].sort(
    (left, right) => right.expired - left.expired,
  )[0];
  const mostStopLoss = [...timeframePerformance].sort(
    (left, right) => right.stopLoss - left.stopLoss,
  )[0];
  const statistics = performanceCopy
    ? [
      {
        featured: false,
        icon: Target,
        label: performanceCopy.stats.totalAnalysis,
        tone: "amber" as const,
        value: String(histories.length),
      },
      {
        featured: false,
        icon: Clock3,
        label: performanceCopy.stats.stillValid,
        tone: "sky" as const,
        value: String(countStatus("still_valid")),
      },
      {
        featured: false,
        icon: ShieldX,
        label: performanceCopy.stats.expired,
        tone: "orange" as const,
        value: String(countStatus("expired")),
      },
      {
        featured: false,
        icon: TrendingDown,
        label: performanceCopy.stats.stopLoss,
        tone: "rose" as const,
        value: String(stopLossCount),
      },
      {
        featured: false,
        icon: ShieldCheck,
        label: performanceCopy.stats.takeProfitOne,
        tone: "emerald" as const,
        value: String(countStatus("take_profit_1")),
      },
      {
        featured: false,
        icon: ShieldCheck,
        label: performanceCopy.stats.takeProfitTwo,
        tone: "teal" as const,
        value: String(countStatus("take_profit_2")),
      },
      {
        featured: false,
        icon: TriangleAlert,
        label: performanceCopy.stats.invalid,
        tone: "orange" as const,
        value: String(countStatus("invalid")),
      },
    ]
    : [];

  return (
    <section className="space-y-3">
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-white sm:text-xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {description}
        </p>
      </div>

      {performanceCopy ? (
        <>
          <div className="rounded-xl border border-zinc-700 p-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-full rounded-lg border border-amber-500 bg-amber-500/10 p-3 text-sm font-semibold text-amber-400"
              >
                {performanceCopy.summaryTabLabel}
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-transparent p-3 text-sm font-semibold text-zinc-400"
              >
                {performanceCopy.historyTabLabel}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[performanceCopy.allPeriodLabel, "7D", "30D", "90D"].map(
              (period, index) => (
                <button
                  key={period}
                  type="button"
                  className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold ${index === 0
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-zinc-700 text-zinc-400"
                    }`}
                >
                  {period}
                </button>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 xl:grid-cols-7">
            {statistics.map((statistic) => (
              <ClientAreaTradePilotStatCard
                key={statistic.label}
                featured={statistic.featured}
                icon={statistic.icon}
                label={statistic.label}
                tone={statistic.tone}
                value={statistic.value}
              />
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <ClientAreaTradePilotPerformanceInsight
              label={performanceCopy.consistentTimeframeLabel}
              value={strongestWinRate ? `${strongestWinRate.timeframe} · ${strongestWinRate.winRate}%` : "—"}
            />
            <ClientAreaTradePilotPerformanceInsight
              label={performanceCopy.mostExpiredLabel}
              value={mostExpired ? `${mostExpired.timeframe} · ${mostExpired.expired}` : "—"}
            />
            <ClientAreaTradePilotPerformanceInsight
              label={performanceCopy.mostStopLossLabel}
              value={mostStopLoss ? `${mostStopLoss.timeframe} · ${mostStopLoss.stopLoss}` : "—"}
            />
          </div>

          <ClientAreaTradePilotInstrumentPerformance
            copy={performanceCopy}
            sample={histories.length}
            stopLoss={stopLossCount}
            takeProfit={takeProfitCount}
          />
          <ClientAreaTradePilotTimeframePerformanceTable
            copy={performanceCopy}
            rows={timeframePerformance}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-[#101113] p-5 text-sm leading-6 text-zinc-400 sm:p-7">
          {description}
        </div>
      )}
    </section>
  );
}
