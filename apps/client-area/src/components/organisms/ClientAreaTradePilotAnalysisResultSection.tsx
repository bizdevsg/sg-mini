"use client";

import { ArrowLeftRight, Clock3, Hourglass, Info } from "lucide-react";
import { useRef } from "react";

import { ClientAreaTradePilotTimeframeButton } from "@/components/atoms/ClientAreaTradePilotTimeframeButton";
import { ClientAreaTradePilotBiasGauge } from "@/components/molecules/ClientAreaTradePilotBiasGauge";
import { ClientAreaTradePilotPricePreview } from "@/components/organisms/ClientAreaTradePilotPricePreview";
import { ClientAreaTradePilotScenarioCard } from "@/components/molecules/ClientAreaTradePilotScenarioCard";
import {
  CLIENT_AREA_TRADE_PILOT_TIMEFRAMES,
  type ClientAreaTradePilotCopy,
} from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotAnalysisResult } from "@/lib/trade-pilot/trade-pilot.types";
import type { AppLocale } from "@/locales";

type ClientAreaTradePilotAnalysisResultSectionProps = {
  copy: ClientAreaTradePilotCopy;
  locale: AppLocale;
  analysis: TradePilotAnalysisResult;
  mockDataLabel: string;
};

export function ClientAreaTradePilotAnalysisResultSection({
  copy,
  locale,
  analysis,
  mockDataLabel,
}: ClientAreaTradePilotAnalysisResultSectionProps) {
  const resultCopy = copy.analysisResult;
  const scenarioRef = useRef<HTMLElement>(null);
  const directionLabel =
    analysis.direction === "bullish"
      ? resultCopy.bullishLabel
      : analysis.direction === "bearish"
        ? resultCopy.bearishLabel
        : resultCopy.sidewaysLabel;

  return (
    <section className="min-w-0 space-y-4 pt-2 sm:space-y-5 sm:pt-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {analysis.instrumentLabel}
            </h2>
            <span className="rounded-xl border border-zinc-600 px-3 py-1 text-sm font-bold text-white">
              {analysis.timeframeLabel}
            </span>
            <span className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-black">
              {directionLabel}
            </span>
            <span className="rounded-full border border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-400">
              {mockDataLabel}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-emerald-400">
              <Clock3 className="h-5 w-5" />
              {resultCopy.relevanceLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-zinc-800/80 px-3 py-2 text-zinc-400">
              <Hourglass className="h-4 w-4" />
              {resultCopy.pendingLabel}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-500/10 px-4 py-2.5 text-sm text-zinc-400 sm:w-fit">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <strong className="text-zinc-200">
            {resultCopy.sessionWindowLabel}
          </strong>
          <span>· {resultCopy.highestLiquidityLabel}</span>
          <Info className="h-4 w-4" />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-500/10 p-4 sm:p-6">
        <h3 className="font-bold text-white">{resultCopy.changeTimeframeTitle}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {resultCopy.changeTimeframeDescription}
        </p>
        <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex min-w-0 overflow-x-auto rounded-xl border border-zinc-800 bg-[#151821] p-1">
            {CLIENT_AREA_TRADE_PILOT_TIMEFRAMES.map((item) => (
              <ClientAreaTradePilotTimeframeButton
                key={item.value}
                active={analysis.timeframe === item.value}
                disabled
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              scenarioRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 px-5 py-2.5 font-bold text-amber-400 transition hover:bg-amber-500/10"
          >
            <ArrowLeftRight className="h-5 w-5" />
            {resultCopy.compareRiskLabel}
          </button>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <strong className="text-emerald-400">{analysis.instrumentLabel}</strong>
            <strong className="font-mono text-white">OANDA:XAUUSD</strong>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 items-start gap-4 sm:gap-5 xl:grid-cols-[minmax(300px,0.72fr)_minmax(0,1fr)]">
        <ClientAreaTradePilotBiasGauge
          analyzedAt={analysis.analyzedAt}
          copy={resultCopy}
          direction={analysis.direction}
          timeframeLabel={analysis.timeframeLabel}
        />

        <div className="min-w-0 space-y-4 sm:space-y-5">
          <ClientAreaTradePilotPricePreview
            copy={resultCopy}
            instrumentLabel={analysis.instrumentLabel}
            locale={locale}
            timeframe={analysis.timeframe}
          />

          <section ref={scenarioRef} className="rounded-3xl border border-zinc-800 bg-zinc-500/10 p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-white">
                {resultCopy.suggestedLevelsTitle}
              </h3>
              <span className="w-fit rounded-full border border-amber-500/50 bg-amber-500/10 px-4 py-1.5 text-sm font-semibold text-amber-400">
                {resultCopy.recommendedSideLabel}: {resultCopy.waitLabel}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {resultCopy.suggestedLevelsDescription}
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <ClientAreaTradePilotScenarioCard
                copy={resultCopy}
                levels={analysis.buyLevels}
                variant="buy"
              />
              <ClientAreaTradePilotScenarioCard
                copy={resultCopy}
                levels={analysis.sellLevels}
                variant="sell"
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
