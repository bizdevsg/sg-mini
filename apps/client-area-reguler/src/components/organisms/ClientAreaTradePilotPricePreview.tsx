"use client";

import { useState } from "react";
import { LoaderCircle, Maximize2, Minimize2, Share2 } from "lucide-react";

import { ClientAreaTradePilotLevelsChart } from "@/components/organisms/ClientAreaTradePilotLevelsChart";
import { useClientAreaTradePilotChartActions } from "@/hooks/useClientAreaTradePilotChartActions";
import type {
  ClientAreaTradePilotAnalysisResultCopy,
  ClientAreaTradePilotCopy,
} from "@/lib/client-area-trade-pilot.shared";
import { renderTradePilotChartPng } from "@/lib/trade-pilot/trade-pilot-chart-share";
import type {
  TradePilotAnalysisResult,
  TradePilotCandleSnapshot,
} from "@/lib/trade-pilot/trade-pilot.types";

type ClientAreaTradePilotPricePreviewProps = {
  analysis: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotAnalysisResultCopy;
  fullCopy: ClientAreaTradePilotCopy;
  locale: "id" | "en";
};

export function ClientAreaTradePilotPricePreview({
  analysis,
  copy,
  fullCopy,
  locale,
}: ClientAreaTradePilotPricePreviewProps) {
  const instrumentLabel = analysis.instrumentLabel;
  const { isFullscreen, panelRef, toggleFullscreen } =
    useClientAreaTradePilotChartActions({
      captureFailedMessage: fullCopy.captureFailedMessage,
      captureUnsupportedMessage: fullCopy.captureUnsupportedMessage,
      fileLabel: `trade-pilot-${analysis.instrumentId}`,
      fullscreenUnsupportedMessage: fullCopy.fullscreenUnsupportedMessage,
    });
  const FullscreenIcon = isFullscreen ? Minimize2 : Maximize2;

  const [shareState, setShareState] = useState<"idle" | "preparing" | "downloaded" | "error">("idle");

  // Bagikan grafik sebagai PNG: share sheet (bila didukung) atau unduh file.
  const handleShare = async () => {
    setShareState("preparing");
    try {
      let candles: TradePilotCandleSnapshot["candles"] = [];
      let candleTimeframe = analysis.timeframeLabel;
      if (analysis.source === "api") {
        const params = new URLSearchParams({
          instrumentId: analysis.instrumentId,
          timeframe: analysis.timeframe,
        });
        const response = await fetch(`/api/client-area/trade-pilot/candles?${params}`, { cache: "no-store" });
        if (response.ok) {
          const snapshot = (await response.json()) as TradePilotCandleSnapshot;
          candles = snapshot.candles;
          candleTimeframe = snapshot.candleTimeframe;
        }
      }

      const blob = await renderTradePilotChartPng({
        analysis,
        candleTimeframe,
        candles,
        copy: copy.chartShare,
        locale,
      });
      const fileName = `tradepilot-${analysis.instrumentId}-${analysis.timeframeLabel}-${analysis.id}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const title = `${copy.chartShare.title} · ${instrumentLabel} · ${analysis.timeframeLabel}`;

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title });
          setShareState("idle");
          return;
        } catch (shareError) {
          if (shareError instanceof DOMException && shareError.name === "AbortError") {
            setShareState("idle");
            return;
          }
          // Share sheet gagal: lanjut unduh.
        }
      }

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      setShareState("downloaded");
    } catch {
      setShareState("error");
    }
  };

  return (
    <article
      ref={panelRef}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-5 sm:p-7 fullscreen:overflow-y-auto fullscreen:rounded-none fullscreen:border-0 fullscreen:bg-zinc-950"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{copy.priceChartTitle}</h3>
          <div className="mt-1 border border-yellow-500 bg-yellow-600/10 text-yellow-100 rounded-md w-fit px-2 py-1 flex flex-wrap items-center gap-2 text-xxs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <strong>{instrumentLabel}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-pressed={isFullscreen}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-amber-500/50"
        >
          <FullscreenIcon className="h-4 w-4" />
          {copy.viewFullChartLabel}
        </button>
      </div>

      <div className="pt-5">
        <ClientAreaTradePilotLevelsChart
          key={`${analysis.id}-${analysis.instrumentId}-${analysis.timeframe}`}
          analysis={analysis}
          copy={fullCopy}
          heightClassName={
            isFullscreen ? "h-[calc(100vh-14rem)] min-h-80" : undefined
          }
          instrumentId={analysis.instrumentId}
          timeframe={analysis.timeframe}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
        {shareState === "downloaded" || shareState === "error" ? (
          <p role="status" className={`text-xs ${shareState === "error" ? "text-rose-300" : "text-zinc-400"}`}>
            {shareState === "error" ? copy.shareChartErrorLabel : copy.shareChartDownloadedLabel}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void handleShare()}
          disabled={shareState === "preparing"}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-amber-500/50 disabled:cursor-wait disabled:opacity-60"
        >
          {shareState === "preparing" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {shareState === "preparing" ? copy.shareChartPreparingLabel : copy.shareChartLabel}
        </button>
      </div>
    </article>
  );
}
