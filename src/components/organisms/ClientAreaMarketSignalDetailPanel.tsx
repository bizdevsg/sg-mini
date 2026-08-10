"use client";

import Image from "next/image";

import { ClientAreaMarketInsightBiasIndicator } from "@/components/atoms/ClientAreaMarketInsightBiasIndicator";
import { ClientAreaBackLink } from "@/components/molecules/ClientAreaBackLink";
import { ClientAreaShell } from "@/components/organisms/ClientAreaShell";
import {
  formatMarketSignalUpdateTime,
  resolveMarketSignalCategoryIconSrc,
} from "@/components/organisms/client-area.shared";
import { PUBLIC_REGISTER_URL } from "@/lib/env";
import type { MarketSignalRecord } from "@/lib/market-signal";
import type { AppLocale } from "@/locales";

type ClientAreaMarketSignalDetailPanelProps = {
  backLabel: string;
  item: MarketSignalRecord;
  locale: AppLocale;
};

export function ClientAreaMarketSignalDetailPanel({
  backLabel,
  item,
  locale,
}: ClientAreaMarketSignalDetailPanelProps) {
  const isSell = item.potensi?.toLowerCase() === "sell";
  const biasDirection = isSell ? "down" : "up";
  const biasLabel = isSell ? "Potensi Melemah" : "Potensi Menguat";
  const theme = isSell
    ? {
        card: "from-red-900/50 to-zinc-900/50",
        border: "border-red-500/10",
        timeframe: "bg-red-700 text-red-200",
        imageBg: "bg-[#2a1111]",
        button: "bg-red-700 hover:bg-red-600 text-white",
      }
    : {
        card: "from-green-900/50 to-zinc-900/50",
        border: "border-green-500/10",
        timeframe: "bg-green-700 text-green-300",
        imageBg: "bg-[#0d241c]",
        button: "bg-green-700 hover:bg-green-600 text-white",
      };

  const categoryIconSrc = resolveMarketSignalCategoryIconSrc(item.categorySlug);
  const updateLabel = formatMarketSignalUpdateTime(item.updatedAt, locale);

  return (
    <ClientAreaShell activeTab="home" locale={locale}>
      <div className="mx-auto max-w-3xl space-y-6">
        <ClientAreaBackLink
          href={`/${locale}/client-area`}
          label={backLabel}
        />

        <div
          className={`space-y-6 rounded-3xl border bg-linear-to-br p-6 sm:p-8 ${theme.card} ${theme.border}`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0">
                {categoryIconSrc ? (
                  <Image
                    src={categoryIconSrc}
                    alt={item.categoryName}
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                    {item.categoryName.slice(0, 2)}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold capitalize text-white">
                  {item.categoryName}
                </h1>

                {updateLabel ? (
                  <p className="text-sm text-zinc-400">Update {updateLabel}</p>
                ) : null}
              </div>
            </div>

            {item.timeframe ? (
              <div className={`rounded-lg px-3 py-1.5 ${theme.timeframe}`}>
                <span className="text-sm font-bold">{item.timeframe}</span>
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm text-zinc-400">Bias</p>
            <div className="mt-1 text-lg">
              <ClientAreaMarketInsightBiasIndicator
                direction={biasDirection}
                label={biasLabel}
              />
            </div>
          </div>

          {item.imageUrl ? (
            <div
              className={`relative h-[280px] w-full overflow-hidden rounded-2xl sm:h-[380px] ${theme.imageBg}`}
            >
              <Image
                src={item.imageUrl}
                alt={item.title || item.categoryName}
                fill
                sizes="768px"
                className="object-contain"
                unoptimized
              />
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 px-4 py-3.5">
              <p className="text-xs text-zinc-400">Take Profit</p>
              <p className="mt-1 text-xl font-bold text-white">
                {item.takingProfit || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 px-4 py-3.5">
              <p className="text-xs text-zinc-400">Stop Loss</p>
              <p className="mt-1 text-xl font-bold text-white">
                {item.stopLoss || "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            {item.source ? (
              <p className="text-xs italic text-zinc-500">
                Source: {item.source}
              </p>
            ) : (
              <span />
            )}

            <a
              href={PUBLIC_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`shrink-0 rounded-full px-6 py-3 text-sm font-bold text-black transition-colors ${theme.button}`}
            >
              Buka Akun Sekarang
            </a>
          </div>
        </div>
      </div>
    </ClientAreaShell>
  );
}
