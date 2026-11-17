import {
  Camera,
  ChartNoAxesCombined,
  LoaderCircle,
  Maximize,
  Minimize,
  SlidersHorizontal,
} from "lucide-react";

import { ClientAreaTradePilotIconButton } from "@/components/atoms/ClientAreaTradePilotIconButton";
import { ClientAreaTradePilotTimeframeButton } from "@/components/atoms/ClientAreaTradePilotTimeframeButton";
import {
  CLIENT_AREA_TRADE_PILOT_TIMEFRAMES,
  type ClientAreaTradePilotCopy,
  type ClientAreaTradePilotTimeframe,
} from "@/lib/client-area-trade-pilot.shared";

type ClientAreaTradePilotChartToolbarProps = {
  copy: ClientAreaTradePilotCopy;
  isCapturing: boolean;
  isFullscreen: boolean;
  isIndicatorToolbarVisible: boolean;
  isSideToolbarVisible: boolean;
  onCapture: () => void;
  onIndicatorToolbarToggle: () => void;
  onSideToolbarToggle: () => void;
  onFullscreenToggle: () => void;
  onTimeframeChange: (timeframe: ClientAreaTradePilotTimeframe) => void;
  timeframe: ClientAreaTradePilotTimeframe;
};

export function ClientAreaTradePilotChartToolbar({
  copy,
  isCapturing,
  isFullscreen,
  isIndicatorToolbarVisible,
  isSideToolbarVisible,
  onCapture,
  onFullscreenToggle,
  onIndicatorToolbarToggle,
  onSideToolbarToggle,
  onTimeframeChange,
  timeframe,
}: ClientAreaTradePilotChartToolbarProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 border-b border-zinc-800 py-4 sm:py-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="shrink-0 text-sm font-semibold text-zinc-400">
          {copy.timeframeLabel}
        </span>
        <div className="flex w-full min-w-0 max-w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-1 sm:w-auto">
          {CLIENT_AREA_TRADE_PILOT_TIMEFRAMES.map((item) => (
            <ClientAreaTradePilotTimeframeButton
              key={item.value}
              active={timeframe === item.value}
              label={item.label}
              onSelect={onTimeframeChange}
              value={item.value}
            />
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <ClientAreaTradePilotIconButton
          active={isSideToolbarVisible}
          label={copy.chartSettingsLabel}
          onClick={onSideToolbarToggle}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </ClientAreaTradePilotIconButton>
        <button
          type="button"
          aria-label={copy.indicatorLabel}
          aria-pressed={isIndicatorToolbarVisible}
          onClick={onIndicatorToolbarToggle}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
            isIndicatorToolbarVisible
              ? "border-yellow-500/60 bg-yellow-500/15 text-yellow-400"
              : "border-zinc-800 bg-zinc-900/70 backdrop-blur-sm text-zinc-300 hover:text-white"
          }`}
        >
          <ChartNoAxesCombined className="h-5 w-5" />
          <span className="hidden sm:inline">{copy.indicatorLabel}</span>
        </button>
        <ClientAreaTradePilotIconButton
          active={isFullscreen}
          label={
            isFullscreen ? copy.exitFullscreenLabel : copy.fullscreenLabel
          }
          onClick={onFullscreenToggle}
        >
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </ClientAreaTradePilotIconButton>
        <ClientAreaTradePilotIconButton
          disabled={isCapturing}
          label={
            isCapturing ? copy.captureInProgressLabel : copy.screenshotLabel
          }
          onClick={onCapture}
        >
          {isCapturing ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </ClientAreaTradePilotIconButton>
      </div>
    </div>
  );
}
