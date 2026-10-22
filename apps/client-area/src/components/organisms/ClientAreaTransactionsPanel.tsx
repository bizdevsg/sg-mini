"use client";

import { useState, type ReactNode } from "react";
import { BadgeDollarSign, ChevronLeft, ChevronRight } from "lucide-react";

import { ClientAreaTradeHistoryRow } from "@/components/molecules/ClientAreaTradeHistoryRow";
import { ClientAreaTransactionRow } from "@/components/molecules/ClientAreaTransactionRow";
import { formatSignedUsd } from "@/components/organisms/client-area.shared";
import type {
  DashboardCopy,
  PositionItem,
  TransactionHistoryItem,
} from "@/components/organisms/client-area.types";
import type { AppLocale } from "@/locales";

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
  positions: PositionItem[];
  positionsStatus: LoadStatus;
  transactionFilter?: string | null;
  transactionHistory: TransactionHistoryItem[];
};

type Tab = "open" | "history";

const LABELS = {
  id: {
    tabs: { open: "Open Position", history: "Trade History" },
    totalPositions: "Total Posisi",
    buySell: "Buy / Sell",
    totalFloating: "Total Floating P/L",
    historyEmpty: "Belum ada riwayat transaksi untuk akun ini.",
    historyLoading: "Memuat riwayat...",
    historyError: "Riwayat belum bisa dimuat.",
    previous: "Sebelumnya",
    next: "Berikutnya",
    page: "Halaman",
    positionsLoading: "Memuat posisi...",
    positionsEmpty: "Belum ada posisi terbuka untuk akun ini.",
    unavailable: "Akun untuk mode ini tidak tersedia.",
    positionsError: "Posisi belum bisa dimuat.",
    retry: "Coba lagi",
  },
  en: {
    tabs: { open: "Open Position", history: "Trade History" },
    totalPositions: "Open Positions",
    buySell: "Buy / Sell",
    totalFloating: "Total Floating P/L",
    historyEmpty: "There is no trade history for this account yet.",
    historyLoading: "Loading history...",
    historyError: "History could not be loaded.",
    previous: "Previous",
    next: "Next",
    page: "Page",
    positionsLoading: "Loading positions...",
    positionsEmpty: "There are no open positions for this account.",
    unavailable: "No account is available for this mode.",
    positionsError: "Positions could not be loaded.",
    retry: "Try again",
  },
} as const;

function StatTile({
  label,
  value,
  valueClassName = "text-white",
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-black tabular-nums sm:text-2xl ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-6 text-center text-sm text-zinc-400">
      {children}
    </div>
  );
}

function ErrorNote({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-4 text-sm text-red-300">
      <span>{message}</span>
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/15"
      >
        {retryLabel}
      </button>
    </div>
  );
}

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
  transactionFilter,
  transactionHistory,
}: ClientAreaTransactionsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("open");
  const labels = LABELS[locale];

  const buyCount = positions.filter((item) => item.side === "buy").length;
  const sellCount = positions.length - buyCount;
  const floatingValues = positions
    .map((item) => item.floatingValue)
    .filter((value): value is number => typeof value === "number");
  const totalFloating =
    floatingValues.length > 0
      ? floatingValues.reduce((sum, value) => sum + value, 0)
      : null;
  const totalFloatingClassName =
    totalFloating === null || totalFloating === 0
      ? "text-white"
      : totalFloating > 0
        ? "text-emerald-400"
        : "text-rose-400";

  return (
    <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-yellow-500 sm:text-xl">
          <BadgeDollarSign />
          {copy.transactionTitle}
          {transactionFilter ? (
            <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-yellow-300">
              {transactionFilter.replace(/_BBJ$/, "")}
            </span>
          ) : null}
        </h2>

        <div
          role="tablist"
          className="inline-flex w-full rounded-full border border-white/10 bg-black/40 p-1 sm:w-auto"
        >
          {(["open", "history"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`min-h-10 flex-1 cursor-pointer px-5 text-sm font-semibold transition-all sm:flex-none ${tab === "open" ? "rounded-l-full" : "rounded-r-full"} ${activeTab === tab
                ? "bg-yellow-500 text-black shadow-[0_8px_20px_rgba(234,179,8,0.25)]"
                : "text-zinc-300 hover:text-white"
                }`}
            >
              {labels.tabs[tab]}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "open" ? (
        <div className="space-y-4">
          {positionsStatus === "ready" && positions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatTile label={labels.totalPositions} value={positions.length} />
              <StatTile
                label={labels.buySell}
                value={
                  <>
                    <span className="text-emerald-400">{buyCount}</span>
                    <span className="text-zinc-600"> / </span>
                    <span className="text-amber-400">{sellCount}</span>
                  </>
                }
              />
              <StatTile
                label={labels.totalFloating}
                value={totalFloating === null ? "—" : formatSignedUsd(totalFloating)}
                valueClassName={totalFloatingClassName}
              />
            </div>
          ) : null}

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
              <Note>{labels.positionsEmpty}</Note>
            ) : null}
            {positionsStatus === "loading" ? (
              <Note>{labels.positionsLoading}</Note>
            ) : null}
            {positionsStatus === "unavailable" ? (
              <Note>{labels.unavailable}</Note>
            ) : null}
            {positionsStatus === "error" ? (
              <ErrorNote
                message={labels.positionsError}
                retryLabel={labels.retry}
                onRetry={onRetryPositions}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {historyStatus === "loading" ? <Note>{labels.historyLoading}</Note> : null}
          {historyStatus === "unavailable" ? <Note>{labels.unavailable}</Note> : null}
          {historyStatus === "error" ? (
            <ErrorNote
              message={labels.historyError}
              retryLabel={labels.retry}
              onRetry={onRetryHistory}
            />
          ) : null}

          {historyStatus === "ready"
            ? transactionHistory.map((item) => (
              <ClientAreaTradeHistoryRow key={item.id} item={item} />
            ))
            : null}

          {historyStatus === "ready" && transactionHistory.length === 0 ? (
            <Note>{labels.historyEmpty}</Note>
          ) : null}

          {historyPage > 0 || hasNextHistory ? (
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={historyPage === 0}
                onClick={() => onHistoryPageChange(historyPage - 1)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/50 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                {labels.previous}
              </button>
              <span className="text-sm text-zinc-400">
                {labels.page} {historyPage + 1}
              </span>
              <button
                type="button"
                disabled={!hasNextHistory}
                onClick={() => onHistoryPageChange(historyPage + 1)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/50 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.next}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
