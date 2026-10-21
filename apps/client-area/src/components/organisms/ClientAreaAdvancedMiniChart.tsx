"use client";

import { useCallback, useEffect, useState } from "react";

import TradingView from "@/components/organisms/TradingView";
import {
  ClientAreaSessionExpiredError,
  clientAreaFetch,
} from "@/lib/client-area-fetch";
import { getClientAreaTradingViewPresetByMarketCode } from "@/lib/client-area-tradingview.shared";
import type { AppLocale, AppMessages } from "@/locales";

type ClientAreaAdvancedMiniChartProps = {
  copy: AppMessages["clientArea"]["homeChart"];
  locale: AppLocale;
  symbol: string;
};

type ChartState =
  | { status: "loading" }
  | { status: "ready"; frameKey: number; symbol: string; url: string }
  | { status: "fallback"; symbol: string }
  | { status: "error"; symbol: string };

const FRAME_LOAD_TIMEOUT_MS = 12000;
const TRADING_VIEW_FALLBACK_SYMBOLS = new Set([
  "HKK50_BBJ",
  "JPK50_BBJ",
]);

export function ClientAreaAdvancedMiniChart({
  copy,
  locale,
  symbol,
}: ClientAreaAdvancedMiniChartProps) {
  const [state, setState] = useState<ChartState>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);
  const [loadedFrameId, setLoadedFrameId] = useState<string | null>(null);
  const displayCode = symbol.replace(/_BBJ$/, "");
  const fallbackPreset = getClientAreaTradingViewPresetByMarketCode(symbol);
  const shouldUseTradingViewFallback = TRADING_VIEW_FALLBACK_SYMBOLS.has(
    symbol.toUpperCase(),
  );
  const frameId =
    state.status === "ready"
      ? `${state.symbol}:${state.frameKey}`
      : null;

  const refresh = useCallback(() => {
    setState({ status: "loading" });
    setRequestVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    if (shouldUseTradingViewFallback) {
      return;
    }

    const controller = new AbortController();

    async function loadChartUrl() {
      try {
        const response = await clientAreaFetch(
          `/api/chart-url?symbol=${encodeURIComponent(symbol)}`,
          {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Chart URL request failed");
        }

        const payload = (await response.json()) as { url?: string };

        if (!payload.url) {
          throw new Error("Chart URL missing");
        }

        setState({
          status: "ready",
          frameKey: requestVersion,
          symbol,
          url: payload.url,
        });
      } catch (error) {
        if (
          controller.signal.aborted ||
          error instanceof ClientAreaSessionExpiredError
        ) {
          return;
        }

        setState({ status: "fallback", symbol });
      }
    }

    void loadChartUrl();

    return () => controller.abort();
  }, [requestVersion, shouldUseTradingViewFallback, symbol]);

  useEffect(() => {
    if (!frameId || loadedFrameId === frameId) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setState((current) =>
        current.status === "ready" &&
        `${current.symbol}:${current.frameKey}` === frameId
          ? { status: "fallback", symbol: current.symbol }
          : current,
      );
    }, FRAME_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeout);
  }, [frameId, loadedFrameId]);

  return (
    <section className="overflow-hidden rounded-xl border border-yellow-400/20 bg-[#0a0a0b] shadow-2xl">
      {/* <div className="flex flex-col gap-4 border-b border-white/10 bg-gradient-to-r from-yellow-400/[0.08] via-transparent to-transparent px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
            <Activity className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500/80">
                {copy.badge}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {copy.liveLabel}
              </span>
            </div>
            <h2 className="truncate text-lg font-black text-white sm:text-xl">
              {display.label}
              <span className="ml-2 text-sm font-semibold text-zinc-500">
                {displayCode}
              </span>
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-zinc-200 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-300 disabled:cursor-wait disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {copy.refreshLabel}
        </button>
      </div> */}

      <div className="relative bg-black">
        {shouldUseTradingViewFallback && fallbackPreset ? (
          <div>
            <p className="border-b border-white/10 bg-yellow-400/10 px-4 py-2.5 text-center text-xs font-semibold text-yellow-200">
              {copy.fallbackNotice}
            </p>
            <TradingView
              activePresetId={fallbackPreset.id}
              chartHeightClassName="h-[26rem] sm:h-[32rem] lg:h-[36rem]"
              defaultInterval="60"
              embedded
              locale={locale}
              presets={[fallbackPreset]}
            />
          </div>
        ) : state.status === "loading" || state.symbol !== symbol ? (
          <div className="flex h-[26rem] items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black sm:h-[32rem] lg:h-[36rem]">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-yellow-400" />
              <p className="text-sm font-semibold text-zinc-400">{copy.loading}</p>
            </div>
          </div>
        ) : state.status === "fallback" && fallbackPreset ? (
          <div>
            <p className="border-b border-white/10 bg-yellow-400/10 px-4 py-2.5 text-center text-xs font-semibold text-yellow-200">
              {copy.fallbackNotice}
            </p>
            <TradingView
              activePresetId={fallbackPreset.id}
              chartHeightClassName="h-[26rem] sm:h-[32rem] lg:h-[36rem]"
              defaultInterval="60"
              embedded
              locale={locale}
              presets={[fallbackPreset]}
            />
          </div>
        ) : state.status === "error" || state.status === "fallback" ? (
          <div className="flex h-[26rem] flex-col items-center justify-center gap-4 px-6 text-center sm:h-[32rem] lg:h-[36rem]">
            <p className="max-w-md text-sm font-semibold text-zinc-300">
              {copy.error}
            </p>
            <button
              type="button"
              onClick={refresh}
              className="cursor-pointer rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              {copy.retryLabel}
            </button>
          </div>
        ) : (
          <iframe
            key={frameId ?? `${symbol}:${state.frameKey}`}
            src={state.url}
            title={`${copy.frameTitle} ${displayCode}`}
            referrerPolicy="no-referrer"
            onError={() => setState({ status: "fallback", symbol })}
            onLoad={() => setLoadedFrameId(frameId)}
            className="h-[26rem] w-full border-0 bg-black sm:h-[32rem] lg:h-[36rem]"
          />
        )}
      </div>
    </section>
  );
}
