"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClientAreaAccountValueCard } from "@/components/atoms/ClientAreaAccountValueCard";
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
  locale: AppLocale;
  onRetry: () => void;
  onSelectAccountMode: (mode: AccountMode) => void;
  onToggleAccountMode: () => void;
  summaryState: AccountSummaryState;
};

const EMPTY_VALUE = "—";

const SUMMARY_MESSAGES: Record<
  AppLocale,
  { error: string; retry: string; unavailable: string }
> = {
  id: {
    error: "Data akun belum bisa dimuat.",
    retry: "Coba lagi",
    unavailable: "Akun untuk mode ini tidak tersedia.",
  },
  en: {
    error: "Account data could not be loaded.",
    retry: "Try again",
    unavailable: "No account is available for this mode.",
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
  const summary = summaryState.status === "ready" ? summaryState.account : null;
  const messages = SUMMARY_MESSAGES[locale];
  const floatingPl = summary?.floatingPl ?? null;

  return (
    <div className="space-y-3">
      <div
        className="relative h-fit overflow-hidden rounded-3xl border border-yellow-400/30 bg-cover bg-center bg-no-repeat p-5 text-black shadow-2xl"
        style={{ backgroundImage: "url('/assets/bg-profile.svg')" }}
      >
        <div className="relative mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="relative">
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
            </div>

            <span className="break-all pr-2 text-sm font-extrabold tracking-tight text-neutral-900 sm:text-base">
              {summary?.accountId ?? EMPTY_VALUE}
            </span>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/20 bg-zinc-900 shadow sm:h-13 sm:w-13">
            <FontAwesomeIcon
              icon={["fas", "user"]}
              className="text-yellow-400"
            />
          </div>
        </div>

        <div className="relative grid gap-2 sm:gap-2.5">
          <ClientAreaAccountValueCard
            label="New Balance"
            surfaceClassName="bg-orange-500/70"
            value={summary?.balance == null ? EMPTY_VALUE : formatUsd(summary.balance)}
            valueClassName="text-neutral-950"
          />
          <ClientAreaAccountValueCard
            label="Floating P/L"
            surfaceClassName="bg-white/50"
            value={floatingPl === null ? EMPTY_VALUE : formatSignedUsd(floatingPl)}
            valueClassName={
              floatingPl === null
                ? "text-neutral-950"
                : floatingPl >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
            }
          />
          <ClientAreaAccountValueCard
            label="Equity"
            surfaceClassName="bg-orange-500/70"
            value={summary?.equity == null ? EMPTY_VALUE : formatUsd(summary.equity)}
            valueClassName="text-neutral-950"
          />
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
          {summaryState.status === "unavailable" ? (
            <p className="rounded-xl bg-white/60 px-3 py-2 text-xs font-semibold text-neutral-800">
              {messages.unavailable}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-cover bg-center bg-no-repeat p-5 text-black shadow-2xl"
        style={{ backgroundImage: "url('/assets/bg-profile.svg')" }}
      >
        <div className="relative space-y-3 px-1 font-semibold text-neutral-900">
          {ACCOUNT_METRICS.map((metric, index) => (
            <ClientAreaAccountMetricRow
              key={metric.label}
              label={metric.label}
              value={resolveMetricValue(summary, metric.key)}
              withDivider={index !== ACCOUNT_METRICS.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
