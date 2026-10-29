"use client";

import { BookOpen, CircleHelp, LoaderCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

import { ClientAreaTradePilotConfidenceModal } from "@/components/organisms/ClientAreaTradePilotConfidenceModal";
import type { ClientAreaTradePilotAnalysisResultCopy } from "@/lib/client-area-trade-pilot.shared";
import { formatTradePilotDateTime } from "@/lib/trade-pilot/trade-pilot-format";
import type { TradePilotConfidence } from "@/lib/trade-pilot/trade-pilot.types";

type TradePilotDirection = "bullish" | "bearish" | "neutral";

type ClientAreaTradePilotBiasGaugeProps = {
  analyzedAt: string;
  brand: string;
  confidence?: TradePilotConfidence | null;
  copy: ClientAreaTradePilotAnalysisResultCopy;
  direction: TradePilotDirection;
  instrumentLabel: string;
  locale: "id" | "en";
  /** Analisis ulang instrumen & timeframe yang sama (memotong 1 kredit). */
  onRefresh?: () => void;
  isRefreshing?: boolean;
  refreshDisabled?: boolean;
  /** Alasan tombol nonaktif (kredit habis / dijeda admin). */
  refreshNote?: string | null;
  loadingLabel?: string;
  timeframeLabel: string;
};

/** Ringkasan alasan untuk kartu: poin pertama dari "• Dasar … • Batasan …". */
function reasonPreview(reason: string | null | undefined) {
  if (!reason) return null;
  return reason
    .split(/\n+|(?=\s•\s)/)
    .map((line) => line.replace(/^\s*•\s*/, "").trim())
    .filter(Boolean)
    .join(" ");
}

const DIRECTION_STYLES = {
  bearish: { labelKey: "bearishLabel", rotation: -55 },
  neutral: { labelKey: "neutralWaitLabel", rotation: 0 },
  bullish: { labelKey: "bullishLabel", rotation: 55 },
} as const;

export function ClientAreaTradePilotBiasGauge({
  analyzedAt,
  brand,
  confidence,
  copy,
  direction,
  instrumentLabel,
  locale,
  onRefresh,
  isRefreshing = false,
  refreshDisabled = false,
  refreshNote = null,
  loadingLabel,
  timeframeLabel,
}: ClientAreaTradePilotBiasGaugeProps) {
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const directionStyle = DIRECTION_STYLES[direction];
  const hasRange = confidence?.min != null && confidence?.max != null;
  const confidenceText = hasRange ? `${confidence!.min}% – ${confidence!.max}%` : "50% – 65%";
  const confidenceMax = hasRange ? confidence!.max! : 65;
  const riskLevel = confidence?.riskLevel ?? "medium";
  const riskLabel =
    riskLevel === "low" ? copy.lowRiskLabel : riskLevel === "high" ? copy.highRiskLabel : copy.mediumRiskLabel;
  const riskClass =
    riskLevel === "low" ? "text-emerald-400" : riskLevel === "high" ? "text-rose-400" : "text-amber-400";
  const preview = reasonPreview(confidence?.reason) ?? copy.confidenceReasonDescription;

  return (
    <article className="flex min-w-0 flex-col rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-5 sm:p-7">
      <div>
        <h3 className="text-lg font-bold text-white">{copy.directionBiasTitle}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <strong className="text-xl font-bold text-amber-400 sm:text-2xl">
            — {copy[directionStyle.labelKey]}
          </strong>
          <span className="rounded-xl bg-zinc-900/70 backdrop-blur-sm px-3 py-1.5 text-sm font-bold text-zinc-400">
            {timeframeLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          {copy.timeframeContextLabel} {timeframeLabel}
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-md">
        <svg viewBox="0 0 360 210" className="h-auto w-full" aria-hidden="true">
          <defs>
            <linearGradient id="trade-pilot-gauge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef2f2f" />
              <stop offset="35%" stopColor="#ff7b18" />
              <stop offset="58%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <path
            d="M45 170 A135 135 0 0 1 315 170"
            fill="none"
            stroke="url(#trade-pilot-gauge)"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <g transform={`rotate(${directionStyle.rotation} 180 170)`}>
            <line
              x1="180"
              y1="170"
              x2="180"
              y2="70"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
          <circle cx="180" cy="170" r="10" fill="#101113" stroke="white" strokeWidth="6" />
        </svg>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-zinc-300 sm:text-sm">
          <span>{copy.bearishBiasLabel}</span>
          <span>{copy.neutralBiasLabel}</span>
          <span>{copy.bullishBiasLabel}</span>
        </div>
      </div>

      <p className="mt-8 text-center text-sm italic text-zinc-500">
        {copy.tendencyDisclaimer}
      </p>

      <div className="mt-8 border-t border-zinc-800 pt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-400">{copy.confidenceLabel}</p>
            <strong className="mt-1 block text-lg text-white">{confidenceText}</strong>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-zinc-400">{copy.overallRiskLabel}</p>
            <strong className={`mt-1 block text-lg ${riskClass}`}>{riskLabel}</strong>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden>
          <span className={`h-2 rounded-full ${confidenceMax > 0 ? "bg-amber-600" : "bg-zinc-800"}`} />
          <span className={`h-2 rounded-full ${confidenceMax > 33 ? "bg-amber-400" : "bg-zinc-800"}`} />
          <span className={`h-2 rounded-full ${confidenceMax > 66 ? "bg-emerald-500" : "bg-zinc-800"}`} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-zinc-500">
          <span>0%</span>
          <span>100%</span>
        </div>
        <button
          type="button"
          onClick={() => setIsReasonOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-300"
        >
          <BookOpen className="h-4 w-4" />
          {copy.learnLabel}
        </button>
      </div>

      <div className="mt-7 rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-4 sm:p-5">
        <h4 className="flex items-center gap-2 font-bold text-amber-400">
          <CircleHelp className="h-5 w-5 fill-amber-400 text-black" />
          {copy.confidenceReasonTitle}
        </h4>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-300">{preview}</p>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setIsReasonOpen(true)}
          className="mt-4 rounded-xl border border-amber-500 px-4 py-2 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10"
        >
          {copy.fullReasonLabel}
        </button>
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        {copy.analyzedAtLabel}{" "}
        <time dateTime={analyzedAt}>{formatTradePilotDateTime(analyzedAt, locale)}</time>
      </p>
      <button
        type="button"
        disabled={!onRefresh || refreshDisabled || isRefreshing}
        onClick={onRefresh}
        aria-busy={isRefreshing}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-4 font-bold text-black transition enabled:hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRefreshing ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        )}
        {isRefreshing && loadingLabel ? loadingLabel : copy.refreshAnalysisLabel}
      </button>
      {refreshNote ? (
        <p className="mt-2 text-center text-xs text-zinc-400">{refreshNote}</p>
      ) : null}
      <ClientAreaTradePilotConfidenceModal
        analyzedAt={analyzedAt}
        brand={brand}
        confidence={confidence}
        copy={copy}
        instrumentLabel={instrumentLabel}
        locale={locale}
        onClose={() => setIsReasonOpen(false)}
        open={isReasonOpen}
        timeframeLabel={timeframeLabel}
      />
    </article>
  );
}
