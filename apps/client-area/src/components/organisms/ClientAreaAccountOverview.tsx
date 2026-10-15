"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { ClientAreaAccountValueCard } from "@/components/atoms/ClientAreaAccountValueCard";
import { AppDownloadModalTriggerButton } from "@/components/molecules/AppDownloadModalTriggerButton";
import { ClientAreaAccountMetricRow } from "@/components/molecules/ClientAreaAccountMetricRow";
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
import type { AppLocale } from "@/locales";
import type { AccountSummaryCard } from "@/types/account-summary";

type ClientAreaAccountOverviewProps = {
  accountMode: AccountMode;
  copy: DashboardCopy;
  currentAccount: AccountSnapshot;
  isAccountMenuOpen: boolean;
  /** True when the latest refresh failed and the figures shown are the last good ones. */
  isStale?: boolean;
  locale: AppLocale;
  onRetry: () => void;
  onSelectAccountMode: (mode: AccountMode) => void;
  onToggleAccountMode: () => void;
  summaryState: AccountSummaryState;
  /** When the figures were last fetched successfully (epoch ms). */
  updatedAt?: number | null;
};

const EMPTY_VALUE = "—";

const SUMMARY_MESSAGES: Record<
  AppLocale,
  {
    error: string;
    accountMetricsTitle: string;
    collapseAccountMetrics: string;
    expandAccountMetrics: string;
    loading: string;
    openRealAccountCta: string;
    realAccountDisclaimerBody: string;
    realAccountDisclaimerTitle: string;
    retry: string;
    stale: string;
    unavailable: string;
    updated: string;
  }
> = {
  id: {
    accountMetricsTitle: "Detail Margin Akun",
    collapseAccountMetrics: "Tutup detail margin akun",
    error: "Data akun belum bisa dimuat.",
    expandAccountMetrics: "Buka detail margin akun",
    loading: "Memuat ringkasan akun...",
    openRealAccountCta: "Buka Akun Real di Aplikasi",
    realAccountDisclaimerBody:
      "Pembukaan akun Real dilakukan melalui aplikasi Solid Gold. Unduh aplikasinya, lalu ikuti proses pendaftaran akun Real.",
    realAccountDisclaimerTitle: "Anda belum memiliki akun Real",
    retry: "Coba lagi",
    stale: "Gagal memperbarui, menampilkan data terakhir",
    unavailable: "Akun untuk mode ini tidak tersedia.",
    updated: "Diperbarui",
  },
  en: {
    accountMetricsTitle: "Account Margin Details",
    collapseAccountMetrics: "Close account margin details",
    error: "Account data could not be loaded.",
    expandAccountMetrics: "Open account margin details",
    loading: "Loading account summary...",
    openRealAccountCta: "Open a Real Account in the App",
    realAccountDisclaimerBody:
      "Real accounts are opened through the Solid Gold app. Download the app, then follow the Real account registration process.",
    realAccountDisclaimerTitle: "You do not have a Real account yet",
    retry: "Try again",
    stale: "Could not refresh, showing the last data",
    unavailable: "No account is available for this mode.",
    updated: "Updated",
  },
};

const ACCOUNT_METRICS: Array<{
  key:
  | "marginRequired"
  | "callMarginPlace"
  | "autoLiquidation"
  | "effectiveMargin"
  | "equityRatio";
  label: string;
}> = [
    {
      key: "marginRequired",
      label: "Margin Required",
    },
    {
      key: "callMarginPlace",
      label: "Call Margin Place",
    },
    {
      key: "autoLiquidation",
      label: "Auto Liquidation",
    },
    {
      key: "effectiveMargin",
      label: "Effective Margin",
    },
    {
      key: "equityRatio",
      label: "Equity Ratio",
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
  isStale = false,
  locale,
  onRetry,
  onSelectAccountMode,
  onToggleAccountMode,
  summaryState,
  updatedAt = null,
}: ClientAreaAccountOverviewProps) {
  const accountMetricsId = useId();
  const [areAccountMetricsOpen, setAreAccountMetricsOpen] = useState(false);
  const summary = summaryState.status === "ready" ? summaryState.account : null;
  const isLoading = summaryState.status === "loading";
  const messages = SUMMARY_MESSAGES[locale];
  const floatingPl = summary?.floatingPl ?? null;
  // No Real account: every figure would be an empty "—", so show only the disclaimer.
  const hasNoRealAccount =
    summaryState.status === "unavailable" && accountMode === "real";
  const shouldShowAccountMetrics =
    summaryState.status === "loading" || summaryState.status === "ready";

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
        {hasNoRealAccount ? null : (
          <div className="relative mb-4 flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {/* <div className="relative">
              <button
                type="button"
                onClick={onToggleAccountMode}
                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider shadow-md transition-colors ${accountMode === "demo"
                  ? "border-red-600 bg-red-700/90 text-white hover:bg-red-800"
                  : "border-yellow-400 bg-yellow-600 text-black hover:bg-yellow-500"
                  }`}
              >
                <span>{currentAccount.typeLabel}</span>
                <FontAwesomeIcon
                  icon={["fas", "chevron-down"]}
                  className="text-[9px]"
                />
              </button>

              {isAccountMenuOpen ? (
                <div className="absolute left-0 top-8 z-10 w-40 max-w-[calc(100vw-5rem)] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-white shadow-xl">
                  <button
                    type="button"
                    onClick={() => onSelectAccountMode("demo")}
                    className="w-full px-4 py-2 text-left font-bold text-red-400 transition hover:bg-zinc-900 hover:text-red-300"
                  >
                    {copy.demoAccount.typeLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectAccountMode("real")}
                    className="w-full px-4 py-2 text-left font-bold text-yellow-400 transition hover:bg-zinc-900 hover:text-yellow-300"
                  >
                    {copy.realAccount.typeLabel}
                  </button>
                </div>
              ) : null}
            </div> */}

              {isLoading ? (
                <span
                  aria-hidden="true"
                  className="mt-1 block h-4 w-28 animate-pulse rounded-full bg-black/15 motion-reduce:animate-none"
                />
              ) : (
                <span className="break-all pr-2 text-lg font-extrabold tracking-tight text-neutral-900 sm:text-base">
                  {summary?.accountId ?? EMPTY_VALUE}
                </span>
              )}
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/20 bg-zinc-900 shadow sm:h-13 sm:w-13">
              <FontAwesomeIcon
                icon={["fas", "user"]}
                className="text-yellow-400"
              />
            </div>
          </div>
        )}

        <div className="relative grid gap-2 sm:gap-2.5">
          {hasNoRealAccount ? null : (
            <>
              <ClientAreaAccountValueCard
                label="New Balance"
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
                label="Floating P/L"
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
                label="Equity"
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
          {/* {summaryState.status === "ready" && updatedAt !== null ? (
            <p
              className={`flex items-center justify-end gap-1.5 text-[11px] font-semibold ${isStale ? "text-amber-800" : "text-neutral-800/80"
                }`}
              aria-live="off"
            >
              <span
                className={`size-1.5 rounded-full ${isStale ? "bg-amber-600" : "animate-pulse bg-emerald-600"
                  }`}
              />
              {isStale
                ? `${messages.stale} · ${new Date(updatedAt).toLocaleTimeString(
                  locale === "id" ? "id-ID" : "en-US",
                )}`
                : `${messages.updated} ${new Date(updatedAt).toLocaleTimeString(
                  locale === "id" ? "id-ID" : "en-US",
                )}`}
            </p>
          ) : null} */}
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
            className="relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-1 py-1 text-left text-sm font-extrabold text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
            onClick={() => setAreAccountMetricsOpen((open) => !open)}
            type="button"
          >
            <span>{messages.accountMetricsTitle}</span>
            <ChevronDown
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 transition-transform duration-200 ${areAccountMetricsOpen ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>

          {areAccountMetricsOpen ? (
            <div
              className="relative mt-3 space-y-3 border-t border-black/10 px-1 pt-3 font-semibold text-neutral-900"
              id={accountMetricsId}
            >
              {ACCOUNT_METRICS.map((metric, index) => (
                <ClientAreaAccountMetricRow
                  key={metric.label}
                  label={metric.label}
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
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
