"use client";

import { useEffect, useRef } from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import {
  ACCOUNT_SUMMARY_FALLBACK_REFRESH_MS,
  useAccountSummary,
} from "@/hooks/useAccountSummary";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";

/**
 * The account summary kept live WITHOUT a fast timer: it is re-fetched when the
 * live price feed ticks for a product the customer holds, plus a slow fallback
 * poll for changes no tick announces (deposits, positions closed elsewhere).
 *
 * Every figure still comes from SGB's /etrade/accountsummary — the tick is only
 * the trigger, nothing is computed from prices here, so the numbers are
 * identical to what a plain refresh would show.
 */
export function useLiveAccountSummary(mode: AccountMode) {
  const summary = useAccountSummary(mode, {
    refreshMs: ACCOUNT_SUMMARY_FALLBACK_REFRESH_MS,
  });
  const { quotes } = useLiveQuoteStream();
  const { refreshNow } = summary;

  // Fingerprint of the latest ticks of the products held in open positions.
  const heldProducts =
    summary.state.status === "ready"
      ? [...new Set(summary.state.positions.map((item) => item.productName))]
      : [];
  const tickFingerprint = heldProducts
    .map((symbol) => {
      const tick = quotes[symbol];

      return tick
        ? `${symbol}:${tick.buy}:${tick.sell}:${tick.date_time}`
        : symbol;
    })
    .join("|");
  const previousFingerprint = useRef<string | null>(null);

  useEffect(() => {
    const previous = previousFingerprint.current;

    previousFingerprint.current = tickFingerprint;

    // Skip the first value (just loaded) and "nothing held" — only a CHANGE in
    // the ticks of products already held is a reason to refresh.
    if (previous && previous !== tickFingerprint && tickFingerprint !== "") {
      refreshNow();
    }
  }, [tickFingerprint, refreshNow]);

  return summary;
}
