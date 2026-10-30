"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  ClientAreaSessionExpiredError,
  clientAreaFetch,
} from "@/lib/client-area-fetch";
import { getMessages, type AppLocale } from "@/locales";

type MiniChartProps = {
  className?: string;
  locale: AppLocale;
  symbol?: string;
};

type ChartState =
  | { status: "loading" }
  | { status: "ready"; url: string; frameKey: number; symbol: string }
  | { status: "error"; symbol: string };

export function MiniChart({ className = "", locale, symbol = "XUL10" }: MiniChartProps) {
  const copy = getMessages(locale).clientArea.homeChart;
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
      {state.status === "loading" || state.symbol !== symbol ? (
        <div className="h-[28rem] animate-pulse bg-gradient-to-br from-zinc-900 via-zinc-800/70 to-zinc-950 sm:h-[34rem] lg:h-[40rem]" />
      ) : state.status === "error" ? (
        <div className="flex h-[28rem] flex-col items-center justify-center gap-4 px-6 text-center sm:h-[34rem] lg:h-[40rem]">
          <p className="text-sm font-medium text-zinc-300">{copy.error}</p>
          <button
            type="button"
            onClick={refresh}
            className="cursor-pointer rounded-full bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            {copy.retryLabel}
          </button>
        </div>
      ) : (
        <iframe
          key={`${symbol}:${state.frameKey}`}
          src={state.url}
          title={`${copy.frameTitle} ${symbol}`}
          referrerPolicy="no-referrer"
          className="h-[28rem] w-full border-0 bg-zinc-950 sm:h-[34rem] lg:h-[40rem]"
        />
      )}
    </section>
  );
}
