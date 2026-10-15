import { ChartNoAxesCombined, TrendingDown, TrendingUp } from "lucide-react";

import { ClientAreaTradePilotIndicatorScale } from "@/components/atoms/ClientAreaTradePilotIndicatorScale";
import { ClientAreaTradePilotIndicatorCard } from "@/components/molecules/ClientAreaTradePilotIndicatorCard";
import type { ClientAreaTradePilotTechnicalIndicatorsCopy } from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotAnalysisResult } from "@/lib/trade-pilot/trade-pilot.types";

type IndicatorStatus = "buy" | "neutral" | "sell";

type ClientAreaTradePilotTechnicalIndicatorsSectionProps = {
  analysis: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotTechnicalIndicatorsCopy;
};

const INDICATORS = [
  {
    group: "oscillator",
    label: "RSI (14)",
    marker: 45,
    neutral: "buy",
    status: "buy",
    value: "44.87",
  },
  {
    group: "oscillator",
    label: "MACD (12,26)",
    marker: 15,
    neutral: "sell",
    status: "sell",
    value: "-5.4698",
  },
  {
    group: "oscillator",
    label: "Stochastic %K",
    marker: 21,
    neutral: "buy",
    status: "buy",
    value: "20.69",
  },
  {
    group: "oscillator",
    label: "Bollinger",
    marker: 50,
    neutral: "neutral",
    status: "neutral",
    value: "4135.63–4208.16",
  },
  {
    group: "movingAverage",
    label: "EMA (9)",
    marker: 10,
    neutral: "sell",
    status: "sell",
    value: "4160.23",
  },
  {
    group: "movingAverage",
    label: "SMA (10)",
    marker: 85,
    neutral: "buy",
    status: "buy",
    value: "4157.96",
  },
  {
    group: "movingAverage",
    label: "SMA (20)",
    marker: 10,
    neutral: "sell",
    status: "sell",
    value: "4171.89",
  },
  {
    group: "movingAverage",
    label: "EMA (21)",
    marker: 10,
    neutral: "buy",
    status: "sell",
    value: "4166.32",
  },
  {
    group: "movingAverage",
    label: "EMA (50)",
    marker: 10,
    neutral: "sell",
    status: "sell",
    value: "4174.41",
  },
  {
    group: "movingAverage",
    label: "SMA (50)",
    marker: 10,
    neutral: "buy",
    status: "sell",
    value: "4166.58",
  },
  {
    group: "movingAverage",
    label: "SMA (100)",
    marker: 10,
    neutral: "sell",
    status: "sell",
    value: "4198.79",
  },
] as const;

function reverseStatus(status: IndicatorStatus): IndicatorStatus {
  return status === "buy" ? "sell" : status === "sell" ? "buy" : "neutral";
}

export function ClientAreaTradePilotTechnicalIndicatorsSection({
  analysis,
  copy,
}: ClientAreaTradePilotTechnicalIndicatorsSectionProps) {
  const indicators = INDICATORS.map((indicator) => {
    const status: IndicatorStatus =
      analysis.direction === "bullish"
        ? reverseStatus(indicator.status)
        : analysis.direction === "neutral"
          ? indicator.neutral
          : indicator.status;
    const marker =
      analysis.direction === "bullish"
        ? 100 - indicator.marker
        : analysis.direction === "neutral"
          ? status === "buy"
            ? 75
            : status === "sell"
              ? 25
              : 50
          : indicator.marker;

    return { ...indicator, marker, status };
  });
  const count = (status: IndicatorStatus, group?: string) =>
    indicators.filter(
      (indicator) =>
        indicator.status === status && (!group || indicator.group === group),
    ).length;
  const directionTone =
    analysis.direction === "bullish"
      ? "text-emerald-400"
      : analysis.direction === "bearish"
        ? "text-red-400"
        : "text-amber-400";
  const directionTitle =
    analysis.direction === "bullish"
      ? copy.leaningBullishLabel
      : analysis.direction === "bearish"
        ? copy.leaningBearishLabel
        : copy.neutralLabel;
  const directionAction =
    analysis.direction === "bullish"
      ? copy.buyLabel
      : analysis.direction === "bearish"
        ? copy.sellLabel
        : copy.waitLabel;
  const summaryMarker =
    analysis.direction === "bullish"
      ? 67
      : analysis.direction === "bearish"
        ? 33
        : 50;
  const price = (
    (Number(analysis.buyLevels.entry) + Number(analysis.sellLevels.entry)) /
    2
  ).toFixed(2);
  const statusLabel = (status: IndicatorStatus) =>
    status === "buy"
      ? copy.buyLabel
      : status === "sell"
        ? copy.sellLabel
        : copy.neutralLabel;

  return (
    <section className="rounded-3xl border border-zinc-800 bg-[#101113]/50 p-5 sm:p-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
            <ChartNoAxesCombined className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-black text-white sm:text-xl">
              {copy.title} — {analysis.timeframeLabel}
            </h2>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              {copy.description}
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 sm:text-sm">
          {copy.dataLabel} {analysis.timeframeLabel} • {copy.candleCountLabel}
        </p>
      </header>

      <div className="mt-7 grid rounded-2xl border border-zinc-700/70 bg-[#171924]/20 sm:grid-cols-3">
        <div className="p-4 text-center sm:border-r sm:border-zinc-700/70">
          <span className="text-xs text-zinc-400">{copy.priceLabel}</span>
          <strong className="mt-1 block text-base text-white">{price}</strong>
        </div>
        <div className="border-t border-zinc-700/70 p-4 text-center sm:border-r sm:border-t-0">
          <span className="text-xs text-zinc-400">{copy.lastBarLabel}</span>
          <strong className="mt-1 flex items-center justify-center gap-1 text-base text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            +0.02%
          </strong>
        </div>
        <div className="border-t border-zinc-700/70 p-4 text-center sm:border-t-0">
          <span className="text-xs text-zinc-400">{copy.twentyBarsLabel}</span>
          <strong className={`mt-1 flex items-center justify-center gap-1 text-base ${directionTone}`}>
            {analysis.direction === "bullish" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {analysis.direction === "bullish"
              ? "+0.87%"
              : analysis.direction === "bearish"
                ? "-0.87%"
                : "0.00%"}
          </strong>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-zinc-700/70 bg-[#171924]/20 p-5 sm:p-7">
        <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-400">
          {copy.signalSummaryLabel}
        </h3>
        <div className="mx-auto mt-6 max-w-xl">
          <ClientAreaTradePilotIndicatorScale marker={summaryMarker} />
          <h4 className={`mt-4 text-center text-2xl font-black ${directionTone}`}>
            {directionTitle}
          </h4>
          <p className={`mt-1 text-center text-sm font-bold uppercase ${directionTone}`}>
            ({directionAction})
          </p>
          <div className="mt-6 grid grid-cols-3 text-center text-xs font-bold sm:text-sm">
            <span className="text-emerald-400">
              {count("buy")} {copy.bullishLabel}
            </span>
            <span className="text-zinc-400">
              {count("neutral")} {copy.neutralLabel}
            </span>
            <span className="text-red-400">
              {count("sell")} {copy.bearishLabel}
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {["oscillator", "movingAverage"].map((group) => {
            const groupDirection =
              count("buy", group) > count("sell", group)
                ? "buy"
                : count("sell", group) > count("buy", group)
                  ? "sell"
                  : "neutral";
            return (
              <div
                className="rounded-2xl border border-zinc-700/70 p-5"
                key={group}
              >
                <p className="text-center text-sm text-zinc-400">
                  {group === "oscillator"
                    ? copy.oscillatorLabel
                    : copy.movingAverageLabel}
                </p>
                <div className="mx-auto mt-4 max-w-xs">
                  <ClientAreaTradePilotIndicatorScale
                    marker={
                      groupDirection === "buy"
                        ? 67
                        : groupDirection === "sell"
                          ? 33
                          : 50
                    }
                  />
                </div>
                <p className={`mt-4 text-center text-sm font-bold ${groupDirection === "buy" ? "text-emerald-400" : groupDirection === "sell" ? "text-red-400" : "text-zinc-400"}`}>
                  {groupDirection === "buy"
                    ? copy.leaningBullishLabel
                    : groupDirection === "sell"
                      ? copy.leaningBearishLabel
                      : copy.neutralLabel}{" "}
                  ({statusLabel(groupDirection)})
                </p>
                <div className="mt-4 grid grid-cols-3 text-xs">
                  <span className="text-emerald-400">{count("buy", group)} {copy.bullishLabel}</span>
                  <span className="text-center text-zinc-400">{count("neutral", group)} {copy.neutralLabel}</span>
                  <span className="text-right text-red-400">{count("sell", group)} {copy.bearishLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(["oscillator", "movingAverage"] as const).map((group) => (
        <div className="mt-7" key={group}>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
            {group === "oscillator" ? copy.oscillatorLabel : copy.movingAveragesLabel}
          </h3>
          <div className={`grid gap-4 ${group === "oscillator" ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
            {indicators.filter((indicator) => indicator.group === group).map((indicator) => (
              <ClientAreaTradePilotIndicatorCard
                key={indicator.label}
                label={indicator.label}
                marker={indicator.marker}
                status={indicator.status}
                statusLabel={statusLabel(indicator.status)}
                value={indicator.value}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
