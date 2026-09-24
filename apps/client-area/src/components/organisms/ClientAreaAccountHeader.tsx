"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useClientAreaAccountMode } from "@/components/providers/ClientAreaAccountModeProvider";
import {
  getClientAreaAccountModeData,
  getDashboardCopy,
} from "@/components/organisms/client-area.shared";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaAccountHeaderProps = {
  locale: AppLocale;
};

export function ClientAreaAccountHeader({
  locale,
}: ClientAreaAccountHeaderProps) {
  const accountPage = getMessages(locale).clientArea.accountPage;
  const copy = getDashboardCopy(locale);
  const { accountMode } = useClientAreaAccountMode();
  const { currentAccount } = getClientAreaAccountModeData(copy, accountMode);

  return (
    <header className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-[#1a1a1a] to-[#111111] shadow-xl shadow-black/35">
      <div className="h-2 w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-yellow-300" />

      <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-yellow-500/40 ring-4 ring-yellow-500/10 sm:h-24 sm:w-24">
              <Image
                src="/assets/client-area-profile-avatar.png"
                alt={`${accountPage.viewOnly.photoLabel} ${currentAccount.accountOwner}`}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                preload
              />
            </div>
            <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full border-2 border-[#111111] bg-yellow-500 text-black">
              <FontAwesomeIcon icon={["fas", "lock"]} className="text-xs" />
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-white sm:text-3xl">
              {currentAccount.accountOwner}
            </h1>
            <p className="mt-1 break-all text-sm text-zinc-400">
              {currentAccount.email}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {currentAccount.status}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                <FontAwesomeIcon icon={["fas", "lock"]} className="text-[10px]" />
                {accountPage.viewOnly.badge}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full rounded-xl border border-white/10 bg-black/30 px-5 py-3 lg:w-auto lg:min-w-48">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {accountPage.viewOnly.accountIdLabel}
          </span>
          <span className="mt-1 block text-lg font-bold tracking-wider text-white">
            {currentAccount.accountId}
          </span>
        </div>
      </div>
    </header>
  );
}
