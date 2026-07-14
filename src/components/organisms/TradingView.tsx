"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
    memo,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

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
    locale,
    marketDetails,
    presets = DEFAULT_PRESETS,
}: TradingViewProps) {
    const resolvedPresets = presets.length > 0 ? presets : DEFAULT_PRESETS;
    const chartId = useId().replace(/:/g, "");
    const containerId = `tradingview-widget-${chartId}`;

    const containerRef = useRef<HTMLDivElement>(null);

    const disclaimerTextRef = useRef<HTMLParagraphElement>(null);
    const [iconSize, setIconSize] = useState(40);

    const fallbackPreset = resolvedPresets[0];
    const resolvedPresetId =
        activePresetId ?? defaultPresetId ?? fallbackPreset.id;

    const activePreset =
        resolvedPresets.find((preset) => preset.id === resolvedPresetId) ??
        fallbackPreset;

    const tradingViewCopy = getMessages(locale).clientArea.tradingView;

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        container.innerHTML = "";

        const script = document.createElement("script");
        script.src = TRADING_VIEW_SCRIPT_URL;
        script.type = "text/javascript";
        script.async = true;
        script.text = JSON.stringify(
            createTradingViewConfig(
                containerId,
                activePreset.symbol,
                defaultInterval,
            ),
        );

        container.appendChild(script);

        return () => {
            container.innerHTML = "";
        };
    }, [activePreset.symbol, containerId, defaultInterval]);

    useLayoutEffect(() => {
        if (!disclaimerTextRef.current) return;

        const updateSize = () => {
            const height = disclaimerTextRef.current!.offsetHeight;
            setIconSize(Math.max(height, 40));
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);
        observer.observe(disclaimerTextRef.current);

        return () => observer.disconnect();
    }, []);

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
                    className={`h-[340px] sm:h-[460px] lg:h-[600px] ${embedded
                        ? "rounded-2xl border border-zinc-800/80 bg-black/20"
                        : "rounded-xl border border-zinc-800/80 bg-black/20"
                        }`}
                >
                    <div
                        ref={containerRef}
                        id={containerId}
                        className="h-full w-full"
                    />
                </div>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-xs">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div
                        style={{
                            width: iconSize,
                            height: iconSize,
                        }}
                        className="flex shrink-0 items-center justify-center rounded-lg bg-red-500/15"
                    >
                        <TriangleAlert className="h-7 w-7 text-red-400" />
                    </div>

                    <p
                        ref={disclaimerTextRef}
                        className="flex-1 text-sm leading-8 text-zinc-200"
                    >
                        <span className="font-semibold text-red-300">
                            {tradingViewCopy.disclaimerLabel}
                        </span>{" "}
                        {tradingViewCopy.disclaimerBeforeProvider}{" "}
                        <Link
                            href="https://www.tradingview.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-red-200 transition-colors hover:text-white"
                        >
                            TradingView
                        </Link>
                        . {tradingViewCopy.disclaimerAfterProvider}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default memo(TradingView);
