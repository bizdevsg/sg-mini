"use client";

import { Clock3, Coins, Hourglass, Info, LoaderCircle, ShieldAlert } from "lucide-react";
import { useRef } from "react";

import { ClientAreaTradePilotTimeframeButton } from "@/components/atoms/ClientAreaTradePilotTimeframeButton";
import { ClientAreaTradePilotBiasGauge } from "@/components/molecules/ClientAreaTradePilotBiasGauge";
import { ClientAreaTradePilotPricePreview } from "@/components/organisms/ClientAreaTradePilotPricePreview";
import { ClientAreaTradePilotScenarioCard } from "@/components/molecules/ClientAreaTradePilotScenarioCard";
import {
  CLIENT_AREA_TRADE_PILOT_TIMEFRAMES,
  type ClientAreaTradePilotCopy,
  type ClientAreaTradePilotTimeframe,
} from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotAnalysisResult } from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotAnalysisResultSectionProps = {
  copy: ClientAreaTradePilotCopy;
  analysis: TradePilotAnalysisResult;
  mockDataLabel: string;
  /** Jalankan analisis baru (memotong 1 kredit) untuk instrumen sama, timeframe lain. */
  onTimeframeAnalyze?: (timeframe: ClientAreaTradePilotTimeframe) => void;
  /** Timeframe yang sedang dianalisis (null bila tidak ada proses). */
  pendingTimeframe?: ClientAreaTradePilotTimeframe | null;
  isAnalyzing?: boolean;
  hasCredit?: boolean;
  /** Timeframe yang sedang dijeda admin (kill switch) tidak bisa dipilih. */
  isTimeframePaused?: (timeframe: ClientAreaTradePilotTimeframe) => boolean;
  /** Pesan jeda analisis (global/mode) menggantikan catatan biaya. */
  analysisPausedMessage?: string | null;
  analysisError?: string | null;
  locale: "id" | "en";
};

export function ClientAreaTradePilotAnalysisResultSection({
  copy,
  analysis,
  mockDataLabel,
  onTimeframeAnalyze,
  pendingTimeframe = null,
  isAnalyzing = false,
  hasCredit = true,
  isTimeframePaused,
  analysisPausedMessage = null,
  analysisError = null,
  locale,
}: ClientAreaTradePilotAnalysisResultSectionProps) {
  const resultCopy = copy.analysisResult;
  const scenarioRef = useRef<HTMLElement>(null);
  const directionLabel =
    analysis.direction === "bullish"
      ? resultCopy.bullishLabel
      : analysis.direction === "bearish"
        ? resultCopy.bearishLabel
        : resultCopy.sidewaysLabel;
  const recommendedSide =
    analysis.direction === "bullish"
      ? resultCopy.recommendedBuyLabel
      : analysis.direction === "bearish"
        ? resultCopy.recommendedSellLabel
        : resultCopy.waitLabel;
  const recommendedSideClassName =
    analysis.direction === "bullish"
      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
      : analysis.direction === "bearish"
        ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
        : "border-amber-500/50 bg-amber-500/10 text-amber-400";

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
            <span className="rounded-full bg-amber-400 px-4 py-1 text-xs uppercase font-bold text-black">
              {directionLabel}
            </span>
            {analysis.source === "mock" ? (
              <span className="rounded-full border border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-400">
                {mockDataLabel}
              </span>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-emerald-400">
              <Clock3 className="h-5 w-5" />
              {resultCopy.relevanceLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-zinc-800/80 px-3 py-2 text-zinc-400 text-xs">
              <Hourglass className="h-4 w-4" />
              {resultCopy.pendingLabel}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm px-4 py-2.5 text-sm text-zinc-400 sm:w-fit">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <strong className="text-zinc-200">
            {resultCopy.sessionWindowLabel}
          </strong>
          <span>· {resultCopy.highestLiquidityLabel}</span>
          <Info className="h-4 w-4" />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-4 sm:p-6">
        <h3 className="font-bold text-white">{resultCopy.changeTimeframeTitle}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {resultCopy.changeTimeframeDescription}
        </p>
        <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex min-w-0 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-1">
            {CLIENT_AREA_TRADE_PILOT_TIMEFRAMES.map((item) =>
              pendingTimeframe === item.value ? (
                <span
                  key={item.value}
                  className="inline-flex min-w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/20 px-3 py-1.5 text-yellow-300"
                  aria-live="polite"
                >
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  <span className="sr-only">{copy.analysisLoadingLabel}</span>
                </span>
              ) : (
                <ClientAreaTradePilotTimeframeButton
                  key={item.value}
                  active={analysis.timeframe === item.value}
                  disabled={
                    !onTimeframeAnalyze ||
                    analysis.timeframe === item.value ||
                    isAnalyzing ||
                    !hasCredit ||
                    Boolean(isTimeframePaused?.(item.value))
                  }
                  label={item.label}
                  pausedTitle={
                    analysis.timeframe !== item.value && isTimeframePaused?.(item.value)
                      ? copy.analysisPausedSelectionMessage.replace("{target}", item.label)
                      : undefined
                  }
                  onSelect={onTimeframeAnalyze}
                  value={item.value}
                />
              ),
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <strong className="text-emerald-400">{analysis.instrumentLabel}</strong>
          </div>
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-400">
          <Coins className="h-3.5 w-3.5 text-yellow-500" />
          {analysisPausedMessage
            ? analysisPausedMessage
            : hasCredit
              ? resultCopy.changeTimeframeCostNote
              : copy.insufficientCreditMessage}
        </p>
        {analysisError ? (
          <p role="alert" className="mt-2 text-xs text-rose-300">
            {analysisError}
          </p>
        ) : null}
      </div>

      <div className="grid min-w-0 items-start gap-4 sm:gap-5 xl:grid-cols-[minmax(180px,0.55fr)_minmax(0,1fr)]">
        <ClientAreaTradePilotBiasGauge
          analyzedAt={analysis.analyzedAt}
          brand={resultCopy.chartShare.brand}
          confidence={analysis.confidence}
          copy={resultCopy}
          direction={analysis.direction}
          instrumentLabel={analysis.instrumentLabel}
          locale={locale}
          loadingLabel={copy.analysisLoadingLabel}
          onRefresh={onTimeframeAnalyze ? () => onTimeframeAnalyze(analysis.timeframe) : undefined}
          isRefreshing={isAnalyzing && pendingTimeframe === analysis.timeframe}
          refreshDisabled={
            isAnalyzing || !hasCredit || Boolean(isTimeframePaused?.(analysis.timeframe))
          }
          refreshNote={
            isTimeframePaused?.(analysis.timeframe)
              ? analysisPausedMessage ??
                copy.analysisPausedSelectionMessage.replace("{target}", analysis.timeframeLabel)
              : !hasCredit
                ? copy.insufficientCreditMessage
                : null
          }
          timeframeLabel={analysis.timeframeLabel}
        />

        <div className="min-w-0 space-y-4 sm:space-y-5">
          <ClientAreaTradePilotPricePreview
            analysis={analysis}
            copy={resultCopy}
            fullCopy={copy}
            locale={locale}
          />

          <section ref={scenarioRef} className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-white">
                {resultCopy.suggestedLevelsTitle}
              </h3>
              <span
                className={`w-fit rounded-full border px-4 py-1.5 text-sm font-semibold ${recommendedSideClassName}`}
              >
                {resultCopy.recommendedSideLabel}: {recommendedSide}
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

      <aside
        aria-label={resultCopy.disclaimerTitle}
        className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs leading-5 text-zinc-300"
      >
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p>
          <strong className="mr-1 text-amber-400">{resultCopy.disclaimerTitle}:</strong>
          {analysis.disclaimer ?? resultCopy.disclaimerFallback}
        </p>
      </aside>
    </section>
  );
}
