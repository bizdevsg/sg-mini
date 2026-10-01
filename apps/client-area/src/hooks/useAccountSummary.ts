"use client";

import { useCallback, useEffect, useState } from "react";

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
 * Loads the Beranda account card from the BFF (/api/client-area/account-summary).
 * The SGB token never reaches the browser — this only sees the mapped fields.
 * `loading` is derived (a result only counts for the mode/attempt it was fetched
 * for), so switching Demo/Real shows the loading state without a setState in the
 * effect body.
 */
export function useAccountSummary(mode: AccountMode) {
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
          `/api/client-area/account-summary?mode=${mode}`,
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
            account?: AccountSummaryCard;
            positions?: OpenPositionCard[];
            settled?: SettledPositionCard[];
          };

          if (payload.account) {
            state = {
              status: "ready",
              account: payload.account,
              positions: payload.positions ?? [],
              settled: payload.settled ?? [],
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
  }, [mode, requestKey]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const state: AccountSummaryState =
    result?.key === requestKey ? result.state : { status: "loading" };

  return { state, retry };
}
