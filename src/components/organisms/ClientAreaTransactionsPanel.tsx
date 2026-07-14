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
  locale: AppLocale;
  positions: PositionItem[];
  transactionHistory: TransactionHistoryItem[];
};

export function ClientAreaTransactionsPanel({
  copy,
  locale,
  positions,
  transactionHistory,
}: ClientAreaTransactionsPanelProps) {
  const [activeTab, setActiveTab] = useState<"open" | "history">("open");
  const openBuyCount = positions.filter((item) => item.side === "buy").length;
  const openSellCount = positions.length - openBuyCount;
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
      };

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
      <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-yellow-500 sm:text-xl">
        <BadgeDollarSign />
        {copy.transactionTitle}
      </h2>

      <div className="flex gap-3">
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
          {positions.map((item) => (
            <ClientAreaTransactionRow
              key={item.id}
              item={item}
              locale={locale}
            />
          ))}
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

          {transactionHistory.length > 0 ? (
            <div className="space-y-3">
              {transactionHistory.map((item) => (
                <ClientAreaTradeHistoryRow key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
              {labels.historyEmpty}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
