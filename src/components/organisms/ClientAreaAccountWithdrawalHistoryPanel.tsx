"use client";

import { ClientAreaBackLink } from "@/components/molecules/ClientAreaBackLink";
import { ClientAreaWithdrawalHistoryCard } from "@/components/molecules/ClientAreaWithdrawalHistoryCard";
import {
  resolveLocalizedHref,
} from "@/components/organisms/client-area.shared";
import type {
  AccountSnapshot,
  WithdrawalHistoryItem,
} from "@/components/organisms/client-area.types";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountWithdrawalHistoryPanelProps = {
  currentAccount: AccountSnapshot;
  locale: AppLocale;
  withdrawalHistory: WithdrawalHistoryItem[];
};

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
            <ClientAreaWithdrawalHistoryCard
              key={item.id}
              item={item}
              labels={labels}
            />
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
