"use client";

import type { ReactNode } from "react";
import { memo, useEffect, useRef } from "react";

import type { AppLocale } from "@/locales";

const TRADING_VIEW_SCRIPT_URL =
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

export type TradingViewPreset = {
    id: string;
    label: string;
    symbol: string;
};

export type TradingViewInterval =
    | "1"
    | "5"
    | "15"
    | "60"
    | "240"
    | "D"
    | "W"
    | "M";

type TradingViewProps = {
    activePresetId?: string;
    chartHeightClassName?: string;
    className?: string;
    defaultInterval?: TradingViewInterval;
    defaultPresetId?: string;
    embedded?: boolean;
    headerAction?: ReactNode;
    hideSideToolbar?: boolean;
    hideTopToolbar?: boolean;
    locale: AppLocale;
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
    symbol: string,
    interval: TradingViewInterval,
    hideSideToolbar: boolean,
    hideTopToolbar: boolean,
    locale: AppLocale,
) {
    return {
        allow_symbol_change: !hideTopToolbar,
        autosize: true,
        backgroundColor: "#0F0F0F",
        calendar: false,
        compareSymbols: [],
        details: !hideTopToolbar,
        gridColor: "rgba(242, 242, 242, 0.2)",
        hide_legend: false,
        hide_side_toolbar: hideSideToolbar,
        hide_top_toolbar: hideTopToolbar,
        hide_volume: false,
        hotlist: false,
        interval,
        locale,
        save_image: true,
        style: "1",
        studies: [],
        symbol,
        support_host: "https://www.tradingview.com",
        theme: "dark",
        timezone: "exchange",
        watchlist: [],
        withdateranges: true,
    } as const;
}

function TradingView({
    activePresetId,
    chartHeightClassName = "h-[340px] sm:h-[460px] lg:h-[600px]",
    className = "",
    defaultInterval = "60",
    defaultPresetId,
    embedded = false,
    headerAction,
    hideSideToolbar = false,
    hideTopToolbar = false,
    locale,
    marketDetails,
    presets = DEFAULT_PRESETS,
}: TradingViewProps) {
    const resolvedPresets = presets.length > 0 ? presets : DEFAULT_PRESETS;
    const containerRef = useRef<HTMLDivElement>(null);

    const fallbackPreset = resolvedPresets[0];
    const resolvedPresetId =
        activePresetId ?? defaultPresetId ?? fallbackPreset.id;

    const activePreset =
        resolvedPresets.find((preset) => preset.id === resolvedPresetId) ??
        fallbackPreset;

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;
        let cancelled = false;

        // React Strict Mode mounts effects twice in development. Deferring the
        // external script prevents an already-cleaned instance from finishing
        // after the active widget and interrupting its live connection.
        queueMicrotask(() => {
            if (cancelled || containerRef.current !== container) return;

            const widget = document.createElement("div");
            widget.className =
                "tradingview-widget-container__widget h-full w-full";
            container.replaceChildren(widget);

            const script = document.createElement("script");
            script.src = TRADING_VIEW_SCRIPT_URL;
            script.type = "text/javascript";
            script.async = true;
            script.textContent = JSON.stringify(
                createTradingViewConfig(
                    activePreset.symbol,
                    defaultInterval,
                    hideSideToolbar,
                    hideTopToolbar,
                    locale,
                ),
            );

            container.appendChild(script);
        });

        return () => {
            cancelled = true;
            container.replaceChildren();
        };
    }, [activePreset.symbol, defaultInterval, hideSideToolbar, hideTopToolbar, locale]);

    return (
        <div className="space-y-5">
            <div className={`space-y-4 ${className}`}>
                {headerAction || marketDetails ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        {marketDetails ? (
                            <div className="min-w-0">{marketDetails}</div>
                        ) : (
                            <div />
                        )}

                        {headerAction ? (
                            <div className="shrink-0">{headerAction}</div>
                        ) : null}
                    </div>
                ) : null}

                <div
                    className={`${chartHeightClassName} w-full overflow-hidden ${embedded
                        ? "rounded-2xl border border-zinc-800/80 bg-black/20"
                        : "rounded-xl border border-zinc-800/80 bg-black/20"
                        }`}
                >
                    <div
                        ref={containerRef}
                        data-interval={defaultInterval}
                        data-symbol={activePreset.symbol}
                        className="tradingview-widget-container h-full w-full"
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(TradingView);
