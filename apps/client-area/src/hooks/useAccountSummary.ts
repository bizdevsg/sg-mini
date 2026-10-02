"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import type {
  AccountSummaryCard,
  OpenPositionCard,
  SettledPositionCard,
} from "@/types/account-summary";

export type AccountSummaryState =
  | { status: "loading" }
  | {
      status: "ready";
      account: AccountSummaryCard;
      positions: OpenPositionCard[];
      settled: SettledPositionCard[];
    }
  | { status: "unavailable" }
  | { status: "error" };

type SettledState = Exclude<AccountSummaryState, { status: "loading" }>;

/**
 * Fallback polling interval for the live pages. The main trigger is a price tick
 * (see useLiveAccountSummary); this slower poll only catches changes that no tick
 * announces (deposit, a position closed elsewhere, margin changes).
 */
export const ACCOUNT_SUMMARY_FALLBACK_REFRESH_MS = 15000;

/** Triggered refreshes never start closer together than this. */
const MIN_TRIGGERED_GAP_MS = 1000;

type UseAccountSummaryOptions = {
  /** Poll every N ms while the tab is visible. 0 (default) = fetch once. */
  refreshMs?: number;
};

type Result = {
  mode: AccountMode;
  state: SettledState;
  updatedAt: number | null;
  isStale: boolean;
};

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

function waitUntilVisible(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (document.visibilityState === "visible") {
      resolve();
      return;
    }

    const done = () => {
      document.removeEventListener("visibilitychange", onChange);
      resolve();
    };
    const onChange = () => {
      if (document.visibilityState === "visible") {
        done();
      }
    };

    document.addEventListener("visibilitychange", onChange);
    signal.addEventListener("abort", done, { once: true });
  });
}

/**
 * Loads the Beranda account card (and the open/settled positions that ride on
 * the same payload) from the BFF (/api/client-area/account-summary). The SGB
 * token never reaches the browser — this only sees the mapped fields; every
 * figure is SGB's own, nothing is computed here.
 *
 * With `refreshMs` it re-fetches on that interval (SGB has no push channel for
 * account figures), and `refreshNow()` wakes it for an immediate fetch (used by
 * price ticks). One request at a time; it pauses while the tab is hidden. A
 * refresh never flips the UI back to "loading"; if one fails the last good data
 * stays on screen and `isStale` is true. `loading` is derived (a result only
 * counts for the mode it was fetched for), so switching Demo/Real shows loading.
 */
export function useAccountSummary(
  mode: AccountMode,
  { refreshMs = 0 }: UseAccountSummaryOptions = {},
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const refreshNowRef = useRef<() => void>(() => {});

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    // `wake` ends the current wait early; `pending` remembers a trigger that
    // arrived while a request was in flight.
    let wake: (() => void) | null = null;
    let pending = false;

    refreshNowRef.current = () => {
      pending = true;
      wake?.();
    };

    /** Returns true when polling should stop (nothing more to learn). */
    async function fetchOnce(): Promise<boolean> {
      let next: SettledState = { status: "error" };

      try {
        const response = await fetch(
          `/api/client-area/account-summary?mode=${mode}`,
          {
            cache: "no-store",
            headers: { Accept: "application/json" },
            signal,
          },
        );

        if (response.status === 401) {
          // Session gone — a reload lets the client-area layout redirect to login.
          window.location.reload();
          return true;
        }

        if (response.status === 404) {
          next = { status: "unavailable" };
        } else if (response.ok) {
          const payload = (await response.json()) as {
            account?: AccountSummaryCard;
            positions?: OpenPositionCard[];
            settled?: SettledPositionCard[];
          };

          if (payload.account) {
            next = {
              status: "ready",
              account: payload.account,
              positions: payload.positions ?? [],
              settled: payload.settled ?? [],
            };
          }
        }
      } catch {
        if (signal.aborted) {
          return true;
        }
      }

      if (signal.aborted) {
        return true;
      }

      setResult((previous) => {
        // A failed refresh keeps the last good data and only marks it stale.
        if (
          next.status === "error" &&
          previous?.mode === mode &&
          previous.state.status === "ready"
        ) {
          return { ...previous, isStale: true };
        }

        return {
          mode,
          state: next,
          updatedAt: next.status === "ready" ? Date.now() : null,
          isStale: false,
        };
      });

      return next.status === "unavailable";
    }

    /** Waits `ms`, but ends early when `refreshNow()` is called. */
    function waitOrWake(ms: number) {
      return new Promise<void>((resolve) => {
        const done = () => {
          window.clearTimeout(timer);
          wake = null;
          resolve();
        };
        const timer = window.setTimeout(done, ms);

        wake = done;
        signal.addEventListener("abort", done, { once: true });
      });
    }

    async function run() {
      do {
        await waitUntilVisible(signal);

        const startedAt = Date.now();

        pending = false;

        if (signal.aborted || (await fetchOnce())) {
          return;
        }

        if (pending) {
          // A tick arrived during the request: fetch again, but not faster than
          // the minimum gap.
          await sleep(
            Math.max(0, MIN_TRIGGERED_GAP_MS - (Date.now() - startedAt)),
            signal,
          );
          continue;
        }

        if (refreshMs > 0) {
          // Wait what is left of the interval, so a slow request does not
          // stretch the period — unless a trigger wakes it sooner.
          await waitOrWake(Math.max(0, refreshMs - (Date.now() - startedAt)));

          if (pending && !signal.aborted) {
            await sleep(
              Math.max(0, MIN_TRIGGERED_GAP_MS - (Date.now() - startedAt)),
              signal,
            );
          }
        }
      } while (refreshMs > 0 && !signal.aborted);
    }

    void run();

    return () => {
      controller.abort();
      refreshNowRef.current = () => {};
    };
  }, [mode, attempt, refreshMs]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const refreshNow = useCallback(() => refreshNowRef.current(), []);
  const current = result?.mode === mode ? result : null;
  const state: AccountSummaryState = current?.state ?? { status: "loading" };

  return {
    state,
    retry,
    refreshNow,
    updatedAt: current?.updatedAt ?? null,
    isStale: current?.isStale ?? false,
  };
}
