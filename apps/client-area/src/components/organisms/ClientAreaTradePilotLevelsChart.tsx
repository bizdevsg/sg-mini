
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  LineStyle,
  TickMarkType,
  type AutoscaleInfo,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { LoaderCircle, RefreshCw } from "lucide-react";

import type {
  ClientAreaTradePilotCopy,
  ClientAreaTradePilotScenarioLevels,
  ClientAreaTradePilotTimeframe,
} from "@/lib/client-area-trade-pilot.shared";
import type {
  TradePilotAnalysisResult,
  TradePilotCandleSnapshot,
  TradePilotInstrumentId,
} from "@/lib/trade-pilot/trade-pilot.types";

type Props = {
  analysis?: TradePilotAnalysisResult;
  copy: ClientAreaTradePilotCopy;
  heightClassName?: string;
  instrumentId: TradePilotInstrumentId;
  timeframe: ClientAreaTradePilotTimeframe;
};

type Side = "buy" | "sell" | "both";
type LevelLine = {
  color: string;
  lineStyle: LineStyle;
  price: number;
  title: string;
};

const COLORS = {
  buyEntry: "#06b6d4",
  down: "#ef4444",
  lastPrice: "#eab308",
  sellEntry: "#f59e0b",
  stopLoss: "#ef4444",
  takeProfit: "#10b981",
  up: "#10b981",
} as const;
const REFRESH_INTERVAL_MS = 60_000;
const VISIBLE_CANDLES = 50;
const RIGHT_PADDING_BARS = 3;
const INTRADAY_TIMEFRAMES: ClientAreaTradePilotTimeframe[] = [
  "1",
  "5",
  "15",
  "30",
  "60",
  "240",
];
const pad = (value: number) => String(value).padStart(2, "0");

function toChartCandles(snapshot: TradePilotCandleSnapshot | null) {
  const byTime = new Map<number, {
    close: number;
    high: number;
    low: number;
    open: number;
    time: UTCTimestamp;
  }>();

  for (const candle of snapshot?.candles ?? []) {
    const seconds = Math.floor(Date.parse(candle.date) / 1000);
    const { close, high, low, open } = candle;
    if (![seconds, open, high, low, close].every(Number.isFinite)) continue;
    byTime.set(seconds, { close, high, low, open, time: seconds as UTCTimestamp });
  }

  return [...byTime.values()].sort((a, b) => a.time - b.time);
}

function buildLevelLines(
  analysis: TradePilotAnalysisResult | undefined,
  side: Side,
): LevelLine[] {
  if (!analysis) return [];

  const lines: LevelLine[] = [];
  const addSide = (
    levels: ClientAreaTradePilotScenarioLevels,
    kind: "buy" | "sell",
  ) => {
    const prefix = side === "both" ? (kind === "buy" ? "B-" : "S-") : "";
    const lineStyle = kind === "buy" ? LineStyle.Solid : LineStyle.Dashed;
    const entries: [string, string, string][] = [
      ["Entry", levels.entry, kind === "buy" ? COLORS.buyEntry : COLORS.sellEntry],
      ["SL", levels.stopLoss, COLORS.stopLoss],
      ["TP1", levels.takeProfitOne, COLORS.takeProfit],
      ["TP2", levels.takeProfitTwo, COLORS.takeProfit],
    ];
    for (const [label, value, color] of entries) {
      const price = Number(value);
      if (Number.isFinite(price)) {
        lines.push({ color, lineStyle, price, title: `${prefix}${label}` });
      }
    }
  };

  if (side !== "sell") addSide(analysis.buyLevels, "buy");
  if (side !== "buy") addSide(analysis.sellLevels, "sell");
  return lines;
}

function initialSide(analysis: TradePilotAnalysisResult | undefined): Side {
  if (analysis?.direction === "bearish") return "sell";
  if (analysis?.direction === "bullish") return "buy";
  return "both";
}

function formatTickMark(time: Time, type: TickMarkType) {
  const date = new Date(Number(time) * 1000);
  const isDate =
    type === TickMarkType.Year ||
    type === TickMarkType.Month ||
    type === TickMarkType.DayOfMonth;
  return isDate
    ? `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
    : `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ClientAreaTradePilotLevelsChart({
  analysis,
  copy,
  heightClassName = "h-80 sm:h-105",
  instrumentId,
  timeframe,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const levelRangeRef = useRef<{ max: number; min: number } | null>(null);
  const hasFittedRef = useRef(false);

  const [snapshot, setSnapshot] = useState<TradePilotCandleSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  // Tampilan awal mengikuti hasil analisis: bearish -> Sell, bullish -> Buy,
  // netral/tunggu -> Gabungan. User tetap bisa beralih ke ketiga opsi.
  const recommendedSide = initialSide(analysis);
  const [side, setSide] = useState<Side>(recommendedSide);

  const isIntraday = INTRADAY_TIMEFRAMES.includes(timeframe);
  const candles = useMemo(() => toChartCandles(snapshot), [snapshot]);
  const levelLines = useMemo(
    () => buildLevelLines(analysis, side),
    [analysis, side],
  );

  const load = useCallback(async (signal: AbortSignal) => {
    try {
      const params = new URLSearchParams({ instrumentId, timeframe });
      const response = await fetch(`/api/client-area/trade-pilot/candles?${params}`, {
        cache: "no-store",
        signal,
      });
      if (!response.ok) throw new Error("candle_request_failed");
      setSnapshot(await response.json() as TradePilotCandleSnapshot);
      setError(false);
    } catch (loadError) {
      if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
        setError(true);
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [instrumentId, timeframe]);

  useEffect(() => {
    const controller = new AbortController();
    const initialLoad = window.setTimeout(() => void load(controller.signal), 0);
    const interval = window.setInterval(
      () => void load(controller.signal),
      REFRESH_INTERVAL_MS,
    );
    return () => {
      controller.abort();
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [load, reloadKey]);

  // Chart lifecycle: created once per mount, removed on unmount.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      crosshair: { mode: 0 },
      grid: {
        horzLines: { color: "rgba(63, 63, 70, 0.4)" },
        vertLines: { color: "rgba(63, 63, 70, 0.25)" },
      },
      layout: {
        attributionLogo: true,
        background: { color: "transparent", type: ColorType.Solid },
        textColor: "#a1a1aa",
      },
      rightPriceScale: { borderColor: "#27272a" },
      timeScale: {
        borderColor: "#27272a",
        tickMarkFormatter: formatTickMark,
        timeVisible: isIntraday,
      },
      localization: {
        timeFormatter: (time: Time) => {
          const date = new Date(Number(time) * 1000);
          const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
          return isIntraday
            ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`
            : `${day}/${date.getFullYear()}`;
        },
      },
    });
    const series = chart.addSeries(CandlestickSeries, {
      autoscaleInfoProvider: (
        baseImplementation: () => AutoscaleInfo | null,
      ): AutoscaleInfo | null => {
        const base = baseImplementation();
        const levels = levelRangeRef.current;
        if (!base?.priceRange || !levels) return base;
        return {
          margins: base.margins,
          priceRange: {
            maxValue: Math.max(base.priceRange.maxValue, levels.max),
            minValue: Math.min(base.priceRange.minValue, levels.min),
          },
        };
      },
      borderVisible: false,
      downColor: COLORS.down,
      lastValueVisible: true,
      priceFormat: { minMove: 0.01, precision: 2, type: "price" },
      priceLineColor: COLORS.lastPrice,
      priceLineStyle: LineStyle.Dotted,
      priceLineVisible: true,
      upColor: COLORS.up,
      wickDownColor: COLORS.down,
      wickUpColor: COLORS.up,
    });

    chartRef.current = chart;
    seriesRef.current = series;
    hasFittedRef.current = false;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      priceLinesRef.current = [];
    };
  }, [isIntraday]);

  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!chart || !series) return;
    series.setData(candles);
    if (candles.length && !hasFittedRef.current) {
      chart.timeScale().setVisibleLogicalRange({
        from: Math.max(candles.length - VISIBLE_CANDLES, 0),
        to: candles.length + RIGHT_PADDING_BARS,
      });
      hasFittedRef.current = true;
    }
  }, [candles, isIntraday]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;

    for (const line of priceLinesRef.current) series.removePriceLine(line);
    priceLinesRef.current = levelLines.map((line) =>
      series.createPriceLine({
        axisLabelVisible: true,
        color: line.color,
        lineStyle: line.lineStyle,
        lineWidth: 1,
        price: line.price,
        title: line.title,
      }),
    );

    const prices = levelLines.map((line) => line.price);
    levelRangeRef.current = prices.length
      ? { max: Math.max(...prices), min: Math.min(...prices) }
      : null;
    series.priceScale().applyOptions({ autoScale: true });
  }, [levelLines, isIntraday]);

  const sideOptions: { label: string; value: Side }[] = [
    { label: copy.analysisResult.buyScenarioLabel, value: "buy" },
    { label: copy.analysisResult.sellScenarioLabel, value: "sell" },
    { label: copy.chartBothLabel, value: "both" },
  ];
  const hasCandles = candles.length > 0;
  const showLoading = loading && !snapshot;
  const showError = error && !snapshot;
  const showEmpty = !showLoading && !showError && !hasCandles;

  return (
    <div className="pt-4">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-zinc-400">
        {snapshot ? (
          <span className="rounded-full border border-zinc-700 px-2.5 py-1">
            {copy.chartTimeframeLabel}: {snapshot.candleTimeframe}
          </span>
        ) : null}
        {snapshot?.isStale ? (
          <span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-2.5 py-1 text-amber-300">
            {copy.chartDelayedLabel}
          </span>
        ) : null}
        {analysis ? (
          <div className="ml-auto flex gap-1" role="group" aria-label={copy.analysisResult.priceChartTitle}>
            {sideOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={side === option.value}
                onClick={() => setSide(option.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition ${side === option.value
                  ? "border-amber-500 bg-amber-500/10 text-amber-300"
                  : "border-zinc-700 text-zinc-400 hover:border-amber-500/50"
                  }`}
              >
                {option.value === recommendedSide ? (
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                ) : null}
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div
        aria-label={copy.analysisResult.priceChartTitle}
        className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm ${heightClassName}`}
        role="img"
      >
        <div ref={containerRef} className="absolute inset-0" />
        {showLoading ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-zinc-400">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            {copy.chartLoadingLabel}
          </div>
        ) : null}
        {showError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-zinc-400">
            <p>{copy.chartErrorLabel}</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 font-semibold text-white hover:border-yellow-500"
              onClick={() => {
                setError(false);
                setLoading(true);
                setReloadKey((value) => value + 1);
              }}
            >
              <RefreshCw className="h-4 w-4" /> {copy.chartRetryLabel}
            </button>
          </div>
        ) : null}
        {showEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-zinc-400">
            {copy.chartEmptyLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
