"use client";

import { useCallback, useEffect, useState } from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import type { TradeHistoryCard } from "@/types/trade-history";

export type TradeHistoryState =
  | { status: "loading" }
  | { status: "ready"; items: TradeHistoryCard[]; hasNext: boolean }
  | { status: "unavailable" }
  | { status: "error" };

type SettledState = Exclude<TradeHistoryState, { status: "loading" }>;

/**
 * Loads one page (10 rows) of trade history from the BFF. `loading` is derived —
 * a result only counts for the mode/page/attempt it was fetched for — so paging
 * or switching Demo/Real shows the loading state without a setState in the
 * effect body.
 */
export function useTradeHistory(mode: AccountMode, page: number) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; state: SettledState } | null>(
    null,
  );
  const requestKey = `${mode}:${page}:${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      let state: SettledState = { status: "error" };

      try {
        const response = await fetch(
          `/api/client-area/trade-history?mode=${mode}&page=${page}`,
          {
            cache: "no-store",
            headers: { Accept: "application/json" },
            signal: controller.signal,
          },
        );

        if (response.status === 401) {
          // Session gone — a reload lets the client-area layout redirect to login.
          window.location.reload();
          return;
        }

        if (response.status === 404) {
          state = { status: "unavailable" };
        } else if (response.ok) {
          const payload = (await response.json()) as {
            items?: TradeHistoryCard[];
            hasNext?: boolean;
          };

          if (Array.isArray(payload.items)) {
            state = {
              status: "ready",
              items: payload.items,
              hasNext: payload.hasNext === true,
            };
          }
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }
      }

      setResult({ key: requestKey, state });
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [mode, page, requestKey]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const state: TradeHistoryState =
    result?.key === requestKey ? result.state : { status: "loading" };

  return { state, retry };
}
