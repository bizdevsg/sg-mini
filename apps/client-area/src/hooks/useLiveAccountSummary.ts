"use client";

import { useCallback } from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import type { AccountSummaryState } from "@/hooks/useAccountSummary";
import { retrySaiStream, useSaiStream } from "@/hooks/useSaiStream";

export function useLiveAccountSummary(mode: AccountMode) {
  const { account, status } = useSaiStream(mode);
  const retry = useCallback(() => retrySaiStream(mode), [mode]);
  const state: AccountSummaryState = account
    ? { status: "ready", account, positions: [], settled: [] }
    : { status: status === "connecting" ? "loading" : "error" };
  return { state, retry };
}
