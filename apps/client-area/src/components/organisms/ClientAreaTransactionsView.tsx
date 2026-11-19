"use client";

import { useMemo, useState } from "react";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import { toPositionItem } from "@/components/organisms/client-area-open-positions";
import { toTradeHistoryItem } from "@/components/organisms/client-area-trade-history";
import { ClientAreaTransactionsPanel } from "@/components/organisms/ClientAreaTransactionsPanel";
import { useLiveAccountSummary } from "@/hooks/useLiveAccountSummary";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import type { AppLocale } from "@/locales";

type ClientAreaTransactionsViewProps = {
  filterSymbol?: string | null;
  locale: AppLocale;
  onShowAllTransactions: () => void;
};

function normalizeTransactionSymbol(value: string) {
  return value.trim().toUpperCase().replace(/_BBJ$/, "");
}

export function ClientAreaTransactionsView({
  filterSymbol = null,
  locale,
  onShowAllTransactions,
}: ClientAreaTransactionsViewProps) {
  const copy = getDashboardCopy(locale);
  const { accountMode } = useClientAreaAccountMode();
  // Open positions ride on the account summary payload (same BFF call).
  const { state, retry } = useLiveAccountSummary(accountMode);
  const allPositions = useMemo(
    () =>
      state.status === "ready"
        ? state.positions.map((position) => toPositionItem(position, locale))
        : [],
    [locale, state],
  );
  const normalizedFilter = filterSymbol
    ? normalizeTransactionSymbol(filterSymbol)
    : null;
  const positions = useMemo(
    () =>
      normalizedFilter
        ? allPositions.filter(
            (item) =>
              normalizeTransactionSymbol(item.symbol) === normalizedFilter,
          )
        : allPositions,
    [allPositions, normalizedFilter],
  );

  // Switching Demo/Real or instrument filter starts again at page 0.
  const [historyPageState, setHistoryPageState] = useState({
    filter: normalizedFilter,
    mode: accountMode,
    page: 0,
  });
  const historyPage =
    historyPageState.mode === accountMode &&
    historyPageState.filter === normalizedFilter
      ? historyPageState.page
      : 0;
  const { state: historyState, retry: retryHistory } = useTradeHistory(
    accountMode,
    historyPage,
  );
  // A liquidation row gets its real P/L, fee and VAT from the summary's settled
  // positions (same id); other rows and unmatched ids keep "-".
  const transactionHistory = useMemo(() => {
    if (historyState.status !== "ready") {
      return [];
    }

    const settledById = new Map(
      (state.status === "ready" ? state.settled : []).map((item) => [
        item.id,
        item,
      ]),
    );

    const items = historyState.items.map((card) =>
      toTradeHistoryItem(card, settledById.get(card.id), locale),
    );

    return normalizedFilter
      ? items.filter(
          (item) =>
            normalizeTransactionSymbol(item.symbol) === normalizedFilter,
        )
      : items;
  }, [historyState, locale, normalizedFilter, state]);

  return (
    <div id="transactions" className="scroll-mt-24">
      <ClientAreaTransactionsPanel
        copy={copy}
        hasNextHistory={historyState.status === "ready" && historyState.hasNext}
        historyPage={historyPage}
        historyStatus={historyState.status}
        locale={locale}
        onHistoryPageChange={(page) =>
          setHistoryPageState({
            filter: normalizedFilter,
            mode: accountMode,
            page,
          })
        }
        onRetryHistory={retryHistory}
        onRetryPositions={retry}
        onShowAllTransactions={onShowAllTransactions}
        positions={positions}
        positionsStatus={state.status}
        transactionFilter={filterSymbol}
        transactionHistory={transactionHistory}
      />
    </div>
  );
}
