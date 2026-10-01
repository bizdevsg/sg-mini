"use client";

import { useMemo, useState } from "react";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import { getDashboardCopy } from "@/components/organisms/client-area.shared";
import { toPositionItem } from "@/components/organisms/client-area-open-positions";
import { toTradeHistoryItem } from "@/components/organisms/client-area-trade-history";
import { ClientAreaTransactionsPanel } from "@/components/organisms/ClientAreaTransactionsPanel";
import type { BreakingNewsItem } from "@/components/organisms/client-area.types";
import { useAccountSummary } from "@/hooks/useAccountSummary";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import type { AppLocale } from "@/locales";

type ClientAreaTransactionsViewProps = {
  breakingNews?: BreakingNewsItem[];
  locale: AppLocale;
};

export function ClientAreaTransactionsView({
  breakingNews,
  locale,
}: ClientAreaTransactionsViewProps) {
  const copy = getDashboardCopy(locale);
  const { accountMode } = useClientAreaAccountMode();
  // Open positions ride on the account summary payload (same BFF call).
  const { state, retry } = useAccountSummary(accountMode);
  const positions = useMemo(
    () => (state.status === "ready" ? state.positions.map(toPositionItem) : []),
    [state],
  );

  // The page belongs to a mode: switching Demo/Real starts again at page 0.
  const [historyPageState, setHistoryPageState] = useState({
    mode: accountMode,
    page: 0,
  });
  const historyPage =
    historyPageState.mode === accountMode ? historyPageState.page : 0;
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

    return historyState.items.map((card) =>
      toTradeHistoryItem(card, settledById.get(card.id)),
    );
  }, [historyState, state]);

  return (
    <ClientAreaShell
      activeTab="transaction"
      breakingNews={breakingNews}
      locale={locale}
    >
      <ClientAreaTransactionsPanel
        copy={copy}
        hasNextHistory={historyState.status === "ready" && historyState.hasNext}
        historyPage={historyPage}
        historyStatus={historyState.status}
        locale={locale}
        onHistoryPageChange={(page) =>
          setHistoryPageState({ mode: accountMode, page })
        }
        onRetryHistory={retryHistory}
        onRetryPositions={retry}
        positions={positions}
        positionsStatus={state.status}
        transactionHistory={transactionHistory}
      />
    </ClientAreaShell>
  );
}
