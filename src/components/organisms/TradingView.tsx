"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { memo, useEffect, useRef } from "react";

import { getMessages, type AppLocale } from "@/locales";

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
) {
    return {
        allow_symbol_change: true,
        autosize: true,
        backgroundColor: "#0F0F0F",
        calendar: false,
        compareSymbols: [],
        details: true,
        gridColor: "rgba(242, 242, 242, 0.2)",
        hide_legend: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        hide_volume: false,
        hotlist: false,
        interval,
        locale: "en",
        save_image: true,
        style: "1",
        studies: [],
        symbol,
        theme: "dark",
        timezone: "Etc/UTC",
        watchlist: [],
        withdateranges: false,
    } as const;
}

function getTradingViewSymbolUrl(symbol: string) {
    return `https://www.tradingview.com/symbols/${symbol.replace(":", "-")}/`;
}

function TradingView({
    activePresetId,
    className = "",
    defaultInterval = "60",
    defaultPresetId,
    embedded = false,
    headerAction,
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

    const symbolUrl = getTradingViewSymbolUrl(activePreset.symbol);
    const chartLabel = `${activePreset.label} chart`;
    const tradingViewCopy = getMessages(locale).clientArea.tradingView;

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const widget = container.querySelector<HTMLDivElement>(
            ".tradingview-widget-container__widget",
        );

        if (widget) {
            widget.innerHTML = "";
        }

        container.querySelectorAll("script").forEach((script) => script.remove());

        const script = document.createElement("script");
        script.src = TRADING_VIEW_SCRIPT_URL;
        script.type = "text/javascript";
        script.async = true;
        script.text = JSON.stringify(
            createTradingViewConfig(activePreset.symbol, defaultInterval),
        );

        container.appendChild(script);

        return () => {
            container.querySelectorAll("script").forEach((script) => script.remove());

            if (widget) {
                widget.innerHTML = "";
            }
        };
    }, [activePreset.symbol, defaultInterval]);

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
                    className={`h-[340px] w-full overflow-hidden sm:h-[460px] lg:h-[600px] ${embedded
                        ? "rounded-2xl border border-zinc-800/80 bg-black/20"
                        : "rounded-xl border border-zinc-800/80 bg-black/20"
                        }`}
                >
                    <div
                        ref={containerRef}
                        className="tradingview-widget-container h-full w-full"
                    >
                        <div className="tradingview-widget-container__widget h-[calc(100%-32px)] w-full" />
                        <div className="tradingview-widget-copyright px-3 py-2 text-xs">
                            <a
                                href={symbolUrl}
                                rel="noopener nofollow"
                                target="_blank"
                                className="text-sky-400 transition-colors hover:text-sky-300"
                            >
                                {chartLabel}
                            </a>
                            <span className="trademark text-zinc-400"> by TradingView</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-xs">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div>
                        <div className="relative h-10 w-[170px] shrink-0">
                            <Image
                                src="/assets/TradingView.png"
                                alt="Logo TradingView"
                                fill
                                sizes="240px"
                                className="object-contain object-left"
                            />
                        </div>

                        <p className="text-sm leading-7 text-zinc-300">
                            {tradingViewCopy.disclaimerTradingView}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(TradingView);
