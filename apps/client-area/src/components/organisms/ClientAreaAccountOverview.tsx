"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { ClientAreaAccountValueCard } from "@/components/atoms/ClientAreaAccountValueCard";
import { AppDownloadModalTriggerButton } from "@/components/molecules/AppDownloadModalTriggerButton";
import { ClientAreaAccountMetricRow } from "@/components/molecules/ClientAreaAccountMetricRow";
import { useClientAreaProfile } from "@/components/providers/ClientAreaProfileProvider";
import {
  formatSignedUsd,
  formatUsd,
} from "@/components/organisms/client-area.shared";
import type {
  AccountMode,
  AccountSnapshot,
  DashboardCopy,
} from "@/components/organisms/client-area.types";
import type { AccountSummaryState } from "@/hooks/useAccountSummary";
import { getMessages, type AppLocale } from "@/locales";
import type { AccountSummaryCard } from "@/types/account-summary";

type ClientAreaAccountOverviewProps = {
  accountMode: AccountMode;
  copy: DashboardCopy;
  currentAccount: AccountSnapshot;
  isAccountMenuOpen: boolean;
  locale: AppLocale;
  onRetry: () => void;
  onSelectAccountMode: (mode: AccountMode) => void;
  onToggleAccountMode: () => void;
  summaryState: AccountSummaryState;
};

const EMPTY_VALUE = "—";

const ACCOUNT_METRICS: Array<{
  key:
  | "marginRequired"
  | "callMarginPlace"
  | "autoLiquidation"
  | "effectiveMargin"
  | "equityRatio";
  labelKey:
  | "marginRequiredLabel"
  | "callMarginPlaceLabel"
  | "autoLiquidationLabel"
  | "effectiveMarginLabel"
  | "equityRatioLabel";
}> = [
    {
      key: "marginRequired",
      labelKey: "marginRequiredLabel",
    },
    {
      key: "callMarginPlace",
      labelKey: "callMarginPlaceLabel",
    },
    {
      key: "autoLiquidation",
      labelKey: "autoLiquidationLabel",
    },
    {
      key: "effectiveMargin",
      labelKey: "effectiveMarginLabel",
    },
    {
      key: "equityRatio",
      labelKey: "equityRatioLabel",
    },
  ];

function resolveMetricValue(
  summary: AccountSummaryCard | null,
  metricKey: (typeof ACCOUNT_METRICS)[number]["key"],
) {
  const value = summary?.[metricKey];

  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  if (metricKey === "equityRatio") {
    return `${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;
  }

  return formatUsd(value);
}

function AccountValueSkeleton({
  className = "h-6 w-32",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`mx-auto block animate-pulse rounded-full bg-black/15 motion-reduce:animate-none ${className}`}
    />
  );
}

export function ClientAreaAccountOverview({
  accountMode,
  copy,
  currentAccount,
  isAccountMenuOpen,
  locale,
  onRetry,
  onSelectAccountMode,
  onToggleAccountMode,
  summaryState,
}: ClientAreaAccountOverviewProps) {
  const profile = useClientAreaProfile();
  const accountMetricsId = useId();
  const [areAccountMetricsOpen, setAreAccountMetricsOpen] = useState(false);
  const summary = summaryState.status === "ready" ? summaryState.account : null;
  const isLoading = summaryState.status === "loading";
  const messages = getMessages(locale).clientArea.accountOverview;
  const floatingPl = summary?.floatingPl ?? null;
  // Keep the mode selector available, but hide empty figures when no Real account exists.
  const hasNoRealAccount =
    summaryState.status === "unavailable" && accountMode === "real";
  const shouldShowAccountMetrics =
    summaryState.status === "loading" || summaryState.status === "ready";
  const accountOptions = [
    {
      accountId:
        profile.accountIds.demo ??
        (accountMode === "demo" ? summary?.accountId : null),
      label: copy.demoAccount.typeLabel,
      mode: "demo" as const,
    },
    {
      accountId:
        profile.accountIds.real ??
        (accountMode === "real" ? summary?.accountId : null),
      label: copy.realAccount.typeLabel,
      mode: "real" as const,
    },
  ];
  const activeAccountId =
    accountOptions.find((option) => option.mode === accountMode)?.accountId ??
    null;

  return (
    <div className="space-y-3" aria-busy={isLoading}>
      {isLoading ? (
        <span className="sr-only" role="status" aria-live="polite">
          {messages.loading}
        </span>
      ) : null}
      <div
        className="relative h-fit overflow-hidden rounded-3xl border border-yellow-400/30 bg-cover bg-center bg-no-repeat p-5 text-black shadow-2xl"
        style={{ backgroundImage: "url('/assets/bg-profile.webp')" }}
      >
        <div className="relative mb-4 flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="relative">
              <button
                type="button"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                onClick={onToggleAccountMode}
                className={`flex min-w-44 items-center gap-2 rounded-xl border bg-zinc-950/50 px-2 py-2 text-left text-white shadow-lg transition-colors ${accountMode === "demo"
                  ? "border-red-500/70 hover:border-red-400"
                  : "border-yellow-400/70 hover:border-yellow-300"
                  }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${accountMode === "demo"
                    ? "bg-green-500/50 text-green-100"
                    : "bg-yellow-400/50 text-yellow-100"
                    }`}
                >
                  {accountMode === "demo" ? "D" : "R"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                    {currentAccount.typeLabel}
                  </span>
                  <span className="block truncate text-xs font-semibold text-white">
                    {activeAccountId ?? messages.unavailableAccount}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-300 transition-transform duration-300 motion-reduce:transition-none ${isAccountMenuOpen ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              <div
                aria-hidden={!isAccountMenuOpen}
                inert={!isAccountMenuOpen}
                role="menu"
                className={`absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-4rem)] origin-top-left rounded-2xl border border-white/10 bg-zinc-950 p-2 text-white shadow-2xl transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none ${isAccountMenuOpen
                  ? "visible pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "invisible pointer-events-none -translate-y-2 scale-95 opacity-0"
                  }`}
              >
                <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  {messages.availableAccounts}
                </p>
                <div className="space-y-1">
                  {accountOptions.map((option) => {
                    const isActive = accountMode === option.mode;
                    const isAvailable = Boolean(option.accountId);

                    return (
                      <button
                        key={option.mode}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isActive}
                        disabled={!isAvailable}
                        onClick={() => onSelectAccountMode(option.mode)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${isActive
                          ? "border-yellow-400/50 bg-yellow-400/10"
                          : "border-transparent hover:border-white/10 hover:bg-white/5"
                          } disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-transparent disabled:hover:bg-transparent`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${option.mode === "demo"
                            ? "bg-green-500/50 text-green-100"
                            : "bg-yellow-400/15 text-yellow-100"
                            }`}
                        >
                          {option.mode === "demo" ? "D" : "R"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-white">
                            {option.label}
                          </span>
                          <span className="block truncate text-[11px] text-zinc-400">
                            {option.accountId ?? messages.unavailableAccount}
                          </span>
                        </span>
                        {isActive ? (
                          <Check className="h-4 w-4 shrink-0 text-yellow-400" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/20 bg-zinc-900 shadow sm:h-13 sm:w-13">
            <FontAwesomeIcon
              icon={["fas", "user"]}
              className="text-yellow-400"
            />
          </div>
        </div>

        <div className="relative grid gap-2 sm:gap-2.5">
          {hasNoRealAccount ? null : (
            <>
              <ClientAreaAccountValueCard
                label={messages.balanceLabel}
                surfaceClassName="bg-orange-500/70"
                value={
                  isLoading ? (
                    <AccountValueSkeleton />
                  ) : summary?.balance == null ? (
                    EMPTY_VALUE
                  ) : (
                    formatUsd(summary.balance)
                  )
                }
                valueClassName="text-neutral-950"
              />
              <ClientAreaAccountValueCard
                label={messages.floatingPlLabel}
                surfaceClassName="bg-white/50"
                value={
                  isLoading ? (
                    <AccountValueSkeleton className="h-6 w-28" />
                  ) : floatingPl === null ? (
                    EMPTY_VALUE
                  ) : (
                    formatSignedUsd(floatingPl)
                  )
                }
                valueClassName={
                  floatingPl === null || isLoading
                    ? "text-neutral-950"
                    : floatingPl >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                }
              />
              <ClientAreaAccountValueCard
                label={messages.equityLabel}
                surfaceClassName="bg-orange-500/70"
                value={
                  isLoading ? (
                    <AccountValueSkeleton className="h-6 w-36" />
                  ) : summary?.equity == null ? (
                    EMPTY_VALUE
                  ) : (
                    formatUsd(summary.equity)
                  )
                }
                valueClassName="text-neutral-950"
              />
            </>
          )}
          {summaryState.status === "error" ? (
            <p className="flex items-center justify-between gap-3 rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold text-red-700">
              <span>{messages.error}</span>
              <button
                type="button"
                onClick={onRetry}
                className="cursor-pointer rounded-full bg-black px-3 py-1 text-[11px] font-bold text-yellow-400 transition hover:bg-zinc-800"
              >
                {messages.retry}
              </button>
            </p>
          ) : null}
          {hasNoRealAccount ? (
            <div
              role="note"
              className="space-y-2 m-0 rounded-xl border border-amber-500/40 bg-white/70 px-3 py-3 text-neutral-900"
            >
              <p className="text-sm font-extrabold">
                {messages.realAccountDisclaimerTitle}
              </p>
              <p className="text-sm font-medium leading-6 text-neutral-700">
                {messages.realAccountDisclaimerBody}
              </p>
              <AppDownloadModalTriggerButton
                locale={locale}
                label={messages.openRealAccountCta}
                variant="dark"
                size="sm"
                className="w-full !px-4 !text-sm"
              />
            </div>
          ) : null}
          {summaryState.status === "unavailable" && !hasNoRealAccount ? (
            <p className="rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold text-neutral-800">
              {messages.unavailable}
            </p>
          ) : null}
        </div>
      </div>

      {shouldShowAccountMetrics ? (
        <div
          className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-cover bg-center bg-no-repeat p-5 text-black shadow-2xl"
          style={{ backgroundImage: "url('/assets/bg-profile.webp')" }}
        >
          <button
            aria-controls={accountMetricsId}
            aria-expanded={areAccountMetricsOpen}
            aria-label={
              areAccountMetricsOpen
                ? messages.collapseAccountMetrics
                : messages.expandAccountMetrics
            }
            className="relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-1 py-1 text-left text-sm font-extrabold text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 lg:hidden"
            onClick={() => setAreAccountMetricsOpen((open) => !open)}
            type="button"
          >
            <span>{messages.accountMetricsTitle}</span>
            <ChevronDown
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${areAccountMetricsOpen ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>

          <p className="relative hidden px-1 py-1 text-sm font-extrabold text-neutral-900 lg:block">
            {messages.accountMetricsTitle}
          </p>

          <hr className="border border-zinc-500/20 mt-3" />

          <div
            className={`relative grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${areAccountMetricsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"} lg:grid-rows-[1fr] lg:opacity-100`}
            id={accountMetricsId}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="grid grid-cols-2 px-1 font-semibold text-neutral-900">
                {ACCOUNT_METRICS.map((metric, index) => (
                  <ClientAreaAccountMetricRow
                    key={metric.key}
                    className={
                      index === ACCOUNT_METRICS.length - 1
                        ? "col-span-2"
                        : undefined
                    }
                    label={messages[metric.labelKey]}
                    value={
                      isLoading ? (
                        <AccountValueSkeleton className="h-5 w-24 sm:w-28" />
                      ) : (
                        resolveMetricValue(summary, metric.key)
                      )
                    }
                    withDivider={index !== ACCOUNT_METRICS.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
