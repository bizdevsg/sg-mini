"use client";

import { useState } from "react";
import { AlertTriangle, History } from "lucide-react";

import { ClientAreaLivePriceCard } from "@/components/atoms/ClientAreaLivePriceCard";
import { ClientAreaMarketInsightBiasIndicator } from "@/components/atoms/ClientAreaMarketInsightBiasIndicator";
import { ClientAreaBackLink } from "@/components/molecules/ClientAreaBackLink";
import { ClientAreaMarketSignalHeader } from "@/components/molecules/ClientAreaMarketSignalHeader";
import { ClientAreaMarketSignalHistoryList } from "@/components/molecules/ClientAreaMarketSignalHistoryList";
import { ClientAreaMarketSignalNewsSection } from "@/components/molecules/ClientAreaMarketSignalNewsSection";
import { ClientAreaMarketSignalSummaryCard } from "@/components/molecules/ClientAreaMarketSignalSummaryCard";
import { ClientAreaSignalTransactionModal } from "@/components/molecules/ClientAreaSignalTransactionModal";
import { formatQuoteNumber } from "@/components/molecules/live-quote.shared";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  formatMarketSignalUpdateTime,
  resolveMarketSignalCategoryIconSrc,
  resolveMarketSignalLiveQuoteSymbol,
  type ArticleItem,
} from "@/components/organisms/client-area.shared";
import { useLiveQuoteStream } from "@/hooks/useLiveQuoteStream";
import { getClientAreaAppStoreLinks } from "@/lib/solidGoldAppLinks";
import type { MarketSignalRecord } from "@/lib/market-signal";
import { formatLocaleNumber, getMessages, type AppLocale } from "@/locales";

type ClientAreaMarketSignalDetailPanelProps = {
  backLabel: string;
  historySignals: MarketSignalRecord[];
  item: MarketSignalRecord;
  locale: AppLocale;
  newsArticles: ArticleItem[];
};

function parseQuoteValue(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim().replace(/,/g, "");

  if (!/^-?\d+(\.\d+)?$/.test(normalizedValue)) {
    return null;
  }

  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : null;
}

function getQuoteDecimalPlaces(value?: string | null) {
  if (!value) {
    return 0;
  }

  const normalizedValue = value.trim().replace(/,/g, "");
  const decimalPart = normalizedValue.split(".")[1];

  return decimalPart?.length ?? 0;
}

function formatSignedValue(
  value: number,
  locale: AppLocale,
  fractionDigits: number,
) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  const formattedValue = formatLocaleNumber(
    Math.abs(value).toFixed(fractionDigits),
    locale,
  );

  return `${prefix}${formattedValue}`;
}

export function ClientAreaMarketSignalDetailPanel({
  backLabel,
  historySignals,
  item,
  locale,
  newsArticles,
}: ClientAreaMarketSignalDetailPanelProps) {
  const messages = getMessages(locale);
  const detailCopy = messages.clientArea.marketSignalDetail;
  const isSell = item.potensi?.toLowerCase() === "sell";
  const biasDirection = isSell ? "down" : "up";
  const biasLabel = isSell
    ? detailCopy.biasDownLabel
    : detailCopy.biasUpLabel;
  const theme = isSell
    ? {
      border: "border-red-500/10",
      button: "bg-red-600 hover:bg-red-500 text-white",
    }
    : {
      border: "border-green-500/10",
      button: "bg-green-600 hover:bg-green-500 text-white",
    };

  const categoryIconSrc = resolveMarketSignalCategoryIconSrc(item.categorySlug);
  const updateLabel = formatMarketSignalUpdateTime(item.updatedAt, locale);

  const liveQuoteSymbol = resolveMarketSignalLiveQuoteSymbol(item.categorySlug);
  const { quotes: liveQuotes } = useLiveQuoteStream();
  const liveTick = liveQuoteSymbol ? liveQuotes[liveQuoteSymbol] : undefined;
  const bidPriceLabel = liveTick?.buy
    ? formatQuoteNumber(liveTick.buy, locale)
    : "-";
  const askPriceLabel = liveTick?.sell
    ? formatQuoteNumber(liveTick.sell, locale)
    : "-";
  const currentPriceValue =
    parseQuoteValue(liveTick?.price) ??
    (() => {
      const buyValue = parseQuoteValue(liveTick?.buy);
      const sellValue = parseQuoteValue(liveTick?.sell);

      if (buyValue === null || sellValue === null) {
        return null;
      }

      return (buyValue + sellValue) / 2;
    })();
  const openPriceValue = parseQuoteValue(liveTick?.oprice);
  const todayMovementValue =
    currentPriceValue !== null &&
      openPriceValue !== null &&
      openPriceValue !== 0
      ? currentPriceValue - openPriceValue
      : null;
  const todayMovementPercent =
    todayMovementValue !== null && openPriceValue
      ? (todayMovementValue / openPriceValue) * 100
      : null;
  const todayMovementDecimalPlaces = Math.max(
    getQuoteDecimalPlaces(liveTick?.price),
    getQuoteDecimalPlaces(liveTick?.buy),
    getQuoteDecimalPlaces(liveTick?.sell),
    getQuoteDecimalPlaces(liveTick?.oprice),
  );
  const todayMovementLabel =
    todayMovementValue !== null && todayMovementPercent !== null
      ? `${formatSignedValue(
        todayMovementValue,
        locale,
        todayMovementDecimalPlaces,
      )} (${formatSignedValue(todayMovementPercent, locale, 2)}%)`
      : "-";
  const todayMovementTone =
    todayMovementValue === null
      ? "netral"
      : todayMovementValue > 0
        ? "buy"
        : todayMovementValue < 0
          ? "sell"
          : "netral";

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const appPromoMessages = messages.appPromoSection;
  const { googlePlayLink, appStoreLink } = getClientAreaAppStoreLinks(locale);
  const transactionModalCopy = isSell
    ? {
      badgeLabel: detailCopy.transactionModal.sellBadgeLabel,
      title: detailCopy.transactionModal.sellTitle,
      description: detailCopy.transactionModal.sellDescription,
    }
    : {
      badgeLabel: detailCopy.transactionModal.buyBadgeLabel,
      title: detailCopy.transactionModal.buyTitle,
      description: detailCopy.transactionModal.buyDescription,
    };

  return (
    <ClientAreaShell activeTab="home" locale={locale}>
      <ClientAreaBackLink href={`/${locale}/client-area`} label={backLabel} className="mb-5" />

      <div className="relative space-y-6 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-md sm:p-8">
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
            isSell
              ? "from-red-500/0 via-red-500 to-red-500/0"
              : "from-green-500/0 via-green-500 to-green-500/0"
          }`}
        />

        <ClientAreaMarketSignalHeader
          categoryIconSrc={categoryIconSrc}
          categoryName={item.categoryName}
          updatedLabel={detailCopy.updatedLabel}
          updateValue={updateLabel}
        />

        <div>
          <p className="mb-1.5 text-sm text-zinc-400">{detailCopy.biasLabel}</p>
          <ClientAreaMarketInsightBiasIndicator
            direction={biasDirection}
            label={biasLabel}
          />
        </div>

        {/* Bid / Ask price */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ClientAreaLivePriceCard
            label={detailCopy.bidPriceLabel}
            tone="netral"
            value={bidPriceLabel}
          />

          <ClientAreaLivePriceCard
            label={detailCopy.askPriceLabel}
            tone="netral"
            value={askPriceLabel}
          />

          <ClientAreaLivePriceCard
            label={detailCopy.todayMovementLabel}
            tone={todayMovementTone}
            value={todayMovementLabel}
          />
        </div>

        <ClientAreaMarketSignalSummaryCard
          buttonClassName={theme.button}
          buttonLabel={
            isSell ? detailCopy.sellActionLabel : detailCopy.buyActionLabel
          }
          borderClassName={theme.border}
          entryLabel={detailCopy.entryLabel}
          entryValue={item.entry}
          imageAlt={item.title || item.categoryName}
          imageUrl={item.imageUrl}
          sourceLabel={detailCopy.sourceLabel}
          sourceValue={item.source}
          stopLossLabel={detailCopy.stopLossLabel}
          stopLossValue={item.stopLoss || "-"}
          takeProfitLabel={detailCopy.takeProfitLabel}
          takeProfitValue={item.takingProfit || "-"}
          timeframeLabel={detailCopy.timeframeLabel}
          timeframeValue={item.timeframe}
          title={detailCopy.latestSignalTitle}
          updatedLabel={detailCopy.updatedLabel}
          updateValue={updateLabel}
          onButtonClick={() => setIsTransactionModalOpen(true)}
        />
      </div>

      {newsArticles.length > 0 ? (
        <ClientAreaMarketSignalNewsSection
          items={newsArticles}
          locale={locale}
          title={detailCopy.latestNewsTitle}
        />
      ) : null}

      <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-amber-500/20 bg-amber-500/[0.04] p-5 sm:flex-row sm:p-8">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
        <div className="space-y-1.5">
          <p className="font-bold text-amber-500">Disclaimer</p>
          <p className="text-sm text-zinc-400">
            Informasi ini hanya sebagai referensi, bukan rekomendasi transaksi. Risiko dan keputusan trading sepenuhnya tanggung jawab nasabah.
          </p>
        </div>
      </div>

      {historySignals.length > 0 ? (
        <div className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-md sm:p-8">
          <div className="flex items-start gap-2 sm:items-center">
            <History className="h-5 w-5 text-yellow-500" />
            <p className="text-lg font-semibold text-white sm:text-xl">
              {detailCopy.historyTitle}
            </p>
          </div>

          <ClientAreaMarketSignalHistoryList
            items={historySignals}
            locale={locale}
          />
        </div>
      ) : null}

      <ClientAreaSignalTransactionModal
        isOpen={isTransactionModalOpen}
        tone={isSell ? "sell" : "buy"}
        badgeLabel={transactionModalCopy.badgeLabel}
        title={transactionModalCopy.title}
        description={transactionModalCopy.description}
        closeLabel={detailCopy.transactionModal.closeLabel}
        googlePlayLink={googlePlayLink}
        googlePlayAlt={appPromoMessages.googlePlayAlt}
        appStoreLink={appStoreLink}
        appStoreAlt={appPromoMessages.appStoreAlt}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </ClientAreaShell>
  );
}
