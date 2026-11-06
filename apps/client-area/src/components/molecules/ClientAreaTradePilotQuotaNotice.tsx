"use client";

import { StoreBadgeLink } from "@/components/atoms/StoreBadgeLink";
import { AppDownloadModalTriggerButton } from "@/components/molecules/AppDownloadModalTriggerButton";
import {
  CLIENT_AREA_TRADE_PILOT_APP_LINKS,
  type ClientAreaTradePilotCopy,
} from "@/lib/client-area-trade-pilot.shared";
import type { TradePilotCreditBalance } from "@/lib/trade-pilot/trade-pilot.types";
import type { AppLocale } from "@/locales";

export type ClientAreaTradePilotQuotaNoticeKind =
  | "demo_daily"
  | "demo_expired"
  | "no_equity"
  | "equity_unknown";

type ClientAreaTradePilotQuotaNoticeProps = {
  copy: ClientAreaTradePilotCopy["quotaNotice"];
  kind: ClientAreaTradePilotQuotaNoticeKind;
  locale: AppLocale;
  /** Sudah diformat; dipakai untuk {date} (reset kuota / akhir masa demo). */
  date: string | null;
  /** Saldo mode aktif — allowance, periode & masa berlaku mengikuti konsol admin. */
  credit?: TradePilotCreditBalance;
  /** Equity minimum akun live (USD) untuk mode Real, dari konsol admin. */
  minEquityUsd?: number | null;
};

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/**
 * Disclaimer kuota TradePilot:
 * - demo_daily / demo_expired: ajakan buka akun live (modal download app SGB)
 *   atau download aplikasi TradePilot.
 * - no_equity / equity_unknown: mode Real hanya selama akun live punya equity.
 */
export function ClientAreaTradePilotQuotaNotice({
  copy,
  kind,
  locale,
  date,
  credit,
  minEquityUsd,
}: ClientAreaTradePilotQuotaNoticeProps) {
  const numberLocale = locale === "en" ? "en-US" : "id-ID";
  const values = {
    allowance: credit ? String(credit.allowance) : "-",
    date: date ?? "-",
    days: credit?.trialDays ? String(credit.trialDays) : "-",
    minEquity:
      minEquityUsd === null || minEquityUsd === undefined
        ? "-"
        : `$${minEquityUsd.toLocaleString(numberLocale, { maximumFractionDigits: 2 })}`,
    per: copy.periodLabels[credit?.period ?? "daily"],
  };
  const isDemo = kind === "demo_daily" || kind === "demo_expired";
  const title =
    kind === "demo_daily"
      ? copy.demoDailyTitle
      : kind === "demo_expired"
        ? copy.demoExpiredTitle
        : copy.noEquityTitle;
  const body =
    kind === "demo_daily"
      ? copy.demoDailyBody
      : kind === "demo_expired"
        ? copy.demoExpiredBody
        : kind === "no_equity"
          ? copy.noEquityBody
          : copy.equityUnknownBody;

  return (
    <div
      role="status"
      className="mt-3 space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100"
    >
      <div className="space-y-1">
        <p className="text-sm font-bold text-amber-200">{fill(title, values)}</p>
        <p className="leading-5 text-amber-100/90">{fill(body, values)}</p>
      </div>

      {isDemo ? (
        <div className="space-y-2">
          <AppDownloadModalTriggerButton
            locale={locale}
            label={copy.openLiveCta}
            variant="primary"
            size="sm"
            className="w-full !px-4 !text-sm"
          />
          <p className="pt-1 text-center text-[11px] font-semibold text-amber-100/80">
            {copy.downloadTradePilotTitle}
          </p>
          <div className="flex items-center justify-center gap-2">
            <StoreBadgeLink
              alt={copy.googlePlayAlt}
              className="inline-flex w-32 p-0.5 transition hover:bg-amber-400/10"
              href={CLIENT_AREA_TRADE_PILOT_APP_LINKS.googlePlay}
              imageClassName="h-auto w-full object-contain"
              imageSrc="/assets/GOOGLE-PLAY.webp"
              sizes="128px"
            />
            <StoreBadgeLink
              alt={copy.appStoreAlt}
              className="inline-flex w-32 p-0.5 transition hover:bg-amber-400/10"
              href={CLIENT_AREA_TRADE_PILOT_APP_LINKS.appStore}
              imageClassName="h-auto w-full object-contain"
              imageSrc="/assets/APPS-STORE.webp"
              sizes="128px"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
