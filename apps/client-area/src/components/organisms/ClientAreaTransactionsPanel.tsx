"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaTradeHistoryRow } from "@/components/molecules/ClientAreaTradeHistoryRow";
import { ClientAreaTransactionRow } from "@/components/molecules/ClientAreaTransactionRow";
import type {
  DashboardCopy,
  PositionItem,
  TransactionHistoryItem,
} from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";
import { BadgeDollarSign } from "lucide-react";

type ClientAreaTransactionsPanelProps = {
  copy: DashboardCopy;
  hasNextHistory: boolean;
  historyPage: number;
  historyStatus: "loading" | "ready" | "unavailable" | "error";
  locale: AppLocale;
  onHistoryPageChange: (page: number) => void;
  onRetryHistory: () => void;
  onRetryPositions: () => void;
  positions: PositionItem[];
  positionsStatus: "loading" | "ready" | "unavailable" | "error";
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
  positions,
  positionsStatus,
  transactionHistory,
}: ClientAreaTransactionsPanelProps) {
  const [activeTab, setActiveTab] = useState<"open" | "history">("open");
  const labels =
    locale === "id"
      ? {
        tabs: {
          open: "Open Position",
          history: "Trade History",
        },
        total: "Total Posisi",
        buy: "Buy",
        sell: "Sell",
        historyTitle: "Riwayat Trading",
        historyEmpty: "Belum ada riwayat transaksi untuk akun ini.",
        historyLoading: "Memuat riwayat...",
        historyError: "Riwayat belum bisa dimuat.",
        previous: "Sebelumnya",
        next: "Berikutnya",
        page: "Halaman",
        positionsLoading: "Memuat posisi...",
        positionsEmpty: "Belum ada posisi terbuka untuk akun ini.",
        positionsUnavailable: "Akun untuk mode ini tidak tersedia.",
        positionsError: "Posisi belum bisa dimuat.",
        retry: "Coba lagi",
      }
      : {
        tabs: {
          open: "Open Position",
          history: "Trade History",
        },
        total: "Open Positions",
        buy: "Buy",
        sell: "Sell",
        historyTitle: "Trade History",
        historyEmpty: "There is no trade history for this account yet.",
        historyLoading: "Loading history...",
        historyError: "History could not be loaded.",
        previous: "Previous",
        next: "Next",
        page: "Page",
        positionsLoading: "Loading positions...",
        positionsEmpty: "There are no open positions for this account.",
        positionsUnavailable: "No account is available for this mode.",
        positionsError: "Positions could not be loaded.",
        retry: "Try again",
      };

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
      <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-yellow-500 sm:text-xl">
        <BadgeDollarSign />
        {copy.transactionTitle}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveTab("open")}
          aria-pressed={activeTab === "open"}
          className={`inline-flex w-full min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-all cursor-pointer ${activeTab === "open"
            ? "bg-yellow-500 text-black shadow-[0_10px_24px_rgba(234,179,8,0.28)]"
            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
        >
          {labels.tabs.open}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          aria-pressed={activeTab === "history"}
          className={`inline-flex w-full min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-all cursor-pointer ${activeTab === "history"
            ? "bg-yellow-500 text-black shadow-[0_10px_24px_rgba(234,179,8,0.28)]"
            : "border border-yellow-500/30 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
        >
          {labels.tabs.history}
        </button>
      </div>

      {activeTab === "open" ? (
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
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
              {labels.positionsEmpty}
            </div>
          ) : null}

          {positionsStatus === "loading" ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
              {labels.positionsLoading}
            </div>
          ) : null}

          {positionsStatus === "unavailable" ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
              {labels.positionsUnavailable}
            </div>
          ) : null}

          {positionsStatus === "error" ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-4 text-sm text-red-300">
              <span>{labels.positionsError}</span>
              <button
                type="button"
                onClick={onRetryPositions}
                className="cursor-pointer rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/15"
              >
                {labels.retry}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold text-zinc-100">
            <FontAwesomeIcon
              icon={["fas", "clock-rotate-left"]}
              className="text-yellow-500"
            />
            <h3>{labels.historyTitle}</h3>
          </div>

          {historyStatus === "loading" ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
              {labels.historyLoading}
            </div>
          ) : null}

          {historyStatus === "unavailable" ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
              {labels.positionsUnavailable}
            </div>
          ) : null}

          {historyStatus === "error" ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-4 text-sm text-red-300">
              <span>{labels.historyError}</span>
              <button
                type="button"
                onClick={onRetryHistory}
                className="cursor-pointer rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/15"
              >
                {labels.retry}
              </button>
            </div>
          ) : null}

          {historyStatus === "ready" && transactionHistory.length > 0 ? (
            <div className="space-y-3">
              {transactionHistory.map((item) => (
                <ClientAreaTradeHistoryRow key={item.id} item={item} />
              ))}
            </div>
          ) : null}

          {historyStatus === "ready" && transactionHistory.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
              {labels.historyEmpty}
            </div>
          ) : null}

          {historyPage > 0 || hasNextHistory ? (
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                disabled={historyPage === 0}
                onClick={() => onHistoryPageChange(historyPage - 1)}
                className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/50 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.previous}
              </button>
              <span className="text-sm text-zinc-400">
                {labels.page} {historyPage + 1}
              </span>
              <button
                type="button"
                disabled={!hasNextHistory}
                onClick={() => onHistoryPageChange(historyPage + 1)}
                className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/50 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.next}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
