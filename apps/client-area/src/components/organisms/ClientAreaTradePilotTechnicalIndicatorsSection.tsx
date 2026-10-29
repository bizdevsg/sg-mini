"use client";

import { useEffect, useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";

import { ClientAreaTradePilotIndicatorScale } from "@/components/atoms/ClientAreaTradePilotIndicatorScale";
import { ClientAreaTradePilotIndicatorCard } from "@/components/molecules/ClientAreaTradePilotIndicatorCard";
import type { ClientAreaTradePilotTechnicalIndicatorsCopy } from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotAnalysisResult,
  TradePilotIndicator,
  TradePilotIndicatorSnapshot,
  TradePilotIndicatorStatus,
} from "@/lib/trade-pilot/trade-pilot.types";

type Props = {
  analysis: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotTechnicalIndicatorsCopy;
};

export function ClientAreaTradePilotTechnicalIndicatorsSection({ analysis, copy }: Props) {
  const [liveIndicators, setLiveIndicators] = useState<TradePilotIndicator[] | null>(null);

  useEffect(() => {
    if (analysis.source !== "api") return;
    const controller = new AbortController();
    const load = () => {
      const params = new URLSearchParams({
        instrumentId: analysis.instrumentId,
        timeframe: analysis.timeframe,
      });
      void fetch(`/api/client-area/trade-pilot/indicators?${params}`, {
        cache: "no-store",
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error("indicator_request_failed");
          return response.json() as Promise<TradePilotIndicatorSnapshot>;
        })
        .then((snapshot) => setLiveIndicators(snapshot.items))
        .catch(() => undefined);
    };
    load();
    const interval = window.setInterval(load, 60_000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [analysis.instrumentId, analysis.source, analysis.timeframe]);

  const indicators = (liveIndicators ?? analysis.indicators).map((indicator) => ({
    ...indicator,
    group: indicator.group === "oscillator" ? "oscillator" : "movingAverage",
  }));
  const count = (status: TradePilotIndicatorStatus, group?: string) =>
    indicators.filter(
      (indicator) => indicator.status === status && (!group || indicator.group === group),
    ).length;
  const summaryStatus: TradePilotIndicatorStatus =
    count("buy") > count("sell")
      ? "buy"
      : count("sell") > count("buy")
        ? "sell"
        : "neutral";
  const statusLabel = (status: TradePilotIndicatorStatus) =>
    status === "buy"
      ? copy.buyLabel
      : status === "sell"
        ? copy.sellLabel
        : copy.neutralLabel;
  const statusTone = (status: TradePilotIndicatorStatus) =>
    status === "buy"
      ? "text-emerald-400"
      : status === "sell"
        ? "text-red-400"
        : "text-zinc-400";
  const marker = (status: TradePilotIndicatorStatus) =>
    status === "buy" ? 67 : status === "sell" ? 33 : 50;

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-5 sm:p-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
            <ChartNoAxesCombined className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-black text-white sm:text-xl">
              {copy.title} — {analysis.timeframeLabel}
            </h2>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">{copy.description}</p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 sm:text-sm">
          {copy.dataLabel} {analysis.timeframeLabel}
        </p>
      </header>

      <div className="mt-7 rounded-2xl border border-zinc-700/70 bg-zinc-900/20 p-4 text-center">
        <span className="text-xs text-zinc-400">{copy.priceLabel}</span>
        <strong className="mt-1 block text-base text-white">{analysis.priceAtAnalysis}</strong>
      </div>

      <div className="mt-7 rounded-2xl border border-zinc-700/70 bg-zinc-900/20 p-5 sm:p-7">
        <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-400">
          {copy.signalSummaryLabel}
        </h3>
        <div className="mx-auto mt-6 max-w-xl">
          <ClientAreaTradePilotIndicatorScale marker={marker(summaryStatus)} />
          <h4 className={`mt-4 text-center text-2xl font-black ${statusTone(summaryStatus)}`}>
            {summaryStatus === "buy"
              ? copy.leaningBullishLabel
              : summaryStatus === "sell"
                ? copy.leaningBearishLabel
                : copy.neutralLabel}
          </h4>
          <p className={`mt-1 text-center text-sm font-bold uppercase ${statusTone(summaryStatus)}`}>
            ({statusLabel(summaryStatus)})
          </p>
          <div className="mt-6 grid grid-cols-3 text-center text-xs font-bold sm:text-sm">
            <span className="text-emerald-400">{count("buy")} {copy.bullishLabel}</span>
            <span className="text-zinc-400">{count("neutral")} {copy.neutralLabel}</span>
            <span className="text-red-400">{count("sell")} {copy.bearishLabel}</span>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {(["oscillator", "movingAverage"] as const).map((group) => {
            const groupStatus: TradePilotIndicatorStatus =
              count("buy", group) > count("sell", group)
                ? "buy"
                : count("sell", group) > count("buy", group)
                  ? "sell"
                  : "neutral";
            return (
              <div className="rounded-2xl border border-zinc-700/70 p-5" key={group}>
                <p className="text-center text-sm text-zinc-400">
                  {group === "oscillator" ? copy.oscillatorLabel : copy.movingAverageLabel}
                </p>
                <div className="mx-auto mt-4 max-w-xs">
                  <ClientAreaTradePilotIndicatorScale marker={marker(groupStatus)} />
                </div>
                <p className={`mt-4 text-center text-sm font-bold ${statusTone(groupStatus)}`}>
                  {statusLabel(groupStatus)}
                </p>
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
                key={indicator.key}
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
