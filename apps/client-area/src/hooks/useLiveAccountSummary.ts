"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { AccountMode } from "@/components/organisms/client-area.types";
import {
  ACCOUNT_SUMMARY_FALLBACK_REFRESH_MS,
  useAccountSummary,
  type AccountSummaryState,
} from "@/hooks/useAccountSummary";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import type { LiveQuotePayload } from "@/lib/live-quotes";
import type { OpenPositionCard } from "@/types/account-summary";

type ReadyState = Extract<AccountSummaryState, { status: "ready" }>;

/** How often the live price estimate on screen is allowed to move. */
const LIVE_DISPLAY_REFRESH_MS = 15000;

/** Closing-side price of the held products at the moment a snapshot arrived. */
type Baseline = {
  state: ReadyState;
  prices: Record<string, number>;
};

/**
 * A long position closes at the bid (`tick.sell`), a short one at the ask
 * (`tick.buy`) — the same side SGB reports as `closingPrice`.
 */
function closingPrice(
  quotes: LiveQuotePayload,
  position: OpenPositionCard,
): number | null {
  const tick = quotes[position.productName];
  const raw = position.side === "buy" ? tick?.sell : tick?.buy;
  const parsed = Number(raw);

  return raw !== undefined && Number.isFinite(parsed) ? parsed : null;
}

function snapshotPrices(quotes: LiveQuotePayload, state: ReadyState) {
  const prices: Record<string, number> = {};

  for (const position of state.positions) {
    const price = closingPrice(quotes, position);

    if (price !== null) {
      prices[position.id] = price;
    }
  }

  return prices;
}

/**
 * Moves the snapshot's open positions (and the account figures that depend on
 * floating P/L) by how far the live closing price has moved since the snapshot.
 * The P/L per 1.0 of price is read from the snapshot itself
 * (profitLoss / price move), so no contract size is assumed. Positions where
 * that cannot be derived (no price move yet) keep SGB's own figure.
 */
function applyLivePrices(
  baseline: Baseline,
  quotes: LiveQuotePayload,
): ReadyState {
  const { state } = baseline;
  let floatingShift = 0;
  let anyPositionMoved = false;

  const positions = state.positions.map((position) => {
    const sign = position.side === "buy" ? 1 : -1;
    const { currentPrice, openPrice, profitLoss } = position;
    const before = baseline.prices[position.id];
    const now = closingPrice(quotes, position);

    if (
      currentPrice === null ||
      openPrice === null ||
      profitLoss === null ||
      before === undefined ||
      now === null ||
      Math.abs(currentPrice - openPrice) < 1e-9
    ) {
      return position;
    }

    const plPerPoint = profitLoss / ((currentPrice - openPrice) * sign);
    const move = now - before;
    const shift = plPerPoint * move * sign;

    if (!Number.isFinite(shift) || move === 0) {
      return position;
    }

    floatingShift += shift;
    anyPositionMoved = true;

    return {
      ...position,
      currentPrice: currentPrice + move,
      profitLoss: profitLoss + shift,
    };
  });

  // Offsetting positions (a hedge) can move individually while the total stays
  // put, so only "nothing moved at all" may return the untouched snapshot.
  if (!anyPositionMoved) {
    return state;
  }

  const { account } = state;
  const shifted = (value: number | null) =>
    value === null ? null : value + floatingShift;

  return {
    ...state,
    positions,
    account: {
      ...account,
      floatingPl: shifted(account.floatingPl),
      equity: shifted(account.equity),
      // edtm = equity − dtm, so it moves with equity.
      effectiveMargin: shifted(account.effectiveMargin),
    },
  };
}

/**
 * The account summary kept live WITHOUT hammering the server: SGB's
 * /etrade/accountsummary is fetched on a slow poll (the official figures), and
 * between fetches the live price feed (already open in the browser) moves the
 * positions' closing price and floating P/L, so the screen updates every tick.
 * Each new snapshot replaces the estimate with SGB's own numbers.
 */
export function useLiveAccountSummary(
  mode: AccountMode,
  { refreshMs = ACCOUNT_SUMMARY_FALLBACK_REFRESH_MS }: { refreshMs?: number } = {},
) {
  const summary = useAccountSummary(mode, { refreshMs });
  const { quotes } = useLiveQuoteStream();
  const quotesRef = useRef(quotes);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [displayQuotes, setDisplayQuotes] = useState(quotes);
  const { state } = summary;

  useEffect(() => {
    quotesRef.current = quotes;
  }, [quotes]);

  // The feed ticks many times a second; the screen only follows it this often.
  useEffect(() => {
    const timer = window.setInterval(
      () => setDisplayQuotes(quotesRef.current),
      LIVE_DISPLAY_REFRESH_MS,
    );

    return () => window.clearInterval(timer);
  }, []);

  // A new snapshot arrived: remember where the prices were at that moment.
  useEffect(() => {
    // Temporary dev diagnostics: do position product names match the quote keys?
    if (process.env.NODE_ENV !== "production") {
      console.info("[live-summary]", {
        status: state.status,
        positions:
          state.status === "ready"
            ? state.positions.map((position) => ({
                product: position.productName,
                side: position.side,
                liveClose: closingPrice(quotesRef.current, position),
              }))
            : [],
        quoteKeys: Object.keys(quotesRef.current),
      });
    }

    if (state.status !== "ready") {
      setBaseline(null);
      return;
    }

    setBaseline({ state, prices: snapshotPrices(quotesRef.current, state) });
    // Keep the displayed quotes in step with the baseline so a fresh snapshot
    // does not show a move measured against older prices.
    setDisplayQuotes(quotesRef.current);
  }, [state]);

  const liveState = useMemo<AccountSummaryState>(() => {
    if (state.status !== "ready" || baseline?.state !== state) {
      return state;
    }

    return applyLivePrices(baseline, displayQuotes);
  }, [state, baseline, displayQuotes]);

  return { ...summary, state: liveState };
}
