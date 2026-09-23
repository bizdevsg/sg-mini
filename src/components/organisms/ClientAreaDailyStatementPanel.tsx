"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaDailyStatementPanelProps = {
  locale: AppLocale;
};

type StatementTab = "account" | "open" | "settled";

const ACCOUNT_SUMMARY_ROWS = [
  ["previousBalance", "$ 48,915.00"],
  ["marginMovement", "$ 0.00 / $ 0.00"],
  ["storageRollover", "$ 0.00"],
  ["profitLoss", "$ 3,910.00"],
  ["facilityFee", "$ -195.00"],
  ["vat", "$ -21.45"],
  ["premiumDiscount", "$ 0.00"],
  ["interest", "--"],
  ["adjustment", "--"],
] as const;

const ACCOUNT_BALANCE_ROWS = [
  ["newBalance", "$ 52,608.75"],
  ["floatingPl", "$ 450.00"],
  ["equity", "$ 53,058.75"],
  ["marginRequired", "$ 1,000.00"],
  ["effectiveMargin", "$ 52,608.75"],
  ["equityRate", "$ 1.00000"],
] as const;

function StatementRows({
  labels,
  rows,
}: {
  labels: Record<string, string>;
  rows: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,1fr)]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-sm font-semibold text-zinc-400 sm:text-base">
            {labels[label]}
          </dt>
          <dd className="text-sm font-bold tabular-nums text-zinc-100 sm:text-base">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ClientAreaDailyStatementPanel({
  locale,
}: ClientAreaDailyStatementPanelProps) {
  const { clientArea } = getMessages(locale);
  const copy = clientArea.dailyStatementPage;
  const { accountMode } = useClientAreaAccountMode();
  const { currentAccount } = getClientAreaAccountModeData(
    getDashboardCopy(locale),
    accountMode,
  );
  const [activeTab, setActiveTab] = useState<StatementTab>("account");
  const [isDownloading, setIsDownloading] = useState(false);

  const tabs: Array<{ id: StatementTab; label: string }> = [
    { id: "account", label: copy.tabs.account },
    { id: "open", label: copy.tabs.open },
    { id: "settled", label: copy.tabs.settled },
  ];

  async function downloadStatement() {
    setIsDownloading(true);

    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ format: "a4", unit: "mm" });
      const activeTabLabel =
        tabs.find((tab) => tab.id === activeTab)?.label ?? copy.title;

      pdf.setFillColor(18, 18, 18);
      pdf.rect(0, 0, 210, 34, "F");
      pdf.setTextColor(250, 204, 21);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("PT SOLID GOLD BERJANGKA", 18, 14);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.text(activeTabLabel, 18, 25);

      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(10);
      pdf.text(
        `${copy.labels.accountNumber}: ${currentAccount.accountId}`,
        18,
        48,
      );
      pdf.text(`${copy.labels.aeCode}: BBH`, 18, 56);
      pdf.text(`${copy.labels.date}: 06/07/2026`, 18, 64);

      let y = 82;
      const rows =
        activeTab === "account"
          ? [...ACCOUNT_SUMMARY_ROWS, ...ACCOUNT_BALANCE_ROWS].map(
              ([label, value]) => [copy.labels[label], value],
            )
          : activeTab === "open"
            ? copy.openPositions.map((item) => [
                `${item.symbol} / ${item.side} ${item.volume}`,
                `${item.openPrice} to ${item.marketPrice} / ${item.floatingPl}`,
              ])
            : copy.settledPositions.map((item) => [
                `${item.symbol} / ${item.side} ${item.volume}`,
                `${item.openPrice} to ${item.closePrice} / ${item.profitLoss}`,
              ]);

      for (const [label, value] of rows) {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(82, 82, 91);
        pdf.text(String(label), 18, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(24, 24, 27);
        pdf.text(String(value), 92, y);
        y += 9;

        if (y > 275) {
          pdf.addPage();
          y = 20;
        }
      }

      pdf.save(`daily-statement-${currentAccount.accountId}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <section aria-labelledby="daily-statement-title">
      <Link
        href={resolveLocalizedHref(locale, "/client-area/account")}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-yellow-500/30 hover:text-yellow-400"
      >
        <FontAwesomeIcon icon={["fas", "chevron-left"]} className="text-xs" />
        {clientArea.accountPage.backLabel}
      </Link>

      <h2 id="daily-statement-title" className="sr-only">
        {copy.title}
      </h2>

      <div
        className="grid gap-2 rounded-2xl border border-white/[0.07] bg-black/35 p-1.5 shadow-inner shadow-black/40 sm:grid-cols-3"
        role="tablist"
        aria-label={copy.title}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl border px-4 py-3 text-sm font-bold shadow-sm transition duration-200 sm:text-base ${
                isActive
                  ? "border-yellow-400 bg-yellow-500/10 text-white shadow-yellow-500/10 ring-1 ring-yellow-400/10"
                  : "border-white/10 bg-[#181818]/90 text-zinc-400 shadow-black/30 hover:border-white/20 hover:bg-[#202020] hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-4">
        {activeTab === "account" ? (
          <>
            <div className="rounded-2xl border border-white/15 bg-[#202125] p-5 sm:p-6">
              <StatementRows
                labels={copy.labels}
                rows={[
                  ["accountNumber", currentAccount.accountId],
                  ["aeCode", "BBH"],
                  ["date", "06/07/2026"],
                ]}
              />
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#202125] p-5 sm:p-6">
              <StatementRows labels={copy.labels} rows={ACCOUNT_SUMMARY_ROWS} />
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#202125] p-5 sm:p-6">
              <StatementRows labels={copy.labels} rows={ACCOUNT_BALANCE_ROWS} />
            </div>
          </>
        ) : null}

        {activeTab === "open" ? (
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#202125]">
            {copy.openPositions.map((position) => (
              <article
                key={position.id}
                className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 sm:grid-cols-[1.2fr_repeat(3,1fr)] sm:items-center"
              >
                <div>
                  <p className="font-bold text-white">{position.symbol}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-400">
                    {position.side} / {position.volume}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">
                    {copy.labels.openPrice}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-200">
                    {position.openPrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">
                    {copy.labels.marketPrice}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-200">
                    {position.marketPrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">
                    {copy.labels.floatingPl}
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-400">
                    {position.floatingPl}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === "settled" ? (
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#202125]">
            {copy.settledPositions.map((position) => (
              <article
                key={position.id}
                className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 sm:grid-cols-[1.2fr_repeat(3,1fr)] sm:items-center"
              >
                <div>
                  <p className="font-bold text-white">{position.symbol}</p>
                  <p className="mt-1 text-xs font-semibold text-zinc-400">
                    {position.side} / {position.volume}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">
                    {copy.labels.openPrice}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-200">
                    {position.openPrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">
                    {copy.labels.closePrice}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-200">
                    {position.closePrice}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">
                    {copy.labels.profitLoss}
                  </p>
                  <p className="mt-1 text-sm font-bold text-emerald-400">
                    {position.profitLoss}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        disabled={isDownloading}
        onClick={downloadStatement}
        className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-80 sm:text-base"
      >
        <FontAwesomeIcon
          icon={["fas", isDownloading ? "spinner" : "file-arrow-down"]}
          className={isDownloading ? "animate-spin" : "text-lg"}
        />
        {isDownloading ? copy.preparingLabel : copy.downloadLabel}
      </button>
    </section>
  );
}
