"use client";

import { useCallback, useEffect, useState } from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import type { DailyStatementReport } from "@/types/daily-statement";

export type DailyStatementState =
  | { status: "loading" }
  | { status: "ready"; report: DailyStatementReport }
  | { status: "unavailable" }
  | { status: "error" };

type SettledState = Exclude<DailyStatementState, { status: "loading" }>;

/**
 * Loads the closing daily statement from the BFF. `loading` is derived — a
 * result only counts for the mode/attempt it was fetched for — so switching
 * Demo/Real shows the loading state without a setState in the effect body.
 */
export function useDailyStatement(mode: AccountMode) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; state: SettledState } | null>(
    null,
  );
  const requestKey = `${mode}:${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      let state: SettledState = { status: "error" };

      try {
        const response = await fetch(
          `/api/client-area/daily-statement?mode=${mode}`,
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
            report?: DailyStatementReport;
          };

          if (payload.report) {
            state = { status: "ready", report: payload.report };
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
  }, [mode, requestKey]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const state: DailyStatementState =
    result?.key === requestKey ? result.state : { status: "loading" };

  return { state, retry };
}
