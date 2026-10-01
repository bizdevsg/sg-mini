"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * "unavailable" covers both a customer whose registration is not finished
 * (HTTP 409 — SGB has no profile data to give) and a profile that could be
 * fetched but is not mapped to display fields yet. Either way there is nothing
 * trustworthy to render, so the page shows "—" instead of invented values.
 */
export type CustomerProfileState =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "error" };

type SettledState = Exclude<CustomerProfileState, { status: "loading" }>;

export function useCustomerProfile() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; state: SettledState } | null>(
    null,
  );

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      let state: SettledState = { status: "error" };

      try {
        const response = await fetch("/api/client-area/profile", {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (response.status === 401) {
          // Session gone — a reload lets the client-area layout redirect to login.
          window.location.reload();
          return;
        }

        if (response.ok || response.status === 409 || response.status === 404) {
          state = { status: "unavailable" };
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }
      }

      setResult({ attempt, state });
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);
  const state: CustomerProfileState =
    result?.attempt === attempt ? result.state : { status: "loading" };

  return { state, retry };
}
