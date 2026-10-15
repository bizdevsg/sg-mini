"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  ClientAreaSessionExpiredError,
  clientAreaFetch,
} from "@/lib/client-area-fetch";

type MiniChartProps = {
  className?: string;
  symbol?: string;
};

type ChartState =
  | { status: "loading" }
  | { status: "ready"; url: string; frameKey: number; symbol: string }
  | { status: "error"; symbol: string };

export function MiniChart({ className = "", symbol = "XUL10" }: MiniChartProps) {
  const [state, setState] = useState<ChartState>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);

  const refresh = useCallback(() => {
    setState({ status: "loading" });
    setRequestVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUrl() {
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
          url: payload.url,
          frameKey: requestVersion,
          symbol,
        });
      } catch (error) {
        if (
          controller.signal.aborted ||
          error instanceof ClientAreaSessionExpiredError
        ) {
          return;
        }

        setState({ status: "error", symbol });
      }
    }

    void loadUrl();

    return () => controller.abort();
  }, [requestVersion, symbol]);

  return (
    <section
      className={`overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-500/80">
            MiniMicro
          </p>
          <h2 className="text-lg font-bold text-white">Live Chart {symbol}</h2>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={state.status === "loading"}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-yellow-500/30 px-4 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/10 disabled:cursor-wait disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${state.status === "loading" ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {state.status === "loading" ||
      (state.status !== "loading" && state.symbol !== symbol) ? (
        <div className="h-[28rem] animate-pulse bg-gradient-to-br from-zinc-900 via-zinc-800/70 to-zinc-950 sm:h-[34rem] lg:h-[40rem]" />
      ) : state.status === "error" ? (
        <div className="flex h-[28rem] flex-col items-center justify-center gap-4 px-6 text-center sm:h-[34rem] lg:h-[40rem]">
          <p className="text-sm font-medium text-zinc-300">Chart gagal dimuat.</p>
          <button
            type="button"
            onClick={refresh}
            className="cursor-pointer rounded-full bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <iframe
          key={`${symbol}:${state.frameKey}`}
          src={state.url}
          title={`MiniMicro live chart ${symbol}`}
          referrerPolicy="no-referrer"
          className="h-[28rem] w-full border-0 bg-zinc-950 sm:h-[34rem] lg:h-[40rem]"
        />
      )}
    </section>
  );
}
