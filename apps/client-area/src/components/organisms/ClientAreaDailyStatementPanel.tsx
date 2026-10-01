"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import {
  formatSignedUsd,
  formatUsd,
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import { formatPrice } from "@/components/organisms/client-area-open-positions";
import { useDailyStatement } from "@/hooks/useDailyStatement";
import { getMessages, type AppLocale } from "@/locales";
import type { DailyStatementReport } from "@/types/daily-statement";

type ClientAreaDailyStatementPanelProps = {
  locale: AppLocale;
};

type StatementTab = "account" | "open" | "settled";

type StatementRow = readonly [string, string];

const EMPTY = "—";

const MESSAGES = {
  id: {
    loading: "Memuat statement...",
    error: "Statement belum bisa dimuat.",
    retry: "Coba lagi",
    unavailable: "Akun untuk mode ini tidak tersedia.",
    openEmpty: "Tidak ada posisi terbuka pada statement ini.",
    openAsOf: (date: string) =>
      `Posisi terbuka pada penutupan statement tanggal ${date}, bukan kondisi saat ini. Posisi yang berjalan sekarang bisa berbeda (mis. sudah ditutup setelahnya).`,
    openLiveLink: "Lihat posisi saat ini di Transaksi",
    settledEmpty: "Tidak ada posisi yang ditutup pada statement ini.",
    settledUnmapped: "Data posisi yang ditutup belum dapat ditampilkan.",
  },
  en: {
    loading: "Loading statement...",
    error: "The statement could not be loaded.",
    retry: "Try again",
    unavailable: "No account is available for this mode.",
    openEmpty: "There are no open positions on this statement.",
    openAsOf: (date: string) =>
      `Positions open at the close of the statement dated ${date}, not the current state. Positions running now may differ (e.g. closed since).`,
    openLiveLink: "See current positions in Transaction",
    settledEmpty: "There are no settled positions on this statement.",
    settledUnmapped: "Settled position data cannot be displayed yet.",
  },
} as const;

function money(value: number | null) {
  return value === null ? EMPTY : formatUsd(value);
}

// The statement rows, all from the API. Nothing is invented: a value the API
// did not send is "—".
function buildSummaryRows(report: DailyStatementReport | null): StatementRow[] {
  return [
    ["previousBalance", money(report?.previousBalance ?? null)],
    [
      "marginMovement",
      report && (report.marginIn !== null || report.marginOut !== null)
        ? `${money(report.marginIn)} / ${money(report.marginOut)}`
        : EMPTY,
    ],
    ["storageRollover", money(report?.storage ?? null)],
    ["profitLoss", money(report?.profitLoss ?? null)],
    ["facilityFee", money(report?.commissionFee ?? null)],
    ["vat", money(report?.vat ?? null)],
    ["premiumDiscount", money(report?.discount ?? null)],
    ["interest", money(report?.interest ?? null)],
    ["adjustment", money(report?.adjustment ?? null)],
  ];
}

function buildBalanceRows(report: DailyStatementReport | null): StatementRow[] {
  const ratio = report?.equityRatio ?? null;

  return [
    ["newBalance", money(report?.newBalance ?? null)],
    ["floatingPl", money(report?.floating ?? null)],
    ["equity", money(report?.equity ?? null)],
    ["marginRequired", money(report?.marginRequired ?? null)],
    ["effectiveMargin", money(report?.effectiveMargin ?? null)],
    [
      "equityRate",
      ratio === null
        ? EMPTY
        : `${ratio.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}%`,
    ],
  ];
}

function StatementRows({
  labels,
  rows,
}: {
  labels: Record<string, string>;
  rows: ReadonlyArray<StatementRow>;
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

function StatusBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/20 px-4 py-5 text-sm text-zinc-400">
      {children}
    </div>
  );
}

function formatLot(lot: number | null) {
  return lot === null ? EMPTY : `${lot.toFixed(2)} Lot`;
}

export function ClientAreaDailyStatementPanel({
  locale,
}: ClientAreaDailyStatementPanelProps) {
  const { clientArea } = getMessages(locale);
  const copy = clientArea.dailyStatementPage;
  const messages = MESSAGES[locale];
  const { accountMode } = useClientAreaAccountMode();
  const { state, retry } = useDailyStatement(accountMode);
  const [activeTab, setActiveTab] = useState<StatementTab>("account");
  const [isDownloading, setIsDownloading] = useState(false);

  const report = state.status === "ready" ? state.report : null;
  const headerRows: StatementRow[] = [
    ["accountNumber", report?.accountId ?? EMPTY],
    ["aeCode", report?.aeCode ?? EMPTY],
    ["date", report?.statementDate ?? EMPTY],
  ];
  const summaryRows = buildSummaryRows(report);
  const balanceRows = buildBalanceRows(report);

  const tabs: Array<{ id: StatementTab; label: string }> = [
    { id: "account", label: copy.tabs.account },
    { id: "open", label: copy.tabs.open },
    { id: "settled", label: copy.tabs.settled },
  ];

  async function downloadStatement() {
    if (!report) {
      return;
    }

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
      pdf.text(`${copy.labels.accountNumber}: ${report.accountId}`, 18, 48);
      pdf.text(`${copy.labels.aeCode}: ${report.aeCode ?? EMPTY}`, 18, 56);
      pdf.text(`${copy.labels.date}: ${report.statementDate ?? EMPTY}`, 18, 64);

      let y = 82;
      const rows: Array<[string, string]> =
        activeTab === "account"
          ? [...summaryRows, ...balanceRows].map(([label, value]) => [
              copy.labels[label as keyof typeof copy.labels] as string,
              value,
            ])
          : activeTab === "open"
            ? report.positions.map((item) => [
                `${item.productName} / ${item.side.toUpperCase()} ${formatLot(item.lot)}`,
                `${formatPrice(item.openPrice)} to ${formatPrice(item.closingPrice)} / ${
                  item.floating === null ? EMPTY : formatSignedUsd(item.floating)
                }`,
              ])
            : [];

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

      pdf.save(`daily-statement-${report.accountId}.pdf`);
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
        {state.status === "loading" ? (
          <StatusBox>{messages.loading}</StatusBox>
        ) : null}

        {state.status === "unavailable" ? (
          <StatusBox>{messages.unavailable}</StatusBox>
        ) : null}

        {state.status === "error" ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-4 text-sm text-red-300">
            <span>{messages.error}</span>
            <button
              type="button"
              onClick={retry}
              className="cursor-pointer rounded-lg border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/15"
            >
              {messages.retry}
            </button>
          </div>
        ) : null}

        {report && activeTab === "account" ? (
          <>
            <div className="rounded-2xl border border-white/15 bg-[#202125] p-5 sm:p-6">
              <StatementRows labels={copy.labels} rows={headerRows} />
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#202125] p-5 sm:p-6">
              <StatementRows labels={copy.labels} rows={summaryRows} />
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#202125] p-5 sm:p-6">
              <StatementRows labels={copy.labels} rows={balanceRows} />
            </div>
          </>
        ) : null}

        {report && activeTab === "open" ? (
          report.positions.length === 0 ? (
            <StatusBox>{messages.openEmpty}</StatusBox>
          ) : (
            <>
            <p className="rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-4 py-3 text-sm leading-6 text-yellow-200">
              {messages.openAsOf(report.statementDate ?? EMPTY)}{" "}
              <Link
                href={resolveLocalizedHref(locale, "/client-area/transaction")}
                className="font-semibold underline underline-offset-2 hover:text-yellow-100"
              >
                {messages.openLiveLink}
              </Link>
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#202125]">
              {report.positions.map((position, index) => (
                <article
                  key={`${position.productName}-${position.orderDate}-${position.time}-${index}`}
                  className="grid gap-4 border-b border-white/10 p-5 last:border-b-0 sm:grid-cols-[1.2fr_repeat(3,1fr)] sm:items-center"
                >
                  <div>
                    <p className="font-bold text-white">{position.productName}</p>
                    <p
                      className={`mt-1 text-xs font-semibold ${
                        position.side === "buy"
                          ? "text-emerald-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {position.side.toUpperCase()} / {formatLot(position.lot)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">
                      {copy.labels.openPrice}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {formatPrice(position.openPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">
                      {copy.labels.marketPrice}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">
                      {formatPrice(position.closingPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">
                      {copy.labels.floatingPl}
                    </p>
                    <p
                      className={`mt-1 text-sm font-bold ${
                        position.floating === null
                          ? "text-zinc-500"
                          : position.floating >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                      }`}
                    >
                      {position.floating === null
                        ? EMPTY
                        : formatSignedUsd(position.floating)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            </>
          )
        ) : null}

        {report && activeTab === "settled" ? (
          <StatusBox>
            {report.settledCount > 0
              ? messages.settledUnmapped
              : messages.settledEmpty}
          </StatusBox>
        ) : null}
      </div>

      <button
        type="button"
        disabled={isDownloading || !report}
        onClick={downloadStatement}
        className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-80 sm:text-base"
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
