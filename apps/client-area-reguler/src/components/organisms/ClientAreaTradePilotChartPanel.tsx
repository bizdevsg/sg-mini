"use client";

import { useState } from "react";

import { ClientAreaTradePilotChartToolbar } from "@/components/molecules/ClientAreaTradePilotChartToolbar";
import { ClientAreaTradePilotMarketHeader } from "@/components/molecules/ClientAreaTradePilotMarketHeader";
import TradingView, {
  type TradingViewPreset,
} from "@/components/organisms/TradingView";
import { useClientAreaTradePilotChartActions } from "@/hooks/useClientAreaTradePilotChartActions";
import {
  CLIENT_AREA_TRADE_PILOT_INSTRUMENTS,
  type ClientAreaTradePilotCopy,
  type ClientAreaTradePilotInstrument,
  type ClientAreaTradePilotTimeframe,
} from "@/lib/client-area-trade-pilot.shared";
import type { LiveQuoteTick } from "@/lib/live-quotes";
import type { AppLocale } from "@/locales";

type ClientAreaTradePilotChartPanelProps = {
  copy: ClientAreaTradePilotCopy;
  instrument: ClientAreaTradePilotInstrument;
  locale: AppLocale;
  onTimeframeChange: (timeframe: ClientAreaTradePilotTimeframe) => void;
  quoteSymbol: string;
  tick?: LiveQuoteTick;
  timeframe: ClientAreaTradePilotTimeframe;
};

const TRADING_VIEW_PRESETS: TradingViewPreset[] =
  CLIENT_AREA_TRADE_PILOT_INSTRUMENTS.map((instrument) => ({
    id: instrument.id,
    label: instrument.label,
    symbol: instrument.tradingViewSymbol,
  }));

export function ClientAreaTradePilotChartPanel({
  copy,
  instrument,
  locale,
  onTimeframeChange,
  quoteSymbol,
  tick,
  timeframe,
}: ClientAreaTradePilotChartPanelProps) {
  const [isIndicatorToolbarVisible, setIsIndicatorToolbarVisible] =
    useState(false);
  const [isSideToolbarVisible, setIsSideToolbarVisible] = useState(false);
  const {
    captureChart,
    isCapturing,
    isFullscreen,
    panelRef,
    toggleFullscreen,
  } = useClientAreaTradePilotChartActions({
    captureFailedMessage: copy.captureFailedMessage,
    captureUnsupportedMessage: copy.captureUnsupportedMessage,
    fileLabel: `trade-pilot-${instrument.label}`,
    fullscreenUnsupportedMessage: copy.fullscreenUnsupportedMessage,
  });

  return (
    <section
      id="trade-pilot-main-chart"
      ref={panelRef}
      className="min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm p-3 sm:rounded-3xl sm:p-5 2xl:p-6 fullscreen:overflow-y-auto fullscreen:rounded-none fullscreen:border-0"
    >
      <ClientAreaTradePilotMarketHeader
        copy={copy}
        instrument={instrument}
        quoteSymbol={quoteSymbol}
        tick={tick}
      />
      <ClientAreaTradePilotChartToolbar
        copy={copy}
        isCapturing={isCapturing}
        isFullscreen={isFullscreen}
        isIndicatorToolbarVisible={isIndicatorToolbarVisible}
        isSideToolbarVisible={isSideToolbarVisible}
        onCapture={captureChart}
        onFullscreenToggle={toggleFullscreen}
        onIndicatorToolbarToggle={() =>
          setIsIndicatorToolbarVisible((visible) => !visible)
        }
        onSideToolbarToggle={() =>
          setIsSideToolbarVisible((visible) => !visible)
        }
        onTimeframeChange={onTimeframeChange}
        timeframe={timeframe}
      />
      <TradingView
        key={`${instrument.id}-${timeframe}-${isSideToolbarVisible}-${isIndicatorToolbarVisible}`}
        activePresetId={instrument.id}
        className="pt-5"
        defaultInterval={timeframe}
        embedded
        chartHeightClassName={
          isFullscreen ? "h-[calc(100vh-15rem)] min-h-[340px]" : undefined
        }
        hideSideToolbar={!isSideToolbarVisible}
        hideTopToolbar={!isIndicatorToolbarVisible}
        locale={locale}
        presets={TRADING_VIEW_PRESETS}
      />
    </section>
  );
}
