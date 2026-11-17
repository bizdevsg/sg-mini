"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { MiniChart } from "@/components/organisms/MiniChart";
import { getLiveQuoteDisplay } from "@/lib/live-quotes";
import { getMessages, type AppLocale } from "@/locales";

type ClientAreaMarketChartModalProps = {
  locale: AppLocale;
  marketCode: string | null;
  onClose: () => void;
};

export function ClientAreaMarketChartModal({
  locale,
  marketCode,
  onClose,
}: ClientAreaMarketChartModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const clientAreaCopy = getMessages(locale).clientArea;
  const chartCopy = clientAreaCopy.homeChart;
  const titleId = "client-area-market-chart-modal-title";

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (marketCode && !dialog.open) {
      dialog.showModal();
    } else if (!marketCode && dialog.open) {
      dialog.close();
    }
  }, [marketCode]);

  const marketLabel = marketCode
    ? getLiveQuoteDisplay(marketCode).label
    : chartCopy.unavailableTitle;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="m-auto max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-7xl overflow-hidden rounded-3xl border border-white/15 bg-[#080a0b] p-0 text-left text-zinc-100 shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]"
    >
      <div className="max-h-[calc(100dvh-1rem)] overflow-y-auto p-3 sm:max-h-[calc(100dvh-2rem)] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4 px-1 sm:mb-5">
          <div className="min-w-0">
            <p className="text-xl font-semibold text-white">
              {clientAreaCopy.marketTransactions.liveChartLabel}
            </p>
          </div>

          <button
            type="button"
            aria-label={chartCopy.closeChartLabel}
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-yellow-500/60 bg-zinc-900 text-yellow-400 transition hover:bg-yellow-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {marketCode ? <MiniChart locale={locale} symbol={marketCode} /> : null}

        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:p-5">
          <Image
            src="/assets/TradingView.webp"
            alt={chartCopy.tradingViewLogoAlt}
            height={100}
            width={200}
          />
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {chartCopy.tradingViewDisclaimer}
          </p>
        </div>
      </div>
    </dialog>
  );
}
