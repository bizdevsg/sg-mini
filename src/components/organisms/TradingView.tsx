"use client";

import type { ReactNode } from "react";
import { memo, useEffect, useId, useRef } from "react";

const TRADING_VIEW_SCRIPT_URL =
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

export type TradingViewPreset = {
    id: string;
    label: string;
    symbol: string;
};

type TradingViewInterval = "15" | "60" | "240" | "D";

type TradingViewProps = {
    activePresetId?: string;
    className?: string;
    defaultInterval?: TradingViewInterval;
    defaultPresetId?: string;
    embedded?: boolean;
    headerAction?: ReactNode;
    marketDetails?: ReactNode;
    presets?: TradingViewPreset[];
};

const DEFAULT_PRESETS: TradingViewPreset[] = [
    { id: "gold", label: "Gold", symbol: "OANDA:XAUUSD" },
    { id: "silver", label: "Silver", symbol: "OANDA:XAGUSD" },
    { id: "eurusd", label: "EUR/USD", symbol: "OANDA:EURUSD" },
    { id: "gbpusd", label: "GBP/USD", symbol: "OANDA:GBPUSD" },
    { id: "usdjpy", label: "USD/JPY", symbol: "OANDA:USDJPY" },
    { id: "usdcad", label: "USD/CAD", symbol: "OANDA:USDCAD" },
    { id: "usdidr", label: "USD/IDR", symbol: "FX_IDC:USDIDR" },
];

function createTradingViewConfig(
    containerId: string,
    symbol: string,
    interval: TradingViewInterval,
) {
    return {
        autosize: true,
        allow_symbol_change: false,
        calendar: false,
        compareSymbols: [],
        container_id: containerId,
        details: false,
        hide_side_toolbar: true,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_volume: false,
        hotlist: false,
        interval,
        locale: "en",
        save_image: true,
        style: "1",
        studies: ["STD;Stochastic_RSI"],
        symbol,
        theme: "dark",
        timezone: "Etc/UTC",
        backgroundColor: "#0F0F0F",
        gridColor: "rgba(242, 242, 242, 0.06)",
        watchlist: [],
        withdateranges: false,
    } as const;
}

function TradingView({
    activePresetId,
    className = "",
    defaultInterval = "D",
    defaultPresetId,
    embedded = false,
    headerAction,
    marketDetails,
    presets = DEFAULT_PRESETS,
}: TradingViewProps) {
    const resolvedPresets = presets.length > 0 ? presets : DEFAULT_PRESETS;
    const chartId = useId().replace(/:/g, "");
    const containerId = `tradingview-widget-${chartId}`;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const fallbackPreset = resolvedPresets[0];
    const resolvedPresetId = activePresetId ?? defaultPresetId ?? fallbackPreset.id;
    const activePreset =
        resolvedPresets.find((preset) => preset.id === resolvedPresetId) ?? fallbackPreset;

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = TRADING_VIEW_SCRIPT_URL;
        script.type = "text/javascript";
        script.async = true;
        script.text = JSON.stringify(
            createTradingViewConfig(containerId, activePreset.symbol, defaultInterval),
        );

        container.appendChild(script);

        return () => {
            container.innerHTML = "";
        };
    }, [activePreset.symbol, containerId, defaultInterval]);

    return (
        <div className={`space-y-4 ${className}`}>
            {headerAction || marketDetails ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    {marketDetails ? <div className="min-w-0">{marketDetails}</div> : <div />}
                    {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
                </div>
            ) : null}

            <div
                className={`h-[420px] sm:h-[520px] lg:h-[600px] ${embedded ? "rounded-2xl border border-zinc-800/80 bg-black/20" : "rounded-xl border border-zinc-800/80 bg-black/20"}`}
            >
                <div ref={containerRef} id={containerId} className="h-full w-full" />
            </div>
        </div>
    );
}

export default memo(TradingView);
