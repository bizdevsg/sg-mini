"use client";

import { ClientAreaBackLink } from "@/components/molecules/ClientAreaBackLink";
import {
  formatUsd,
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import type {
  AccountSnapshot,
  WithdrawalHistoryItem,
  WithdrawalHistoryStatus,
} from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountWithdrawalHistoryPanelProps = {
  currentAccount: AccountSnapshot;
  locale: AppLocale;
  withdrawalHistory: WithdrawalHistoryItem[];
};

function maskAccountNumber(value: string) {
  if (value.length <= 4) {
    return value;
  }

  return `****${value.slice(-4)}`;
}

function getStatusTone(status: WithdrawalHistoryStatus) {
  switch (status) {
    case "completed":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "processing":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "rejected":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "pending":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }
}

function getStatusLabel(
  status: WithdrawalHistoryStatus,
  labels: ReturnType<typeof getMessages>["clientArea"]["withdrawalHistoryPage"]["status"],
) {
  switch (status) {
    case "completed":
      return labels.completed;
    case "processing":
      return labels.processing;
    case "rejected":
      return labels.rejected;
    case "pending":
      return labels.pending;
  }
}

function WithdrawalHistoryCard({
  item,
  labels,
}: {
  item: WithdrawalHistoryItem;
  labels: ReturnType<typeof getMessages>["clientArea"]["withdrawalHistoryPage"];
}) {
  return (
    <article className="rounded-[22px] border border-zinc-800 bg-zinc-900/70 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-white">{item.id}</h3>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusTone(item.status)}`}
            >
              {getStatusLabel(item.status, labels.status)}
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            {item.requestedAt}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xl font-black text-white">{formatUsd(item.amount)}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {labels.list.netAmount}: {formatUsd(item.netAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.destination}
          </p>
          <p className="mt-1 text-zinc-100">
            {item.bankName} / {maskAccountNumber(item.accountNumber)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.accountHolder}
          </p>
          <p className="mt-1 text-zinc-100">{item.accountHolder}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.processedDate}
          </p>
          <p className="mt-1 text-zinc-100">{item.processedAt ?? "-"}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.fee}
          </p>
          <p className="mt-1 text-zinc-100">{formatUsd(item.fee)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.reference}
          </p>
          <p className="mt-1 text-zinc-100">{item.referenceNumber}</p>
        </div>
        <div className="sm:max-w-[60%] sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {labels.list.note}
          </p>
          <p className="mt-1 text-zinc-300">{item.note ?? "-"}</p>
        </div>
      </div>
    </article>
  );
}

export function ClientAreaAccountWithdrawalHistoryPanel({
  currentAccount,
  locale,
  withdrawalHistory,
}: ClientAreaAccountWithdrawalHistoryPanelProps) {
  const { clientArea } = getMessages(locale);
  const labels = clientArea.withdrawalHistoryPage;
  const accountHref = resolveLocalizedHref(locale, "/client-area/account");

  return (
    <div className="space-y-5 rounded-[34px] border border-zinc-800 bg-black/45 p-4 backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ClientAreaBackLink
          href={accountHref}
          label={clientArea.accountPage.backLabel}
        />

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            {clientArea.accountPage.activeAccount}
          </p>
          <p className="mt-1 text-base font-bold text-white">
            {currentAccount.accountId}
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-500/90">
          {currentAccount.typeLabel}
        </p>
        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          {labels.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-300 sm:text-base">
          {labels.description}
        </p>
      </div>

      {withdrawalHistory.length > 0 ? (
        <div className="space-y-3">
          {withdrawalHistory.map((item) => (
            <WithdrawalHistoryCard key={item.id} item={item} labels={labels} />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-zinc-700 bg-zinc-900/60 px-5 py-6">
          <h3 className="text-lg font-bold text-white">{labels.emptyTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {labels.emptyBody}
          </p>
        </div>
      )}
    </div>
  );
}
