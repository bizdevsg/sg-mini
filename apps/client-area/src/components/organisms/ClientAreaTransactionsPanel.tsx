"use client";

import { useState } from "react";

import { ClientAreaTransactionNotice } from "@/components/atoms/ClientAreaTransactionNotice";
import { ClientAreaTransactionEmptyState } from "@/components/molecules/ClientAreaTransactionEmptyState";
import { ClientAreaTransactionPagination } from "@/components/molecules/ClientAreaTransactionPagination";
import { ClientAreaTransactionSummary } from "@/components/molecules/ClientAreaTransactionSummary";
import { ClientAreaTradeHistoryRow } from "@/components/molecules/ClientAreaTradeHistoryRow";
import { ClientAreaTransactionRow } from "@/components/molecules/ClientAreaTransactionRow";
import {
  ClientAreaTransactionsHeader,
  type ClientAreaTransactionTab,
} from "@/components/molecules/ClientAreaTransactionsHeader";
import type {
  DashboardCopy,
  PositionItem,
  TransactionHistoryItem,
} from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

type LoadStatus = "loading" | "ready" | "unavailable" | "error";

type ClientAreaTransactionsPanelProps = {
  copy: DashboardCopy;
  hasNextHistory: boolean;
  historyPage: number;
  historyStatus: LoadStatus;
  locale: AppLocale;
  onHistoryPageChange: (page: number) => void;
  onRetryHistory: () => void;
  onRetryPositions: () => void;
  onShowAllTransactions: () => void;
  positions: PositionItem[];
  positionsStatus: LoadStatus;
  transactionFilter?: string | null;
  transactionHistory: TransactionHistoryItem[];
};

export function ClientAreaTransactionsPanel({
  copy,
  hasNextHistory,
  historyPage,
  historyStatus,
  locale,
  onHistoryPageChange,
  onRetryHistory,
  onRetryPositions,
  onShowAllTransactions,
  positions,
  positionsStatus,
  transactionFilter,
  transactionHistory,
}: ClientAreaTransactionsPanelProps) {
  const [activeTab, setActiveTab] =
    useState<ClientAreaTransactionTab>("open");
  const transactionMessages = getMessages(locale).clientArea.marketTransactions;
  const labels = transactionMessages.panel;

  return (
    <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
      <ClientAreaTransactionsHeader
        activeTab={activeTab}
        allTransactionsLabel={transactionMessages.allTransactionsLabel}
        description={labels.description}
        onShowAllTransactions={onShowAllTransactions}
        onTabChange={setActiveTab}
        tabLabels={labels.tabs}
        title={copy.transactionTitle}
        transactionFilter={transactionFilter}
      />

      <ClientAreaTransactionSummary
        buySellLabel={labels.buySell}
        positions={positions}
        status={positionsStatus}
        totalFloatingLabel={labels.totalFloating}
        totalPositionsLabel={labels.totalPositions}
      />

      <div className="border border-zinc-500/20 p-4 rounded-lg">
        {activeTab === "open" ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {positionsStatus === "ready"
                ? positions.map((item) => (
                  <ClientAreaTransactionRow
                    key={item.id}
                    item={item}
                    locale={locale}
                  />
                ))
                : null}

              {positionsStatus === "ready" && positions.length === 0 ? (
                <ClientAreaTransactionEmptyState
                  actionLabel={
                    transactionFilter
                      ? transactionMessages.allTransactionsLabel
                      : undefined
                  }
                  imageAlt={labels.emptyImageAlt}
                  message={labels.positionsEmpty}
                  onAction={transactionFilter ? onShowAllTransactions : undefined}
                  title={labels.emptyTitle}
                />
              ) : null}
              {positionsStatus === "loading" ? (
                <ClientAreaTransactionNotice>
                  {labels.positionsLoading}
                </ClientAreaTransactionNotice>
              ) : null}
              {positionsStatus === "unavailable" ? (
                <ClientAreaTransactionNotice>
                  {labels.unavailable}
                </ClientAreaTransactionNotice>
              ) : null}
              {positionsStatus === "error" ? (
                <ClientAreaTransactionNotice
                  actionLabel={labels.retry}
                  onAction={onRetryPositions}
                  tone="error"
                >
                  {labels.positionsError}
                </ClientAreaTransactionNotice>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {historyStatus === "loading" ? (
              <ClientAreaTransactionNotice>
                {labels.historyLoading}
              </ClientAreaTransactionNotice>
            ) : null}
            {historyStatus === "unavailable" ? (
              <ClientAreaTransactionNotice>
                {labels.unavailable}
              </ClientAreaTransactionNotice>
            ) : null}
            {historyStatus === "error" ? (
              <ClientAreaTransactionNotice
                actionLabel={labels.retry}
                onAction={onRetryHistory}
                tone="error"
              >
                {labels.historyError}
              </ClientAreaTransactionNotice>
            ) : null}

            {historyStatus === "ready"
              ? transactionHistory.map((item) => (
                <ClientAreaTradeHistoryRow
                  key={item.id}
                  item={item}
                  locale={locale}
                />
              ))
              : null}

            {historyStatus === "ready" && transactionHistory.length === 0 ? (
              <ClientAreaTransactionNotice>
                {labels.historyEmpty}
              </ClientAreaTransactionNotice>
            ) : null}

            <ClientAreaTransactionPagination
              hasNextPage={hasNextHistory}
              nextLabel={labels.next}
              onPageChange={onHistoryPageChange}
              page={historyPage}
              pageLabel={labels.page}
              previousLabel={labels.previous}
            />
          </div>
        )}
      </div>
    </div>
  );
}
